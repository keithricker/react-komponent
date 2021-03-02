const proto = { get: Object.getPrototypeOf, set: Object.setPrototypeOf };
function tryCatch(exp,cb) { 
  let res; let err; 
  try { res = exp() } catch(error) { err = error } return cb ? cb(res,err) : err || res
}
function suppress(exp,deflt) { let res = tryCatch(exp); return res instanceof Error ? deflt : res }
const Global = window, _global = window

function areDescriptors(ob) {
  if (ob.constructor.name === 'Descriptors') return true
  let keys = Reflect.ownKeys(ob)
  if (!ob.length || !keys.every(key => isNaN(key))) return false
  let copy = Object.getOwnPropertyDescriptors(Object.defineProperties({},ob))
  return JSON.stringify(ob) === JSON.stringify(copy)
}

function merge(target,src,exclude,binder) {
  let callback = (typeof exclude === 'function') ? exclude : undefined
  if (!Array.isArray(exclude)) exclude = []

  if (Array.isArray(target) && Array.isArray(src))
    return [...target,...src.filter(item => !exclude.includes(item) && target)]
  if (target[Symbol.iterator] && src[Symbol.iterator]) {
    if (target instanceof HTMLCollection) {
      target.parentNode.replaceChildren(...target.children, ...src)
    }
    else if (target.set)
      [...src].forEach(item => target.set(...item))
    else if (target.add) {
      [...src].forEach(item => target.add(item))
    }
    return target
  }
  if (target instanceof Element) {
    if (src instanceof Element) {
      target.replaceChildren(...target.children,...src.children)
      Reflect.ownKeys(src).filter(key => key !== 'children' && key !== 'childNodes').forEach(key => {
        if (target[key][Symbol.iterator]) {
          try { merge(target[key],src[key]) } catch {}
        }
        else try { target.setAttribute(key,src[key]) } catch {}
      })
    }
    else if (src instanceof HTMLCollection)
      target.replaceChildren(...target.children, ...src)
    return target
  }
  let descriptors = (areDescriptors(src)) ? src : Object.getOwnPropertyDescriptors(src)
  Reflect.ownKeys(descriptors).forEach(key => { 
    let desc = descriptors[key]
    if (exclude.includes(key)) {
      delete descriptors[key];
      return
    }
    let targetDesc = Object.getOwnPropertyDescriptor(target,key)
    if (targetDesc && targetDesc.configurable === false && targetDesc.writable === false && !callback) {
      delete descriptors[key]; return
    }
    if (targetDesc && targetDesc.configurable === false && !callback) {
      let type = ("get" in targetDesc) ? "get" : "value"
        let val
        try { val = Reflect.get(targetDesc,type,target) } catch { val = Reflect.get(targetDesc,type,src) }
        if (val && (typeof val === 'function') && binder) val = val.bind(binder)
        target[key] = val
        delete descriptors[key]; return
    }
    let type = ('value' in desc) ? 'value' : ('get' in desc) ? 'get' : 'set'
    if (binder) 
      desc[type] = (key === 'constructor' || key === 'set') ? desc[type] : bindIt(desc[type],binder);
    let throwThis
    try {
        let cbResult
        if (callback) {
          cbResult = callback(key,desc,target)
          desc = (cbResult === true) ? desc : cbResult && typeof cbResult === 'object' && !Array.isArray(cbResult) && !cbResult instanceof Error ? cbResult : desc
          if (cbResult instanceof Error || typeof cbResult === 'string') {
              throwThis = cbResult
              desc = undefined
          }
        }
    } catch(err) { if (err) console.error(err); if (throwThis) throw throwThis  }
  })
  Object.defineProperties(target,descriptors)
  return target;
}

function argsProxy(args) {
  let newArg = {}
  return new Proxy(newArg,{
     get(ob,prop) { 
        if (newArg[prop]) return newArg[prop]
        if (prop === 'args') return newArg
        let position = Object.keys(newArg).length
        newArg[prop] = args[position]
        return newArg[prop]
     }
  })
}
function Args(cb) {
   let newfunc = function(...arg) {
      return cb(argsProxy(arg))
   }
   return newfunc
}

class Funktion extends Function {
   constructor(func,props) {
      props = arguments[1] || (typeof arguments[0] === 'object') && arguments[0]
      if (props && props.properties) props = props.properties
      func = (typeof arguments[0] === 'function') ? arguments[0] : (props && props.function) && props.function 
      if (props) delete props.function
      let name = props.hasOwnProperty('name') && props.name || func.name || 'funktion'
      delete props.name

      function funktionCaller(fun,binder,...ar) {
         return fun.call(binder,...ar)
      }
      let funktion = {
         [name]: function(...ar) {
            let ao = argsProxy(ar)
            let binder = new Proxy(this || _global,{ 
               get(ob,prop) {
                  if (prop in ob) return ob[prop]
                  if (ao && ao.hasOwnProperty(prop)) return ao[prop]
                  if (prop === 'arguments') return [...ar]
               }
            })
            return (!ao) ? funktionCaller(func,binder,...arguments) : funktionCaller(func,binder,ao)     
         }
      }[name]
      Object.defineProperty(funktion,'name',{value: name, writable: false, enumerable: false, configurable: true})

      let pr = ('properties' in props) ? 'properties' : ('static' in props) ? 'static' : undefined
      if (props && typeof props[pr] === 'function') {
      
        let properties = funktion

        let defineProps = (trg,src,noUndef=false) => {
            let descs = !noUndef ? Object.getOwnPropertyDescriptors(src) : Object.fromEntries(Object.entries(Object.getOwnPropertyDescriptors(src))
            .filter(([key,desc]) => typeof src[key] === 'undefined' && (key in trg) ? false : true ))
            Object.defineProperties(trg,descs)
        }
        let firsPass = props.call(properties)
        let backup = Object.getOwnPropertyDescriptors(properties)
        let secondPass = props.call(firstPass)
        defineProps(properties,secondPass,true)
        defineProps(properties,backup,true)
        props[pr] = properties

      } 
      else if (props[pr]) {
        merge(funktion,props[pr])
        delete props[pr]
      }
      super()
      if (props && ('__proto__' in props))
        Object.setPrototypeOf(funktion,props['__proto__'])
        
      merge(funktion,this,['name'])
      if (props) merge(funktion,props,['name','__proto__'])
      if (!props['__proto__']) proto.set(funktion,this.constructor.prototype)
      funktion.prototype.constructor = funktion
      return funktion
   }
}

function Args(cb) {
   let newfunc = function(...arg) {
      return cb(argsProxy(arg))
   }
   return newfunc
}

const tie = new Funktion({
  function: function tie(func, newBind) {
    if (typeof func !== "function" || func.name.split("bound ")[1]) return func;
    if (!newBind) return func;
  
    if (func instanceof tie) func = func.originalFunc;
    if (isClass(func)) {
      console.error(
        `Problem with: "${func.name}." Tie function can't work with classes. Invalid data type. Ignoring.`
      );
      return func;
    }
    var funcName = func.name;
    let newFunc = {
      [funcName]: function (...arg) {
        return newFunc.tie.bind
          ? newFunc.originalFunc.call(newFunc.tie.bind, ...arg)
          : newFunc.originalFunc.call(...arg);
      }
    }[funcName];
    Object.setPrototypeOf(newFunc, func);
    Object.defineProperty(newFunc, "name", { value: funcName });
  
    newFunc.originalFunc = func;
  
    newFunc.tie =
      newFunc.tie ||
      function (binder) {
        this.tie.bind = binder;
      };
    if (newBind) newFunc.tie.bind = newBind;
    proto.set(newFunc, tie.prototype);
    return newFunc;
  },
  prototype: {
    get constructor() { return this.originalFunc },
    bind() { 
      return this.originalFunc.bind(...arg);
    },
    call() {
      return this.originalFunc.call(...arg);
    },
    apply() {
      return this.originalFunc.apply(...arg);
    },
    __proto__: Object.getPrototypeOf(this.constructor.prototype)
  }
})










function mapFunction(map) {
  return function mapFunc(key,val) {
    if (!map.has(key)) return mapFunction.get(...arguments)
    if (!arguments.hasOwnProperty(1)) return map.get(key)
    return map.set(...arguments)    
  }
}
Reflect.ownKeys(_typeof.class(map).prototype).forEach(key => {
  mapFunction[key] = typeof _typeof.class(map).prototype[key] === 'function' ? _typeof.class(map).prototype[key].bind(map) : _typeof.class(map).prototype[key]
})
mapFunction.get = function(obj,properties) {
  let props = () => arguments.hasOwnProperty(1) 
  if (!props() && map.has(obj)) return map.get(obj)
  if (!map.has(obj)) mapFunction.set(obj, props())
  return properties
}

    /*
    let newProx = new Proxy(obj, {
      get(ob, prop) {
        if (prop in ob) return ob[prop];
        if (prop === "{{target}}") return ob;
        if (prop in theProps) return Reflect.get(theProps, prop, obj);
        if (prop[0] === "_") priv.get(ob)[prop.split(1)];

        return ob[prop];
      },
      set(ob, prop, val, prox) {
        if (prop in obj) return (obj[prop] = val);
        if (prop in theProps) {
           console.log('prop',prop)
          let temp = obj.constructor._template
          if (prop !== "properties" && temp && (prop in temp)) return true;
          console.log('newtarget',priv.get(prox).newTarget)
          return priv.get(prox).newTarget
            ? Reflect.set(theProps, prop, val, obj)
            : true;
        }
        if (prop[0] === '_') return priv.get(ob)[prop.split(1)] = val
        obj[prop] = val;
        return true;
      },
      defineProperty(ob, prop, desc) {
        if (prop in theProps) {
          return priv.get(prox).newTarget
            ? Object.defineProperty(ob, prop, desc)
            : false;
        }
        if (prop[0] === "_")
          return Object.defineProperty(priv.get(ob), prop.split(1), desc);

        return Object.defineProperty(ob, prop, desc);
      }
    });
    priv.set(newProx,{ newTarget: priv.get(obj).newTarget });
    return newProx;
  } */
  function boundObject(object,bind,callback) {
    if (arguments.length === 1) {
       callback = object; object = {}
    }
    if (arguments.length === 2) {
       callback = bind
       bind = undefined
    }
 
   let subject = bind ? object : Object.setPrototypeOf(new object.constructor(),Object.getPrototypeOf(object))
   firstPass = callback.call(subject) || subject
   firstPass = firstPass !== subject ? Object.defineProperties(firstPass,Object.getOwnPropertyDescriptors(subject)) : firstPass
   firstPass = firstPass !== subject ? firstPass : subject
   let objectProto = Object.getPrototypeOf(object)
   let firstPassProto = Object.getPrototypeOf(firstPass)

   if (firstPass.constructor === Object) 
      Object.setPrototypeOf(firstPass, objectProto)
   else if (object instanceof Object.getPrototypeOf(firstPass.constructor.prototype).constructor) {
      Object.setPrototypeOf(firstPass,objectProto)
      firstPass.constructor.prototype = objectProto
      Object.defineProperties(objectProto,Object.getOwnPropertyDescriptors(firstPassProto))
   }
   else {
     Object.setPrototypeOf(object,firstPassProto)
     object.constructor.prototype = firstPassProto
     Object.defineProperties(firstPassProto,Object.getOwnPropertyDescriptors(objectProto))
   }
   
   let secondPassObj = object

   let text = callback.toString().replace(/(\r\n|\n|\r)/gm," ")
   let exp = `{*(\ )*?(key)\ *?\:(?:\ |)*(this)?\ *?(?:\,|\ )(\ )*\}*`

   Reflect.ownKeys(firstPass).forEach(key => {
     let modExp = exp.replace('(key)','('+key+')')
     match = new RegExp(modExp,'gm').exec(text)
     if (match && match[3]) {
       if (object.hasOwnProperty(key)) object[key] = object
       firstPass[key] = object
     }
   })

   if (firstPass !== object) {
    
    if (bind) {
      secondPassObj = bind
      let handler = {
         get(ob,prop) {
           return (typeof ob[prop] !== 'undefined') ? ob[prop] : firstPass[prop]
         }
      }
      secondPassObj = new Proxy(secondPassObj,handler)

    } else {
      let descs = {}
      Reflect.ownKeys(firstPass)
        .filter(key => !!(!secondPassObj.hasOwnProperty(key) || typeof secondPassObj[key] === 'undefined'))
        .forEach(key => descs[key] = Object.getOwnPropertyDescriptor(firstPass,key))
      Object.defineProperties(secondPassObj,descs)
    } 

   }

   let secondPass = callback.call(secondPassObj)
   if (secondPass !== object) Object.defineProperties(object,Object.getOwnPropertyDescriptors(secondPass))
   return object

 }