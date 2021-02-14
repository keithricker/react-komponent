let Global; try { Global = Global || window } catch { Global = Global || global }
const getKeyMatch = (prop,tmp) => {
   let match = /^{{([^ ]*)}}$/.exec(prop)
   if (match && (prop in tmp)) prop = match[1]
   if (prop.split('_')[0] === "") prop = prop.slice(1)
   return prop
}
export default function klass(func) { 
  let initializations = new WeakSet()
  let Super,result,org,template = {}
  let thiss = () => { 
     if (org) return org
     let res = Super ? Super((sup,...arg) => sup(...arg)) : result ? new Global[({}).toString.call(result)]() : {}; 
     org = res; return res 
  }
  let bind = () => initializations.has(func) && template.bind && template.bind !== thiss() && template.bind
  let newKlass = { [func.name]: function(...arg) {
     let handler = {
        get(ob,prop) {
           let obProp = ob[prop]
           if (bind() && typeof obProp === 'function') {
              obProp = Reflect.get(ob,prop,bind())
              if (typeof obProp === 'function') obProp = obProp.bind(bind())
           }
           try { return getWrapper() } catch(err) { console.error(err) }
           function getWrapper() {
            if (prop === '{{target}}') return thiss()
            if (prop === 'prototype') return template.prototype ? Object.getPrototypeOf(thiss()) : undefined
            if (prop === 'properties') return (template.properties) ? ob : undefined
            if (prop === 'static') return template.static ? newKlass : undefined
            if (prop === 'bind') return bind()
            if (prop === 'super') {
               let sup = thiss().extends || Object.getPrototypeOf(thiss()).constructor
               return function superDuper(...arg) {
                  Super = function newSuper(cb) {
                     if (this().extends === Proxy)
                        return this
                     return cb(sup,...arg)
                  }
                  return sup(...arg)
               }
            }
            if (prop === 'extends') { 
               return thiss().extends || Object.getPrototypeOf(thiss()).constructor 
            }
            return obProp
           }
        },
        set(ob,prop,val) {
		   if (bind() && typeof val === 'function') val = val.bind(bind())
           if (['prototype','properties','static','extends','bind'].includes(prop)) {
               if ([`{{${prop}}}`,`_${prop}`].some(key => (key in template))) {
                  return ob[prop] = val
               }
           }
           prop = getKeyMatch(prop,template)
           try { return setWrapper() } catch(err) { console.error(err) }
           function setWrapper() {
              let thisProto = () => Object.getPrototypeOf(thiss())
              let inherits = () => Object.getPrototypeOf(thisProto()).constructor
              let ext = thiss().extends || inherits()
              if (prop === 'extends') {
                 template.extends = val
                 if (val === Proxy) return
                 Object.setPrototypeOf(thisProto(),val.prototype)
                 return Object.setPrototypeOf(newKlass,val)
              }
              if (prop === 'bind') {
                 template.bind = val
                 Reflect.ownKeys(ob).forEach(key => {
                 	let desc = Object.getOwnPropertyDescriptor(ob,key)
                    let type = desc.get ? 'get' : 'value'
                    if (typeof desc[type] === 'function') {
                       desc[type] = desc[type].bind(val)
                       Object.defineProperty(ob,key,desc)
                    }
                 })
              }
              if (prop === 'prototype') {
                 template.prototype = val
                 if (val.constructor === Object && inherits() !== Object) {
                    Reflect.ownKeys(val).filter(key => key !== 'constructor').forEach(prop => {
                       Object.defineProperty(thisProto(),prop,Object.getOwnPropertyDescriptor(val,prop))
                    })
                    return true
                 }
                 else if (!thiss().extends && Object.getPrototypeOf(func.prototype) === Object) 
                    Object.setPrototypeOf(thiss(),val)
                 else Object.setPrototypeOf(thiss(),Object.setPrototypeOf(val,ext.prototype))
                 thisProto().constructor = newKlass
                 newKlass.prototype = thisProto()
              }
              else if (prop === 'properties') {
                  template.properties = val
                  let origProto = thiss().prototype || Object.getPrototypeOf(thiss())
                  if (thiss().prototype) {
                    if (origProto.constructor === Object) origProto.constructor = func.prototype.constructor
                    if (thiss().extends) Object.setPrototypeOf(origProto,ext.prototype)
                    Object.setPrototypeOf(thiss(),origProto)
                  }
                  else if (thiss().extends) 
                    Object.setPrototypeOf(newKlass.prototype,thiss().extends.prototype)
                  Reflect.ownKeys(val)
                     .filter(key => !thiss().hasOwnProperty(key))
                     .forEach(key => {
                        Object.defineProperty(thiss(),key,Object.getOwnPropertyDescriptor(val,key))
                     })
                  return true
              }
              else if (prop === 'static') {
                  template.static = val
                  Reflect.ownKeys(val).forEach(key => {
                      Object.defineProperty(newKlass,key,Object.getOwnPropertyDescriptor(val,key))
                  })
              }
              else {
                 return ob[prop] = val
              }
              return true
           }
        }
     }
     let returnVal
     if (Super) org = Super((sup,...ar) => sup(...ar))

     let thisss = new Proxy(thiss(),handler)
     if (!initializations.has(func))
        Object.setPrototypeOf(thiss(),func.prototype)

     let firstPass = func.call(thisss,...arg)
     if (firstPass && firstPass['{{target}}'])
        firstPass = firstPass['{{target}}']

     if (!Object.keys(template).length && !(typeof firstPass === 'object' || typeof firstPass === 'function') && firstPass !== thiss && firstPass !== thisss)
        returnVal = firstPass || thiss()

     if (!returnVal) {
       if (initializations.has(func)) return firstPass || thiss()
       let secondPass
       template = {}
       if (!initializations.has(func)) {
         secondPass = func.call(new Proxy(firstPass,handler),...arg)
         initializations.add(func)
       }
       let res = secondPass['{{target}}'] || secondPass || thiss()
       returnVal = res
    }
    if (template.extends === Proxy) {
       let handle = arguments[1]
       let target = arguments[0]
       let handler = {
          get(ob,prop) {
             let def = {}
             let res=def,handleRes
             let callit = (o,p) => {
                let r = Reflect.get(o,p)
                return typeof r === 'function' ? r.bind(o) : r
             }
             if (prop in template.properties) res = callit(template.properties,prop)
             else if (template.prototype && (prop in template.prototype)) res = callit(template.prototype[prop])
             handleRes = handle.get(ob,prop)
             return (res === def) ? handleRes : res
          }
        }
        returnVal = new Proxy(target,handler)
        console.log('wha!!!!',returnVal)
    }
    result = returnVal
    return returnVal
     
  }}[func.name]
  Reflect.ownKeys(func).forEach(key => {
      Object.defineProperty(newKlass,key,Object.getOwnPropertyDescriptor(func,key))
  })
  console.log('newKlass',Object.create(newKlass))
  return newKlass
}
