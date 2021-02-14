const {importer} = require(Module)
const React = require("react")
const path = require('path')
const Obj = require('./Obj')
const Standin = require('./Standin')
const proto = { get: Object.getPrototypeOf, set: Object.setPrototypeOf };
const reflectKeys = Reflect.ownKeys(Reflect).concat(["enumerate"]);
const utilTypes = () => require("util").types || require("util")
const Global = suppress(() => window,global)
const simpleMixin = (trg,src) => proto.set(trg,proto.set(src,proto.get(trg)))
const Obj = require("./Obj")
const klass = require("./klass")
let If = (exp,more) => { 
   if (!(more) && typeof exp === 'function') {
      let cb = (res) => res || undefined
      try { return exp(cb) } catch { return undefined }
   }
   return exp ? more(exp) : undefined 
}

function argsProxy(args) {
   let newArg = {}
   return new Proxy(newArg,{
      get(ob,prop) { 
         if (newArg[prop]) return newArg[prop]
         if (prop === 'args') return newArg
         let position = Object.keys(newArg).length
         newArg[prop] = args[position]
      }
   })
}

function Args(cb) {
   let newfunc = function(...arg) {
      return cb(argsProxy(arg))
   }
   return newfunc
}

function undef(varble) {
  return typeof varble === "undefined";
}

export function isURL(url) {
  if (typeof url !== "string") return false;
  if (!isURL.pattern) isURL.pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  return isURL.pattern.test(url) ? true : false;
}

export function isJSON(data) {
  if (typeof data !== "string") return false;
  data = data.trim();
  let match = data.match(/\{[^{}]+\}/) || [];
  return match[0] === data;
}

export function isPromise(res) {
  return typeof res === "object" && res instanceof Promise;
}

class Problem extends Error() {
   constructor(...arg) {
      super(...arg)
   }
   get log() {
      let stackTrace;
      let stack = new Error().stack;
      let modified = {}
      stackTrace = stack.split("\n");
      if (stackTrace[0].includes("log")) stackTrace.shift();


      let re = /(\w+)@|at (\w+) \(/g
      stackTrace.forEach((st,ind) => {
         if (!st.trim()) return
         let find = re.exec(st)
         if (find) find = find[1] || find[2]
         if (typeof find !== 'string')
            return
          modified[find] = st
         let url = st.match(isURL.pattern)
         modified[find] = url ? url[0] : st
      });
      return modified
      /*
      var callerName;
      try {
        throw new Error();
      } catch (e) {
        var re = /(\w+)@|at (\w+) \(/g,
          st = e.stack;
          var m;
        re.exec(st); m = re.exec(st)
        callerName = m[1] || m[2];
      }
      console.log(callerName);
      */
   }
}

export const is = (function () {
   const isHandler = {
      get props() {
         return {
            get promise() {
               return utilTypes().isPromise || isPromise
            },
            get json() {
               return utilTypes().isJSON || isJSON
            },
            get url() {
               return utilTypes().isURL || isURL
            },
            defined(arg) {
               return utilTypes().isDefined ? utilTypes().isDefined(arg) : typeof arg !== "undefined";
            },
            empty(ob) { return (typeof ob === 'undefined') ? undefined : (!utilTypes().length) ? true : false },
            class(func) {
               let classText = (str) => str.split(" ")[0] === "class"
               let funcString = func.toString().toLowerCase()
               if (classText(funcString)) return true
               let call = tryCatch(() => func())
               return (call.message && classText(call.message.toLowerCase())) ? true : false
            },
            object(ob) { 
               let deflt = ob.isObject ? ob.isObject(ob) : typeof ob === 'object'
               return deflt && !Array.isArray(ob)
            },
            instanceOf(ob,...arg) {
               if (arg.length > 1) {
                  let op = (['all','some','and','or'].includes(last(arg))) ? last(arg) : 'all'
                  let res = arg.filter(ar => ob instanceof ar)
                  if (['all','and'].includes(op)) 
                     return !!(res.length === arg.length)
                  if (['some','or'].includes(op))
                     return !!(res.length)
               }
               return ob instanceof arg[0]
            },
            equivalent(ob1,ob2,strict=true) {

               if (ob1 == ob2 && typeof ob1 === typeof ob2) return true
               if (typeof ob1 !== typeof ob2) return false
               ob1 = Object(ob1); ob2 = Object(ob2)
               if (Reflect.ownKeys(ob1).length !== Reflect.ownKeys(ob2).length) 
                  return false
               if (suppress(() => {  
                  return ob1.toString() !== ob2.toString() 
               },true))
               return false

               let toStr = (ob) => {
                  let jsonString = ''                  
                  Reflect.ownKeys(ob).forEach(key => {
                     jsonString += key+' '+typeof ob[key]+"\n"
                  })
                  if (!strict) return jsonString 
                  jsonString += JSON.stringify(ob)+JSON.stringify(Object.getOwnPropertyDescriptors(ob))
                  return jsonString
               }
               let stringMatch = toStr(ob1) === toStr(ob2)
               if (!stringMatch) return false

               let protoMatch = proto.get(ob1) === proto.get(ob2)
               if (protoMatch) return true

               let lvls1 = getLevels(ob1)
               let lvls2 = getLevels(ob2)
               if (lvls1.length !== lvls2.length && strict) return false
               let names1 = lvls1.strings()
               let names2 = lvls2.strings()
               if (JSON.stringify(names1) === JSON.stringify(names2) && !strict) return true
   
               let mismatch = lvls1.some((lvl,ind) => toStr(lvl) !== toStr(lvls2[ind]))
               return (mismatch) ? false : true
            },
            descriptor(obj) {
               if (!obj) return false
               if (!obj.hasOwnProperty('get') && !obj.hasOwnProperty('value')) return false
               if (Reflect.ownKeys(obj).length === 1) return true
               const descProperties = Reflect.ownKeys(Object.getOwnPropertyDescriptor(Object.defineProperty({},'property',{get:()=>{},set:()=>{}}),'property')).concat('value')
               return Reflect.ownKeys(obj).every(key => descProperties.includes(key))  
            },
            descriptors(ob) {
               return Reflect.ownKeys(ob).every(key => this.descriptor(ob[key]))
            },
            numeric(num) { return !isNaN(num) }
         }
      },
      get(ob, prop) {
        if (prop === '{{handler}}') return isHandler

        let types = ['undefined','object','boolean','number','bingint','string','symbol','function','object']
        let deflt = (...args) => { let item = (args.length > 1) ? arguments: args[0]; return (typeof ob[prop] === 'function') ? ob[prop](...args) : types.includes(prop) && typeof item === prop }
        
        let lcProp = prop.toLowerCase()
        if (this.props.hasOwnProperty(lcProp)) return this.props[lcProp]
  
        let lcProps = {};
        let mod = (str) => { 
           str = str.toLowerCase(); let spl = str.split('is'); if (spl[1] && (spl[0] === "")) return str[1] 
        }
        Reflect.ownKeys(ob).forEach(key => lcProps[mod(key)] = ob[key])
        let mprop = mod(prop)
        return typeof lcProps[mprop] === "function" ? lcProps[mprop] : deflt
      }
   }
   return mixin(utilTypes(),isHandler)   
})();

export function isClass(func) {
  return is.class(func)
}
                    
let last = (arr) => [...arr].pop()

function tryCatch(exp,cb) { 
   let res; let err; 
   try { res = exp() } catch(error) { err = error } return cb ? cb(res,err) : err || res
}
function suppress(exp,deflt) { let res = tryCatch(exp); return res instanceof Error ? deflt : res }

class Funktion extends Function {
   constructor(func,props={}) {

      let funk = this

      props = arguments[1] || (typeof func === 'object') && func
      func = (typeof func === 'function') ? func : props && props.function
      if (props) delete props.function

      let name = props.name || func.name || this.name || 'funktion'
      delete props.name
      let newProps

      ['properties','static'].forEach(pr => { 
         if (pr in props)
            newProps = newProps ? merge(newProps,props[pr]) : props[pr]
      })
      function funktionCaller(fun,binder,...ar) {
         return fun.call(binder,...ar)
      }
      let funktion = {
         [name]: function(...ar) {
            let ao = argsProxy(ar)
            let binder = new Proxy(this || Global,{ 
               get(ob,prop) {
                  if (prop in ob) return ob[prop]
                  if (ao && ao.hasOwnProperty(prop)) return ao[prop]
                  if (prop === 'arguments') return [...ar]
               }
            })
            return (!ao) ? funktionCaller(func,binder,...arguments) : funktionCaller(func,binder,ao)     
         }
      }[name]
      Object.defineProperty(funktion,'name',{writable: false, enumerable: false, configurable: true})

      super()
      merge(funktion,this,['name'])
      if (props) merge(funktion,props,['name'])
      proto.set(funktion,this.constructor.prototype)
      return funktion
   }
}


/*  alternative to the switch statement  */
export function swap(cond,mp) {
   let res = cond()
   let deflt = {}
   let ret = deflt
   mp.forEach((val,key) => {
      if (ret !== deflt) return
      if (key === res) { ret = val(res) }
   })
   return ret === deflt ? undefined : ret
}

class MapFunc extends Funktion(map,func) {
   constructor() {
      let props = {
         name: mapFunc,
         function: function(ob,val) {
            if (func) return func(ob,val,map,[...arguments])
            let set; let retrieved = map.get(ob)
            if (arguments[1]) set = map.set(ob,val)
            return set || retrieved
         },
         prototype: mixin(this,Map.prototype,map)
      }
      super(props)
   }
}

export class PrivateVariables extends MapFunc {
   constructor(newVars) {
      if (!newVars) newVars = new WeakMap()
      super(newVars,(key,val,map,args) => {
         if (args.length === 4) {
            let ret = map.get(key)
            if (!ret) { map.set(key,val); ret = val }
            if (ret instanceof Map || ret instanceof WeakMap)
               ret.set(args[2],args[3])
            else ret[args[2]] = args[3]
            return ret[args[3]]
         }
         let def = {}
         let retrieved = map.get(key)
         if (!retrieved || arguments[1]) map.set(key,val || def)
         return val || retrieved || def
      })
      return this
   }
   default(key,val={}) {

      if (!(val instanceof PrivateVars)) mixin(val,clone(PrivateVars.prototype,false))

      if (!arguments[1] || !this.has(key)) {
         this.set(key,val)
         return val
      }
      let retrieved = newVars.get(key)
      
      if (is.equivalent(retreived,val)) return retreived

      if ((Obj(val).Type === Obj(retreived).type && (Obj(val).Type === 'Array' || Obj(val).type === 'Object'))) {
         if (is.array(val)) {
            merge(retrieved,val)
         } else merge(retrieved,val,(key) => !(key in retrieved))
      }
      return retrieved || val
   }
}

export const vars = new PrivateVariables()

export function lowerFirst(word) {
  console.log("word", word);
  return word.charAt(0).toLowerCase() + word.slice(1);
}

export function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function executionTime(script) {
   let start = new Date();
   script()
   return new Date() - start;
}

export function contract(input, then) {
  if (isPromise(input)) return then ? input.then((done) => then(done)) : input;
  return then ? then(input) : input;
}

export function asyncForEach(arr, cb, ths) {
  let iteration = -1;
  function iterate(prev) {
    if (iteration === arr.length - 1) return prev;
    iteration++;
    return contract(
      cb.call(ths, arr[iteration], iteration, prev, arr),
      (res) => {
        prev = res;
        return iterate(prev);
      }
    );
  }
  return iterate();
}

export function sequence(...funcs) {
  if (funcs.length === 1 && Array.isArray(funcs[0])) funcs = funcs[0];
  if (funcs.constructor && !Array.isArray(funcs)) funcs = Object.values(funcs);
  return asyncForEach(funcs, (func, ind, res) => {
    return func(res);
  });
}

export function mixProx(obj,mix,bound,priority) {
   let prec = priority

   let handler = {
      get(ob,prop) {
         let trg =  (prop in prec) && prec || (prop in obj) && obj || (prop in mix) && mix
         let bnd = bound
         if (trg === bound) bnd = undefined
         return bnd ? tie(Reflect.get(trg[prop],bnd),bnd) : trg[prop]
      }
   }
   return new Proxy(obj,handler)
}

export function reverseInherit() {}

function _mixin({target,source,priority=source,bind=target}) {

   function objFunc(trg) { 
      let apply = (ob,...arg) => { 
         if (arguments.length === 1 && typeof ob === 'string') return ReflectBind(trg,ob,bound())
         return !arguments.length ? trg : suppress(() => ob() === trg,ob === trg) 
      }
      let handler = Standin.handlers.default(trg)
      return new Proxy(apply,handler)
   }
   let obj = objFunc(target)
   let mix = objFunc(source)
   let rank = objFunc(priority)
   let bound = objFunc(bind)

   let type = (o1,o2) => !o2 ? Obj(o1).Type().class() : Obj(o1).Type() === Obj(o2).Type()

   let clonedMix = Obj(Obj(mix).descriptors).filter(key,() => {     
      if ((key in obj) && rank(obj())) return false
      if (((key in type(obj).prototype 
         && (!(type(mix).prototype instanceof type(obj) || type(obj).prototype instanceof mix()) 
         && type(obj) !== Object) && bound(obj)))) 
            return false
   }).map((key,val) => {
      delete val.value; 
      val.get = function() { return mix(key) }
      return val
   })
   return simpleMixin(obj,clonedMix)
} 
   
export function mixin(...ar) {
   return _mixin(argsProxy(ar))
}

export const appendScript = (scriptToAppend, external = true) => {
  const script = document.createElement("script");
  let inlineScript;
  if (external === true) {
    script.src = scriptToAppend;
    script.async = true;
  } else {
    inlineScript = document.createTextNode(scriptToAppend);
    script.appendChild(inlineScript);
  }
  document.body.appendChild(script);
};

const captured = { get: {}, set: {} };
export function capture(name = "object") {
  let cap = typeof name === "string" ? [] : name;
  if (!cap.applies) cap.applies = [];
  return new Proxy(cap, {
    get: function (ob, prop) {
      if (typeof name === "string") {
        captured.get[name] = captured.get[name] || [];
        captured.get[name].push(cap);
      }
      cap.push(prop);
      return capture(cap);
    },
    set: function (ob, prop, val) {
      if (typeof name === "string") {
        captured.set[name] = captured.get[name] || [];
        captured.set[name].push(cap);
      }
      cap.set(prop);
      cap.applies.push((target) => {
        let dest = target;
        cap.forEach((part, ind) => {
          if (ind === cap.length) dest[part] = val;
          else dest = dest[part];
        });
      });
      return true;
    },
    apply: function (target, that, args) {
      cap.applies.push();
    }
  });
}

export class WeakerMap extends WeakMap {
  constructor(...arg) {
    super(...arg);
    let thiss = this;
    function WeakerMap(...arg) {
      return thiss.getSet(...arg);
    }
    let prox = new Proxy(thiss, {
      get: function (ob, prop) {
         if (!(prop in ob)) return WeakerMap[prop]
         let res = Reflect.get(thiss,prop);
         if (typeof res === "function") return res.bind(thiss);
         return res
      }
    });
    return proto.set(WeakerMap, prox);
  }
  getSet(key, val) {
    val =
      val ||
      proto.set(
        {},
        {
          getSet(key, value) {
            if (!this.hasOwnProperty(key)) this[key] = value;
            return this[key];
          }
        }
      );
    if (!this.has(key)) this.set(key, val);
    return this.get(key);
  }
}


export class Handler {
  constructor(original) {
    let defaultHandler = this;
    Reflect.ownKeys(Reflect).forEach((key) => {
      defaultHandler[key] = function (...arg) {
        let orig = original.handler || original;
        return key in orig ? orig[key](...arg) : Reflect.get[key](...arg);
      };
    });
    this.get = function (ob, prop, rec) {
      let orig = typeof original.handler === "object" ? original.handler : this;
      let defResult;
      let propResult;
      let getResult;
      let defFunction =
        typeof original.default === "function" && original.default;
      if (defFunction) defResult = defFunction(ob, prop);

      let getFunction =
        typeof orig.get === "function"
          ? orig.get
          : typeof original.default === "object" &&
            typeof original.default.get === "function"
          ? original.default.get
          : undefined;
      if (getFunction) getResult = getFunction(ob, prop);

      let propFunction =
        typeof original.get === "object" &&
        typeof original.get[prop] === "function"
          ? original.get[prop]
          : original.props && typeof original.props[prop] === "function"
          ? original.props[prop]
          : original.props &&
            typeof original.props.get === "object" &&
            typeof original.props.get[prop] === "function" &&
            original.props.get;

      if (propFunction) propResult = propFunction(ob, prop, rec);

      if (!defFunction && !getFunction && !propFunction) return ob[prop];
      return !undef(propResult)
        ? propResult
        : !undef(getResult)
        ? getResult
        : defResult;
    };
    this.set = function (ob, prop, val) {
      let org =
        typeof original.handler === "object" ? original.handler : original;
      let setResult;
      let propResult;
      let setFunction =
        typeof original.default === "object" &&
        typeof original.default.set === "function"
          ? original.default.set
          : typeof original.set === "function"
          ? original.set
          : original.handler &&
            typeof original.handler.set === "function" &&
            original.handler.set;

      let propFunction =
        original.props &&
        original.props.set &&
        typeof original.props.set[prop] === "function"
          ? original.props.set[prop]
          : original.set &&
            typeof original.set[prop] === "function" &&
            original.set[prop];

      if (propFunction) propResult = propFunction(ob, prop);
      if (setFunction) setResult = setFunction(ob, prop, val);

      if (!setFunction && !propFunction) return (ob[prop] = val);
      return !undef(propResult) ? propResult : !undef(setResult) && setResult;
    };
  }
}
/*
export function ObjectMap(obMap={}) {
  let types = new MapFunc(new WeakMap());
  let type = obMap instanceof Map ? "map" : "object";
  let asObject = type === "object" ? obMap : Object.fromEntries(obMap);
  let asMap = type === "object" ? new Map(Object.entries(obMap)) : obMap;

  asObject.asMap = function () {
    return asMap;
  };
  asMap.asObject = function () {
    return asObject;
  };

  // create the object map that will be returned from the constructor
  let objMapHandler = {};
  let objectMap = new Proxy(asObject, new Handler(objMapHandler));

  asObject.objectMap = asMap.objectMap = objectMap;
  types(objectMap, type);

  // create two separate proxies, one for each type
  let asObjectHandler = { objmapType: "object", target: asObject };
  let asMapHandler = {
    objmapType: "map",
    target: asMap,
    ownKeys(map) {
      return Reflect.ownKeys(map.objectMap);
    }
  };
  let asMapProxy = new Proxy(asMap, new Handler(asMapHandler));
  let asObjectProxy = new Proxy(asObject, new Handler(asObjectHandler));

  asMapHandler.props = {
    // default(ob,prop) {},
    delete(map, prop) {
      return function (key) {
        Reflect.deleteProperty(map.asObject(), key);
        return map.delete(key);
      };
    },
    get(map, prop) {
      return function get(key) {
        return map.asObject()[key];
      };
    },
    set(map, prop) {
      return function set(key, val) {
        map.asObject()[key] = val;
        map.set(key, val);
      };
    },
    has(map, prop) {
      return function has(key) {
        return map.asObject().hasOwnProperty(key);
      };
    },
    forEach(map, prop) {
      return function forEach(cb) {
        Reflect.ownKeys(map.objectMap).forEach((key, ind, ths) => {
          return cb(map.asObject()[key], key, ind, ths);
        });
      };
    }
  };

  asObjectProxy = new Proxy(asObject, asObjectHandler);
  asMapProxy = new Proxy(asObject, asMapHandler);

  objMapHandler.default = function (ob, prop) {
    let type = types(objectMap);
    let returnVal;
    if (type === "object") {
      returnVal = asObjectProxy[prop];
      if (typeof returnVal === "undefined" && !(prop in ob))
        returnVal = asMapProxy[prop];
    } else if (type === "map") {
      returnVal = asMapProxy[prop];
      if (typeof returnVal === "undefined" && !(prop in ob.asMap()))
        returnVal = asObjectProxy[prop];
    }
    return returnVal;
  };
  objMapHandler.props = {
    asObject(ob, prop, rec = objectMap) {
      return function (...arg) {
        types(objectMap, "object");
        if (proto.get(objMapHandler) === asMapHandler)
          proto.set(objMapHandler, asObjectHandler);
        return rec;
        // return ob.asObject(...arg)
      };
    },
    asMap(ob, prop, rec = objectMap) {
      return function () {
        types(objectMap, "map");
        if (proto.get(objMapHandler) === asObjectHandler)
          proto.set(objMapHandler, asMapHandler);
        return rec;
      };
    }
  };
  objMapHandler.set = function (ob, prop, val) {
    ob.asMap().set(prop, tie(Reflect.get(ob, prop, ob), ob));
    return Reflect.set(ob, prop, val);
  };
  objMapHandler.deleteProperty = function (ob, prop) {
    Reflect.deleteProperty(ob, prop);
    return ob.asMap().delete(prop);
  };
  objMapHandler.defineProperty = function (ob, prop, def) {
    Reflect.defineProperty(ob, prop, def);
    return ob.asMap().set(prop, ob[prop]);
  };
  objMapHandler.ownKeys = function (map, key) {
    return function keys() {
      let kys = [];
      map.forEach((val, key) => kys.push(key));
      return kys;
    };
  };

  types(obMap, type);
  return objectMap;
}
*/


export function ObjectMap(obMap={}) {

  vars.default(ObjectMap,{ keys: new WeakMap() })
  let keys = vars(ObjectMap).keys
  let origSet = keys.set.bind(keys)
  keys.set = (arg) => { 
     if (typeof arg === 'symbol') 
        return origSet(arg,{ key:arg })
     else return origSet(arg)
  } 
  class mapKey {
     constructor(obj,key,text) {
        let mapKey = Symbol(text||'MapKey')
        keys.set(mapKey,{ 
           key:key,
           map: vars(obj).map,
           object: vars(map).obj
        }) 
        return mapKey 
     }    
  }

  function initializeVars(om) {
     vars(om).type = om instanceof Map ? 'map' : 'object'
     if (!vars(om).map) vars(om).map = vars(om).type === 'object' ? new Map(Object.entries(om)) : om
     if (vars(om).type === 'object') {
        vars(om).map = ObjectMap(vars(om).map)
        vars(vars(om).map).obj = om
     }
     if (!vars(om).obj) vars(om).obj = om
  }
  if (!vars.has(obMap)) 
     initializeVars(obMap)
  
  // if it's an object, then we set the object's prototype to the map itself
  if (vars(obMap).type === 'object') {
     proto.set(obMap,vars(obMap).map)
     return obMap
  }

  let map = (ths) => vars(ths).map
  let obj = (ths) => vars(ths).obj

  let mpro = (ths) => {
     if (vars(ths).mpro) return vars(ths).mpro
     vars(ths).mpro = new Proxy(map(ths),{
        get(ob,prop) { 
           return map(ths)[prop]
        }
     })
     return vars(ths).mpro
  }

  const omProto = {
    get(key) { 
      if (!(typeof key === 'string' || typeof key === 'symbol'))
         key = this.symbolFromKey(this,key)
      return obj(this)[key]
    },
    set(key,val,alt) {
       mpro(this).set(key)
       let obkey = (typeof key === 'string' || typeof key === 'symbol') ? key : new mapKey(obj(this),key,alt)
       obj(this)[obkey] = val
    },
    delete(key) {
       mpro(this).delete(key)
       return delete obj(this)[key]
    },
    has(key) { 
       if (!(typeof key === 'string' || typeof key === 'symbol'))
          key = this.symbolFromKey(key)
       return !!obj(this)[key]
    },
    clear() {
       mpro(this).clear()
       return Obj(obj(this)).clear()
    },
    refresh() {
       mpro(this).forEach((val,key) => { 
          if (!obj(this).hasOwnProperty(key)) mpro(this).delete(key)
          mpro(this).set(key,ob(this)[key]) 
       })
       let objEnt = Object.entries(obj(this)).filter(([key,val] = ent) => !mpro(this).has(key))
       objEnt.forEach(([key,val] = ent) => mpro(this).set(key,val))
     },
     symbolFromKey(ob,key) {
        return Reflect.ownKeys(vars(ob).obj).find(key => keys.get(key) === key)
     },
     keyFromSymbol(ob,sym) {
       return keys.get(sym).key
     }
  }
  // if it's not a map then we have to get creative
  if (!(vars(obMap).type === 'map' && vars(obMap).obj !== obMap)) {
    let mixed = mixin(obMap,omProto)
    delete mixed.constructor
    proto.set(obMap,omProto)
 }

  return obMap
}

export const reverseExtend = (comp, pro) => {
  let kompProto;
  if (
    proto.get(comp).hasOwnProperty("konstructor") &&
    proto.get(comp).konstructor === "Komponent"
  )
    return;
  let oneBefore = getLevel(
    comp,
    (lvl) =>
      proto.get(lvl) &&
      proto.get(lvl).hasOwnProperty("konstructor") &&
      proto.get(lvl).konstructor === "Komponent"
  );
  kompProto = oneBefore
    ? proto.get(oneBefore)
    : pro ||
      clone(getLevel(comp, (lvl) => lvl.name === "Komponent").prototype, true, [
        "constructor"
      ]);
  if (oneBefore) proto.set(oneBefore, proto.get(kompProto))
  mixin(comp,kompProto)
};

export const classInherit = (komp, Komponent) => {
  let comp = proto.set({}, komp);
  while ((comp = proto.get(comp))) {
    if (proto.get(comp) === Komponent) break;
    if (proto.get(comp) === React.Component) {
      proto.set(comp, Komponent);
      break;
    }
  }
};
export const objInherit = (komp, Komponent) => {
  let comp = proto.set({}, komp);
  while ((comp = proto.get(comp))) {
    console.log(comp.constructor.name);
    if (proto.get(comp) && proto.get(comp).constructor === Komponent) break;
    if (proto.get(comp) && proto.get(comp).constructor === React.Component) {
      proto.set(comp, Komponent.prototype);
      break;
    }
  }
};
function bind(...arg) {
  let target = arg[0];
  if (typeof target !== "function" || isClass(target)) return target;
  return Function.prototype.bind.call(...arg);
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
export { tie };

export function cloneFunc(func, cb, binder) {
  var clonedFunctionName = func.name;
  const cloned = {
    [clonedFunctionName]: function (...props) {
      if (new.target) return new func(...props)
      return binder ? cb.call(binder, ...props) : cb(...props)
    }
  }[clonedFunctionName];
  cloned.prototype = func.prototype;
  const clonedProto = proto.set({}, func);
  ["call", "bind", "apply"].forEach((method) => {
    let original = tie(Function.prototype[method],cloned);
    clonedProto[method] = function (...arg) {
      let bin = binder || this
      binder = arg[0];
      if (method === "bind") {
        let newClone = cloneFunc(func, cb, arg[0]);
        let newOriginal = tie(Function.prototype.bind,newClone);
        binder = bin;
        return newOriginal(...arg)
      }
      try {
        return original(...arg);
      } finally {
        binder = bin;
      }
    };
  });
  Object.defineProperty(cloned, "name", { value: func.name });
  proto.set(cloned, clonedProto);
  return cloned;
}

export function ReflectBind(ob,prop,binder,bindMethod=tie) {
   let args = [...arguments]
   let desc = Object.getOwnPropertyDescriptor(ob,prop)
   if (!(desc.get || typeof desc.value === 'function'))
      return ob[prop]
   if (!binder) args = args.slice(0,2)
   if (bindMethod !== tie) {
      if (bindMethod.arguments.length < 2) {
         bindMethod = bindMethod.call
      }
   }
   return bindMethod(Reflect.get(...args),binder)
}

export function bindProxy(func,binder) {
   let handler = {
      apply(a, b, args) {
        return func.call(binder, ...args);
      },
      get(ob,prop) {
        if (prop === "bind")
          return function bind(bnd) {
             return bindProxy(func,bnd)
          };
        return ob[prop];
      }
   }
   return new Proxy(func,handler);
}

export function ReflectBindProx(ob,prop,binder) {
  let returnVal = Reflect.get(ob,prop,binder);
  if (typeof returnVal !== "function" || is.class(returnVal)) return returnVal;
  return tieProx(returnVal,binder);
}

export function defineBind(trg,prop,src,key,binder) {
   if (is.class(src[key])) return trg
   let desc = (is.descriptor(src)) && src
   if (!desc) {
      src = getLevel(src, (lvl) => lvl.hasOwnProperty(key))
      desc = Object.getOwnPropertyDescriptor(src, key)
   }
   const type = desc.get ? "get" : "value"
   desc[type] = tie(desc[type],binder);
   return Object.defineProperty(trg,prop,def);
}

export function cleanup(comp) {
  merge(comp, comp.tree, comp);
}

export function waitFor(conditionFunction, time = 100) {
  const poll = (resolve) => {
    if (typeof conditionFunction === "number") {
      setTimeout((_) => resolve(), conditionFunction);
    } else {
      if (conditionFunction()) resolve();
      else setTimeout((_) => poll(resolve), time);
    }
  };
  return new Promise(poll);
}

export function merge(target,src,exclude,binder) {
  let callback = (typeof exclude === 'function') ? exclude : undefined
  if (!Array.isArray(exclude)) exclude = []

  if (is.array(target) && is.array(src))
     return target.splice(target.length, 0, ...src.filter(item => !exclude.includes(item))) && target

  Reflect.ownKeys(src)
    .filter((key) => !exclude.includes(key))
    .forEach((key) => {
      let desc = Object.getOwnPropertyDescriptor(src, key);
      let type = desc.get ? "get" : "value";
      if (binder) {
        desc[type] =
          key === "constructor" ? desc[type] : bind(desc[type], binder);
        if (desc.set) desc.set = desc.set.bind(binder);
      }
      let throwThis
      try {
         let cbResult
         if (callback) {
            cbResult = callback(key,desc,target)
            desc = (cbResult === true) ? desc : cbResult
            if (cbResult instanceof Error || typeof cbResult === 'string') {
               throwThis = cbResult
               desc = undefined
            }
         }
         if (is.object(desc))
            Object.defineProperty(target,key,desc);
      } catch(err) { if (err) console.error(err); if (throwThis) throw throwThis  }
    });

  return target;
}

export function clone(obj, withProto = false, exclude = [], binder) {
  let cloned = merge({}, obj, exclude, binder);
  if (withProto) proto.set(cloned, proto.get(obj));
  return cloned;
}

export function getLevel(obj,cb) {
  let level = obj;
  let success = false;
  if (typeof level === "undefined") return;
  const loop = () => {
     level = proto.set({}, level);
     while ((level = proto.get(level))) {
       if (typeof level === "undefined") return;
       let result = cb(level)
       if (result) {
          success = true;
          return level
       }
    }
  };
  loop();
  return success ? level : undefined;
}

function getLevels(ob) {
   let levels = new Set()
   getLevel(ob,lvl => {
      if (!lvl) return true
      levels.add(lvl.constructor)
   })
   let lvls = Array.from(levels)
   lvls.strings = () => lvls.map(lvl => lvl.constructor.name)
}

export function getDescriptor(obj, prop) {
  let level = getLevel(obj, (lvl) => lvl && lvl.hasOwnProperty(prop));
  return level ? Object.getOwnPropertyDescriptor(level, prop) : undefined;
}

export function descriptorValue(obj, prop) {
  if (!obj) return;
  let desc;
  if (arguments.length === 1 && ("get" in obj || "value" in obj)) desc = obj;
  desc = desc || Object.getOwnPropertyDescriptor(obj, prop);
  return desc.hasOwnProperty("get") ? desc.get : desc.value
}

export function getNextLevel(lvl, prop) {
  if (!lvl || !prop) return;
  let current = descriptorValue(getDescriptor(lvl, prop));
  if (!current) return;

  return getLevel(lvl, (lvl2) => {
    let next = descriptorValue(lvl2, prop);
    return next && next !== current;
  });
}

export function cloneProxy(obj, handler = {}, binder) {
  let cloneProx = new Standin(obj, handler, binder);
  const bindIt = (o, pr, bndr = binder) => {
    if (bndr === "cloneProxy") bndr = cloneProx;
    if (!bndr || bndr === o || pr === "constructor") return Reflect.get(o, pr);
    return tie(Reflect.get(o, pr, bndr), bndr);
    /* let retVal = Reflect.get(o,pr,bndr)
      return (typeof retVal === 'function' && pr !== 'constructor') ? retVal.bind(bndr) : retVal */
  };
  handler.get = function (ob, prop, rec) {
    if (handler.hasOwProperty("get")) return bindIt(ob, prop);
  };
  handler.set = function (ob, prop, val) {
    ob = binder || ob;
    ob[prop] = val;
    return true;
  };
  if (!binder || binder === obj) return cloneProx;
  const traps = reflectKeys;
  traps.forEach((trap) => {
    handler[trap] = function (...args) {
      let trg = args.shift();
      trg = binder || trg;
      let theTrap = handler[trap] || Reflect[trap];
      return theTrap(trg, ...args);
    };
  });
  return cloneProx;
}

export function getStackTrace() {
   return new Propblem().log
}
/*
export function commandLine(command) {
  return require('child_process').execSync(command, (error, stdout, stderr) => {
     if (error) {
        console.log(`error: ${error.message}`);
        return;
     }
     if (stderr) {
       console.log(`stderr: ${stderr}`);
       return;
     }
     console.log(`stdout: ${stdout}`);
  });
}
*/
export function safe(ob, type = "get") {
  let props = [];
  let safeProx = Standin(ob, {
    get: function (ob,prop) {
      if (prop !== "done" && prop !== "setVal") props.push(prop);
      ob = ob["{{target}}"] || ob;
      if (prop === "done" || prop === "setVal") {
        return function(val) {
          if (val) {
             prop = last(props)
             ob[prop] = arguments[0];
          }
          return prop === "done" ? ob : safe(ob[prop]);
        };
      }
      if (type === "get") {
        if (!(prop in ob)) return safe({});
        return safe(ob[prop]);
      }
      if (!ob[prop]) ob[prop] = {};
      return safe(ob[prop], "set");
    },
    set: function (ob, prop, val) {
       ob[prop] = typeof ob[prop] === "undefined" ? ob[prop] : val;
       return true;
    }
  });
  // if (typeof ob !== 'object' && typeof ob !== 'function')
  // return ob
  return safeProx;
}

const swapProxy = function(reference,handler={}) {

   merge(handler,{ get target() { return reference() } })
   handlerSetup(handler)
   let newProxy = new Proxy(reference,handler)
   return { proxy: newProxy, swap: function(newTarget,newHandler) {
      reference = newTarget
      Obj(handler).clear(); merge(handler,newHandler)
   }}
   function handlerSetup(handler,trg,src=Reflect) {
      let target = () => trg || handler.target
      console.log('src',src); console.log('objc',Obj(src))
      Obj(src).forEach((key,val) => {
         handler[key] = function(...arg) { arg[0] = target(); return val(...arg) }
      })
   }   
}

let modExp = module.exports

module.exports = clone(modExp,true,(key,desc,trg) => {
   let get = desc.get
   let type = desc.get ? 'get' : 'value'
   if (type === 'value') delete desc.value
   desc.get = function() {
      return modExp[key] || this[key]
   }
   desc.set = function(val) {
      return modExp[key] = val
   }
})