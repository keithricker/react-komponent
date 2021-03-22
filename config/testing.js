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
      if (props && props._properties) props = props._properties
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

      let pr = ('_properties' in props) ? '_properties' : ('_static' in props) ? '_static' : undefined
      if (props && typeof props[pr] === 'function') {
      
        let _properties = funktion

        let defineProps = (trg,src,noUndef=false) => {
            let descs = !noUndef ? Object.getOwnPropertyDescriptors(src) : Object.fromEntries(Object.entries(Object.getOwnPropertyDescriptors(src))
            .filter(([key,desc]) => typeof src[key] === 'undefined' && (key in trg) ? false : true ))
            Object.defineProperties(trg,descs)
        }
        let firsPass = props.call(_properties)
        let backup = Object.getOwnPropertyDescriptors(_properties)
        let secondPass = props.call(firstPass)
        defineProps(_properties,secondPass,true)
        defineProps(_properties,backup,true)
        props[pr] = _properties

      } 
      else if (props[pr]) {
        merge(funktion,props[pr])
        delete props[pr]
      }
      _super()
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

export const tie = new Funktion({

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
  prototype: Object.setPrototypeOf({
    constructor:this.function,
    bind() { 
      return this.originalFunc.bind(...arg);
    },
    call() {
      return this.originalFunc.call(...arg);
    },
    apply() {
      return this.originalFunc.apply(...arg);
    }
  },Function)
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
mapFunction.get = function(obj,_properties) {
  let props = () => arguments.hasOwnProperty(1) 
  if (!props() && map.has(obj)) return map.get(obj)
  if (!map.has(obj)) mapFunction.set(obj, props())
  return _properties
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
          if (prop !== "_properties" && temp && (prop in temp)) return true;
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


















 let vars = new Map()
const proto = { get: Object.getPrototypeOf, set: Object.setPrototypeOf };
function tryCatch(exp,cb) { 
  let res; let err; 
  try { res = exp() } catch(error) { err = error } return cb ? cb(res,err) : err || res
}
function suppress(exp,deflt) { let res = tryCatch(exp); return res instanceof Error ? deflt : res }
const Global = window, _global = window

        let defineProps = (trg,src,noUndef=false) => {
            let descs = !noUndef ? Object.getOwnPropertyDescriptors(src) : Object.fromEntries(Object.entries(Object.getOwnPropertyDescriptors(src))
            .filter(([key,desc]) => typeof src[key] === 'undefined' && (key in trg) ? false : true ))
            Object.defineProperties(trg,descs)
        }

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
  console.log('src',src)
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
class Descriptor {
  constructor(desc) {
    return Object.defineProperties(this,Object.getOwnPropertyDescriptors(desc))
  }
}
class Descriptors {
  constructor(obj) {
    let descs = {}
    Reflect.ownKeys(obj).forEach(key => descs[key] = new Descriptor(Object.getOwnPropertyDescriptor(obj,key)))
    return descs
  }
}

export function descriptors(defaults, ...bind) {
  let ob = this;
  // spreading the bind argument allows for passing multiple arguments to bind method
  let descs = new Descriptors(ob)
  if (!defaults && !bind.length) return descs;
  entries(descs).forEach(([key, desc]) => {
    if (bind) {
      ["get", "value"].forEach((type) => {
        if (typeof desc[type] === "function")
          desc[type] = desc[type].bind(...bind);
      });
    }
    if (defaults) {
      if (typeof defaults === "function") descs[key] = defaults(desc);
      else Object.assign(desc, defaults);
    }
  });
  return descs;
}








function boundObject(object,bind,callback) {

  /*  THE BIND ISN'T ACTUALLY A TRUE BIND --- IT IS JUST THE DESIGNATED OBJECT IF WE WANT THE OBJECT ARGUMENT TO BE A BLANK SLATE */

  if (arguments.length === 1) {
     callback = object; object = {}
  }
  if (arguments.length === 2) {
     callback = bind
     bind = undefined
  }
  if (arguments.length < 3 && !Array(...arguments).some(ar => typeof ar === 'function'))
    callback = function() { return merge(this,object) }
 
 let subject = bind ? object : Object.setPrototypeOf(new object.constructor(),Object.getPrototypeOf(object))
 firstPass = callback.call(subject) || subject
 /* IF FIRST PASS DOESN'T RETURN THE OBJECT ITSELF */
 firstPass = firstPass && firstPass !== subject ? merge(firstPass,subject) : firstPass || subject
 firstPass = firstPass && firstPass !== subject ? firstPass : subject
 
 let secondPassObj = object

 if (object !== firstPass) {
   let objectProto = Object.getPrototypeOf(object)
   let firstPassProto = Object.getPrototypeOf(firstPass)
 
   if (firstPass.constructor === Object) 
      Object.setPrototypeOf(firstPass, objectProto)
  // if firstPass returns a different prototype, then set object's prototype to that
   else if (object instanceof Object.getPrototypeOf(firstPass.constructor.prototype).constructor) {
      Object.setPrototypeOf(firstPass,objectProto)
      firstPass.constructor.prototype = objectProto
      meerge(objectProto,firstPassProto)
   }
   else {
      Object.setPrototypeOf(object,firstPassProto)
      object.constructor.prototype = firstPassProto
      merge(firstPassProto,objectProto)
   }
 }
  
 let text = callback.toString().replace(/(\r\n|\n|\r)/gm," ")
 let exp = `{*(\ )*?(key)\ *?\:(?:\ |)*(this)?\ *?(?:\,|\ )(\ )*\}*`
 
 Reflect.ownKeys(firstPass).forEach(key => {
   key = Object(key).toString()
   let modExp = exp.replace('(key)','('+key+')')
   match = new RegExp(modExp,'gm').exec(text)
   if (match && match[3]) {
     if (object.hasOwnProperty(key)) object[key] = object
     firstPass[key] = object
   }
 })
 // this is clearly for when you want the object to be a blank slate for something else
 if (bind && firstPass !== object) {

    secondPassObj = bind
    let handler = {
       get(ob,prop) {
         return (typeof ob[prop] !== 'undefined') ? ob[prop] : firstPass[prop]
       },
       set(ob,prop,val) {
         return !!(ob[prop] === typeof val === 'function' ? val.bind(bind) : val)
       }
    }
    secondPassObj = new Proxy(secondPassObj,handler)
 
  } else if (seondPassObj !== firstPass) {
     let cloneObj = {}
     Reflect.ownKeys(firstPass)
       .filter(key => !!(!secondPassObj.hasOwnProperty(key) || typeof secondPassObj[key] === 'undefined'))
       .forEach(key => Object.defineProperty(cloneObj,key,Object.getOwnPropertyDescriptor(firstPass,key))
     merge(secondPassObj,cloneObj)
   }
 
   let secondPass = callback.call(secondPassObj)
   // So we're taking secondpass object and defining object's properties with them.
   if (secondPass !== object) merge(object,secondPass)
   let bindProxy = new Proxy(object,{
     get(ob,prop) { if (prop in ob) return ob[prop]; return secondPass[prop] }
   })
   let cloneObj = {}; [...descriptors(object)].forEach(desc => { 
      ['get','value'].forEach(key => { 
         if (typeof desc[key] === 'function')
           desc[key] = desc[key].bind(bindProxy)
      })
      Object.defineProperty(cloneObj,key,desc) 
   })
   merge(object,cloneObj)
   return object
 }
 
 function boundProperties(object,...bind) {
    return boundObject({},object,function() {
       let descs = descriptors(object,(desc) => {
          Array('set','get','value').forEach(type => {
             if (typeof desc[type] === 'function') {
                let property = desc[type]
                desc[type] = function(...arg) {
                   arg = Object.assign(arg,bind.slice(1))
                   try { return property.call(bind[0],...arg) } catch(err) { console.log(bind[0]); if (desc.key in bind[0]) return bind[desc.key](...arg);  }
                }
                return desc
             }
          })
       })
       return Object.defineProperties(this,descs)    
    })
 } 


//////  USE THISS!!!!!!! //////////////




class Funktion extends Function {
   constructor(func,props) {
      props = arguments[1] || (typeof arguments[0] === 'object') && arguments[0]
      func = (typeof arguments[0] === 'function') ? arguments[0] : (props && props._function) && props._function 
      if (props) props._properties = props._properties || props._static

      let name = props.name || func.name || 'funktion'
      if (props) {
        delete props.name
        delete props._function
        if (props._properties) {
          let ppr = props._properties
          delete props._properties
          defineProps(props,ppr)
        }
      }
      
      function funktionCaller(fun,binder,...ar) {
         return fun.call(binder,...ar)
      }
     
      let funktion = {
         [name]: function(...ar) {

            let argProx = argsProxy(ar)

            let binder = new Proxy(this || _global,{ 
               get(ob,prop) {
                  if (prop in ob) return ob[prop]
                  if (argProx && ao.hasOwnProperty(prop)) return ao[prop]
                  if (prop === 'arguments') return [...ar]
               }
            })

            return (!ao) ? funktionCaller(func,binder,...arguments) : funktionCaller(func,binder,argProx)     
         }
      }[name]

      super()
      merge(funktion,this,['name'])
      if (!props || !props.hasOwnProperty(['__proto__'])) proto.set(funktion,this.constructor.prototype)
      funktion.prototype.constructor = funktion
      Object.setPrototypeOf(funktion,Funktion)

      if (!props) return funktion


      function boundProps(...bind,callback,returnVal) {
        if (returnVal && bind && bind[0]) {
          bind = new Proxy(bind[0],{
            get(ob,prop) { 
               if (prop in returnVal)
                 return returnVal[prop]
               return ob[prop]
            },
            set(ob,prop,val) { 
              returnVal[prop] = typeof val === 'function' ? val.bind(ob) : val 
            }
          })
          bind[0] = bind
        }
        else returnVal = callback.bind(...bind)
        return returnVal
      }



      let funkProps = boundProps(funktion,function() {
        return {
          get prototype() { return this.prototype },
          set prototype() {
            if (val.hasOwnProperty('_prototype')) {
              Object.setPrototypeOf(val,val._prototype)
              delete val._prototype
            }
            
            if (val.constructor !== Object && val.constructor !== this) 
               this.prototype = val
            else 
               defineProps(this.prototype,val)

          },
          get _prototype() { return Object.getPrototypeOf(this) },
          set _prototype(val) { 

            if (val.hasOwnProperty('_prototype')) {
              Object.setPrototypeOf(val,val._prototype)
              delete val._prototype
            }
            
            if (val.constructor === Object)
              Object.setPrototypeOf(val,Funktion) 
          }
         }
      })
      function setProps(obj,props) {
        Reflect.ownKeys(props).forEach(key => {
          if (key.split('_')[0] === "") obj[key] = props[key]
          else Object.defineProperty(obj,key,Object.assign(Object.getOwnPropertyDescriptor(props,key),{configurable:true,enumerable:true}))
        })
      }
      funktion = boundObject()
      funktion = merge(Funktion,boundObject(funkProps,Funktion,propsFunc))
      if (typeof props === 'function') {
        setProps.call(funkProps)
      }

      return funktion
   }
}

function Args(cb) {
   let newfunc = function(...arg) {
      return cb(argsProxy(arg))
   }
   return newfunc
}

function tie(func, newBind) {
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
  // return newFunc
  return newFunc;
}
proto.set(tie.prototype, Function.prototype);
Array("bind", "call", "apply").forEach(
  (key) =>
    (tie.prototype[key] = function (...arg) {
      return this.originalFunc[key](...arg);
    })
);



export const tie = new Funktion({

  _function: function tie(func, newBind) {
    if (typeof func !== "function" || func.name.split("bound ")[1]) return func;
    if (!newBind) return func;
  
    if (func instanceof tie) func = func.originalFunc;
    if (isClass(func)) {
      console.error(
        `Problem with: "${func.name}." Tie function can't work with classes. Invalid data type. Ignoring.`
      );
      return func;
    }
    let newFunc = new Funktion({
      _function: function (...arg) {
        return newFunc.tie.bind
          ? newFunc.originalFunc.call(newFunc.tie.bind, ...arg)
          : newFunc.originalFunc.call(...arg);
      },
      _properties: merge(merge({},func),{
        originalFunc = func,
        tie : newFunc.tie ||
        function (binder) {
          this.tie.bind = binder;
        }        
      }),
      _prototype:tie.prototype,
    })
    if (newBind) newFunc.tie.bind = newBind;
    return newFunc;
  },
  prototype: {
    constructor: this.originalFunc,
    bind() { 
      return this.originalFunc.bind(...arg);
    },
    call() {
      return this.originalFunc.call(...arg);
    },
    apply() {
      return this.originalFunc.apply(...arg);
    },
    _prototype: Function
  }
})











function funkBinder(thiss,funk) {
  let object = thiss
  let private = {
    get _this() { return funkBinder(this,funk) },
    get _properties() { return thiss },
    set _properties(val) { 
      defineProps(this,val)
      return true 
    },
    _super(...arg) {
      objectInstance = new thiss._prototype.constructor(...arg) 
      this._instance = thiss._instance = objectInstance
    },
    get _instance() {
      return thiss
    },
    set _instance(val) {
      let newThiss = funkBinder(val,funk) 
      defineProps(newThiss,thiss)
      Object.setPrototypeOf(newThiss,thiss._protototype)
      thiss = newThiss
      return true
    },
    get _static() { return funk },
    set _static(val) { defineProps(funk,val); return true },
    get _prototype() { return Object.getPrototypeOf(thiss) },
    set _prototype(val) { 
      if (val.constructor !== Object) {
        funk.prototype = val
        Object.setPrototypeOf(thiss,val)
        val.constructor = funk
      }
      else defineProps(funk.prototype,val)
      return true 
    }
  }
  return defineProps(object,private)

}     





let boundFunc = boundObject(funktion, function() {
  return {
   get _properties() { return thiss },
   set _properties(val) { 
     this._instance = val
     return true 
   },
   _super(...arg) {
     objectInstance = new thiss._prototype.constructor(...arg) 
     this._instance = thiss._instance = objectInstance
   },
   get _instance() {
     return thiss
   },
   set _instance(val) {
     let newThiss = funkBinder(val,funk) 
     defineProps(newThiss,thiss)
     Object.setPrototypeOf(newThiss,thiss._protototype)
     thiss = newThiss
     return true
   },
   get _static() { return funk },
   set _static(val) { defineProps(funk,val); return true },
   get _prototype() { return Object.getPrototypeOf(thiss) },
   set _prototype(val) { 
     if (val.constructor !== Object) {
       funk.prototype = val
       Object.setPrototypeOf(thiss,val)
       val.constructor = funk
     }
     else defineProps(funk.prototype,val)
     return true 
   }
 }
})








