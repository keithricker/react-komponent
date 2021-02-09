import React from "react";
import path from 'path'
const proto = { get: Object.getPrototypeOf, set: Object.setPrototypeOf };
const reflectKeys = Reflect.ownKeys(Reflect).concat(["enumerate"]);


export function isClass(func) {
  return is.class(func)
}

function undef(varble) {
  return typeof varble === "undefined";
}

export function isURL(url) {
  if (typeof url !== "string") return false;
  var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  return pattern.test(url) ? true : false;
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

export const is = (function () {
  return new Proxy(require("util").types || require("util"), {
    get(ob, prop) {
      let props = {
        get promise() {
          return ob.isPromise || isPromise;
        },
        get json() {
          return ob.isJSON || isJSON;
        },
        get url() {
          return ob.isURL || isURL;
        },
        defined(arg) {
           return ob.isDefined ? ob.isDefined(arg) : typeof arg !== "undefined";
        },
        empty(ob) { return (typeof ob === 'undefined') ? undefined : (!Reflect.ownKeys(ob).length) ? true : false },
        class(func) {
           return func.toString().split(" ")[0] === "class";
        },
        object(ob) { 
           let deflt = ob.isObject ? ob.isObject(ob) : typeof ob === 'object'
           return deflt && !Array.isArray(ob)
        },
        instanceOf(ob,...arg) {
           if (arg.length > 1) {
              let op = (['all','some','and','or'].includes(arg[arg.length-1])) ? arg[arg.length-1] : 'all'
              let res = arg.filter(ar => ob instanceof ar)
              if (['all','and'].includes(op)) 
                 return !!(res.length === arg.length)
              if (['some','or'].includes(op))
                 return !!(res.length)
           }
           return ob instanceof arg[0]
        },
        equivalent(ob1,ob2) {
           if (ob1 === ob2) return true
           if (typeof ob1 !== typeof ob2) return valse
           let desc = Object.getOwnPropertyDescriptors
           let toStr = (ob) => JSON.stringify(ob)+JSON.stringify(desc(ob))
           if (toStr(ob1) !== toStr(ob2)) return false

           let lvls1 = getLevels(ob1)
           let lvls2 = getLevels(ob2)
 
           let mismatch = lvls1.some((lvl,ind) => (lvl[ind] === lvls2[ind]) ? false : toStr(lvl) !== toStrlvls2[ind])
           return (mismatch) ? false : true
        },
        descriptor(obj) {
           if (!obj) return false
           if (!obj.hasOwnProperty('get') && !obj.hasOwnProperty('value')) return false
           if (Reflect.ownKeys(obj).length === 1) return true
           const descProperties = Reflect.ownKeys(Object.getOwnPropertyDescriptor(Object.defineProperty({},'property',{get:()=>{},set:()=>{}}),'property')).concat('value')
           return Reflect.ownKeys(obj).every(key => descProperties.includes(key))  
        },
        numeric(num) { return !isNaN(num) }
      };
      let types = ['undefined','object','boolean','number','bingint','string','symbol','function','object']
      let deflt = (...args) => { let item = (args.length > 1) ? arguments: args[0]; return (typeof ob[prop] === 'function') ? ob[prop](...args) : types.includes(prop) && typeof item === prop }
      
      let lcProp = prop.toLowerCase()
      if (props.hasOwnProperty(lcProp)) return props[lcProp]

      let lcProps = {};
      let mod = (str) => { 
         str = str.toLowerCase(); let spl = str.split('is'); if (spl[1] && (spl[0] === "")) return str[1] 
      }
      Reflect.ownKeys(ob).forEach(key => lcProps[mod(key)] = ob[key])
      let mprop = mod(prop)
      return typeof lcProps[mprop] === "function" ? lcProps[mprop] : deflt
    }
  });
})();

let and = (...arg) => arg.every(cond => cond)
let or = (...arg) => arg.some(cond => cond)
let tryCatch = (exp,cb) => { 
   let res; let err; 
   try { res = exp() } catch(error) { err = error } return cb ? cb(res,err) : err || res
}
let suppress = (exp,deflt) => { let res = tryCatch(exp); return res instanceof Error ? deflt : res }
let last = (arr) => {
   let obj = tryCatch(() => Object.fromEntries())
   if (arr.length) return Object.keys()
}

class Funktion extends Function {
   constructor(func,props) {
      let funktion
     
      let args = [...arguments]
      let mode = (typeof last(args) === 'string') ? 'Function' : 'Funktion'
      if (mode === 'Funktion') {
         props = (args.length === typeof props === 'object')
         
      }
      let superArgs = mode === 'Funktion' ? args : ['func','thiss',`return function ${props.name || this.name}() { 
         return Array.apply.bind(func)(thiss,Array.from(arguments))
      }`]
      funktion = mode === 'Funktion' ? this(func,this) : this
      merge(funktion,props)
      


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
      this.default = function(key,val={}) {
         if (!val instanceof PrivateVars) mixin(val,PrivateVars.prototype)
         if (!arguments[1] || !newVars.has(key)) {
            newVars.set(key,val)
            return val
         }
         let retrieved = newVars.get(key)
         if (retreived === val || is.equivalent(retreived,val)) return retreived
         if (typeof val === 'object' && typeof retrieved === 'object' && is.array(val) === is.array(retrieved)) {
            if (is.array(val)) {
               merge(retrieved,val)
            } else merge(retrieved,val,(key) => !(key in retrieved))
         }
         return retrieved || val
      }
      return this
   }
}

const vars = new PrivateVariables()

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

export const dynamicImport = (function() {
  return function(...arg) {
     let cb = arg[2]
     return cb ? dynImport(...arg) : new Promise(res => {
        arg[2] = (ret) => res(ret) 
        dynImport(...arg)
     })
  }

  function dynImport(script,id,callback) {
     let imports = vars.default(dynamicImport,{imports:{}})
     let scriptTag = document.createElement("script")
     scriptTag.setAttribute("id",id)
     scriptTag.setAttribute("src", script);
     scriptTag.setAttribute("async", "false")
 
     let head = document.head;
     head.insertBefore(scriptTag,head.firstElementChild)

     scriptTag.addEventListener("load", loaded, false)
     function loaded() {
        let newProps = {scriptTag,window,document}
        imports[id] = newProps
        return callback ? callback(newProps) : newProps
     }
  }
})()

export const boundMixin = (obj,mix,type='proxy',bound,primary,secondary,tertiary) => {
   bound = bound || obj
   primary = primary || obj
   secondary = secondary || proto.get(primary)
   tertiary = tertiary || mix
   if (type === 'proxy') {
      let mixProx = new Proxy(secondary, {
         get(sec,prop) {
            let deflt = {}
            let result = deflt
            let getResult = (object) => (object === primary ? object.hasOwnProperty(prop) : (prop in object)) ? tie(Reflect.get(object,prop,bound)) : deflt
            [primary,sec,secondary].some(object => { result = getResult(object); if (result !== deflt) return true })
            return result === deflt ? undefined : result
         }
      });
      return mixProx
   }
   let prox = boundMixin(primary,secondary,tertiary,'object',bound)
   return merge({},secondary,(prop,desc) => {
      desc.get = function() { 
         return prox[prop]
      }
      desc.set = function(val) { return this[prop] = val }
      delete desc.value
      return desc
   })
}

export function mixin(obj,mix,bound,precedence) {
   let prototype = proto.get(obj)
   precedence = precedence || mix
   let newMix = clone(mix,false,[],(key,desc) => {
      return {
         get() {
            let obs = [precedence,prototype === precedence ? mix : prototype]
            let owner = obs.find(ob => ob.hasOwnProperty(key))
            let inheriter = obs.filter(ob => ob !== owner).find(ob => (key in ob))
            let target = owner || inheriter
            let returnThis = (...args) => {
               return args[0] ? tie(Reflect.get(...args),bound) : undefined
            }
            return returnThis(...[target,key,bound].filter(arg => !!arg))
         },
         configurable:true
      }
   })
   return proto.set(obj,proto.set(newMix,proto.get(obj)))
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
        let res = Reflect.get(thiss, prop);
        if (typeof res === "function") return res.bind(thiss);
        return res;
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

export const Obj = (function () {
  const mixins = new WeakMap();
  let newObj = function Obj(obj) {
    if (mixins.has(obj)) return mixins.get(obj);
    let mix = {
      has(prop) {
        return this.hasOwnProperty(prop);
      },
      get keys() { return Reflect.ownKeys(this) },
      get type() {
        return Array.isArray(obj) ? "array" : typeof this;
      },
      get size() {
        return Reflect.ownKeys(this).length;
      },
      clear() {
         this.keys.forEach(key => {
            try { delete this[key] } catch(err) { console.error(err) }
         })
      },
      forEach(cb) {
         this.keys.forEach((key,ind) => cb(key,this[key],ind,this))
      },
      filter(cb) {
         let filtered = {}
         this.keys.forEach((key,ind) => {
            let res = cb(key,this[key],ind,filtered)
            if (res === true) filtered[key] = res
         })
         return filtered
      },
      define(key,val,type) {
        let isDef = false;
        if (arguments.length === 2 && is.object(val))
          isDef = is.descriptor(val)
        return Object.defineProperty(
          this,
          key,
          isDef ? val : { [type]: val, configurable: true }
        );
      },
      mixin(mix) { return mixin(this,mix) },
      get is() {
         function is(obj) {
            return Object.prototype.is.call(this,obj)
         }
      },
      equivalent(obj) {
         return is.equivalent(this,obj)
      },
      get proto() {
        return Object.getPrototypeOf(this);
      },
      set proto(val) {
        return Object.setPrototypeOf(this, val);
      }
    }
    mixins.set(obj,mix);
    return mix;
  };
  return newObj;
})();

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
  
  if (vars(obMap).type === 'object') {
     proto.set(obMap,vars(obMap).map)
     return obMap
   }

  let map = (ths) => vars(ths).map
  let obj = (ths) => vars(ths).obj

  let mp = Map.prototype
  
  let mpro = (ths) => {
     if (vars(ths).mpro) return vars(ths).mpro
     vars(ths).mpro = new Proxy(mp,{
        get(ob,prop) { 
           return Reflect.get(ob,prop,map(ths)).bind(ths)
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

  if (!(vars(obMap).type === 'map' && vars(obMap).obj !== obMap)) {
    let mixed = mixin(obMap,omProto)
    delete mixed.constructor
    proto.set(obMap,omProto)
 }

  return obMap
}





const proxInstances = new WeakMap();
export const Sub = (function () {
  let defaultHandler = (handler) =>
    proto.set(
      {
        get(ob, prop) {
          let defResult;
          let propResult;
          let defaultMethod =
            handler.default ||
            (typeof handler.get === "function" && handler.get) ||
            (handler.get && handler.get.default);

          if (defaultMethod) defResult = defaultMethod(ob, prop);
          let propObject =
            handler.props || (handler.get && typeof handler.get === "object");

          if (propObject && propObject.hasOwnProperty(prop)) {
            propResult = handler[prop](ob, prop);
            if (propResult || !defResult) return propResult;
          } else if (handler.hasOwnProperty(prop)) {
            propResult = handler[prop](ob, prop);
            if (propResult || !defResult) return propRes;
          }
          return defResult;
        },
        set(ob, prop, val) {
          let propResult;
          let defResult;
          let setMethod =
            (typeof handler.set === "function" && handler.set) ||
            (handler.set && handler.set.default);
          if (setMethod) defResult = setMethod(ob, prop, val);

          let propObject = typeof handler.set === "object" && handler.set;
          if (propObject && propObject.hasOwnProperty(prop))
            propResult = propObject[prop](ob, prop);
          return propResult === true
            ? propResult
            : defResult === true
            ? defResult
            : Reflect.set(...arguments);
        }
      },
      handler
    );
  return new Proxy(Proxy, {
    construct(target, hand = {}, binder) {
      let handler = defaultHandler(hand);
      let newProxy = new Proxy(target, handler);
      proxInstances.set(newProxy, target);
      let handlerCopy = clone(handler);
      let replace = handlerCopy || {};
      let trg = target;

      handler.get = function (ob, prop, rec) {
        let customGet;
        let replaced;
        let bindr = prop === "constructor" ? undefined : binder || rec;

        let properties = {};
        function refget(oj, pr, bn = bindr) {
          let args = [...arguments];
          if (!bn) args.pop();
          return Reflect.get(...args);
        }
        function call(func, arg = [ob, prop, binder], bn = bindr) {
          return !bn ? func(...arg) : func.call(bn, ...arg);
        }

        if (prop === "variant")
          replaced = properties.variant =
            ob.variant || replace.variant || "Sub";
        if (prop === "{{variant}}")
          replaced = properties["{{variant}}"] = ob["{{variant}}"] =
            replace["{{variant}}"] || "Sub";
        if (prop === "source")
          replaced = properties.source = ob.source || getStackTrace();
        if (prop === "{{source}}") replaced = getStackTrace();
        if (prop === "target")
          replaced = properties.target = ob.target || replace.target || trg;
        if (prop === "{{target}}")
          replaced = properties["{{target}}"] = replace["{{target}}"] || trg;
        if (prop === "{{handler}}")
          replaced = properties["{{handler}}"] =
            replace["{{handler}}"] || replace;
        if (prop === "handler")
          replaced = properties.handler =
            "handler" in ob ? ob.handler : replace.handler || replace;

        if (replace.hasOwnProperty("get")) {
          if (typeof replace.get === "object") {
            if (replace.get.hasOwnProperty(prop)) {
              properties[prop] = replace.get;
              replaced = call(replace.get, prop);
            }
            let def = replace.hasOwnProperty("{{default}}")
              ? "{{default}}"
              : "default";
            if (replace.get.hasOwnProperty(def)) {
              properties["{{default}}"] = replace.get;
              let getDefault = call(replace.get[def]);
              if (!replaced && typeof replaced !== "boolean")
                replaced = getDefault;
            }
          } else {
            properties["get"] = replace.get;
            let replaceGet = refget(replace, "get");
            customGet = call(replaceGet);
          }
        }
        if (
          replace.hasOwnProperty(prop) &&
          replace[prop].hasOwnProperty("get")
        ) {
          properties[prop] = replace[prop].get;
          replaced = call(refget(replace[prop], "get"));
        }

        if (replace.hasOwnProperty(prop) && !reflectKeys.includes(prop)) {
          properties[prop] = replace[prop];
          replaced = call(refget(replace, prop));
        }

        if (
          typeof customGet !== "undefined" &&
          typeof replaced === "undefined"
        ) {
          let propName = "returnProperty";
          if (
            properties.hasOwnProperty("returnProperty") ||
            "returnProperty" in rec
          )
            propName = "returnProperty" + randomString();
          properties[propName] = "get";
          return customGet;
        } else if (typeof replaced !== "undefined") {
          return replaced;
        }

        return refget(ob, prop);
      };
      handler.set = function (ob, prop, val) {
        if (
          replace.set &&
          replace.set.skip &&
          replace.set.skip.hasOwnProperty(prop)
        )
          return;
        let replaced;
        let replaceSet;
        if (replace.hasOwnProperty(prop) && replace[prop].hasOwnProperty("set"))
          replaced = replace[prop].set(ob, prop, val);
        if (typeof replaced === "boolean") return replaced;
        if (replace.hasOwnProperty("set")) {
          if (typeof replace.set === "object") {
            if (replace.set.hasOwnProperty(prop))
              replaced = replace.set[prop](ob, prop, val);
            let def = replace.hasOwnProperty("{{default}}")
              ? "{{default}}"
              : "default";
            if (
              replace.set.hasOwnProperty(def) &&
              typeof replaced !== "boolean"
            )
              replaced = replace.set[def](ob, prop, val);
          } else if (typeof replace.set === "function")
            replaceSet = replace.set(ob, prop, val) || true;
          return typeof replaced === "boolean" ? replaced : replaceSet;
        }
        ob[prop] = val;
        return true;
      };

      proxInstances.set(newProxy, target);
      return newProxy;
    },

    get(obj, prop) {
      if (prop === Symbol.hasInstance) {
        return (instance) => {
          return proxInstances.has(instance);
        };
      }
      return Reflect.get(...arguments);
    }
  });
})();

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
      binder = binder || new func(...props);
      return cb.call(binder, ...props);
    }
  }[clonedFunctionName];
  cloned.prototype = func.prototype;
  const clonedProto = proto.set({}, func);
  ["call", "bind", "apply"].forEach((method) => {
    let original = tie(Function.prototype[method], cloned);
    clonedProto[method] = function (...arg) {
      let bin = binder || this;
      binder = arg[0];
      if (method === "bind") {
        let newClone = cloneFunc(func, cb, arg[0]);
        let newOriginal = tie(Function.prototype.bind, newClone);
        binder = bin;
        return newOriginal(...arg);
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

export function ReflectBind(ob, prop, binder) {
  binder = binder || ob;
  return bind(Reflect.get(ob, prop, binder), binder);
}

export function ReflecTie(ob, prop, binder) {
  let returnVal = tie(Reflect.get(ob, prop, binder), binder);
  if (typeof returnVal !== "function")
    return function () {
      return returnVal;
    };
  return returnVal;
}

export function tieProx(func, binder) {
  return new Proxy(func, {
    apply(a, b, args) {
      return func.call(binder, ...args);
    },
    get(ob, prop) {
      if (prop === "bind")
        return function bind(bnd) {
          return new tieProx(func, bnd);
        };
      return ob[prop];
    }
  });
}

export function ReflecTieProx(ob, prop, binder) {
  let returnVal = Reflect.get(ob, prop, binder);
  if (typeof returnVal !== "function") return returnVal;
  return tieProx(returnVal, binder);
}

export function defineTie(trg, prop, src, key, binder) {
  src = getLevel(src, (lvl) => lvl.hasOwnProperty(key));
  const def = Object.getOwnPropertyDescriptor(src, key);
  const type = def.hasOwnProperty("get") ? "get" : "value";
  def[type] = tie(def[type], binder);
  return Object.defineProperty(trg, prop, def);
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
            cbResult = callback(key,desc)
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

export function getLevel(obj, cb) {
  let level = obj;
  let success = false;
  if (typeof level === "undefined") return;
  const loop = () => {
    level = proto.set({}, level);
    while ((level = proto.get(level))) {
      if (typeof level === "undefined") return;
      if (cb(level)) {
        success = true;
        return level;
      }
    }
  };
  loop();
  return success ? level : undefined;
}

export function getLevels(ob) {
   let levels = new Set()
   getLevel(ob,lvl => {
      if (!lvl) return true
      levels.add(lvl.constructor)
   })
   return Array.from(levels)
}

export function getDefinition(obj, prop) {
  let level = getLevel(obj, (lvl) => lvl && lvl.hasOwnProperty(prop));
  return level ? Object.getOwnPropertyDescriptor(level, prop) : undefined;
}

export function descriptorValue(obj, prop) {
  if (!obj) return;
  let desc;
  if (arguments.length === 1 && ("get" in obj || "value" in obj)) desc = obj;
  desc = desc || Object.getOwnPropertyDescriptor(obj, prop);
  if (!desc) return;
  return desc.hasOwnProperty("get") ? desc.get : desc.value;
}

export const getProp = (obj, prop) => {
  let desc = getDefinition(obj, prop);
  if (!desc) return;
  return desc.hasOwnProperty("get") ? desc.get : desc.value;
};

export function getNextLevel(lvl, prop) {
  if (!lvl || !prop) return;
  let current = descriptorValue(getDefinition(lvl, prop));
  if (!current) return;

  return getLevel(lvl, (lvl2) => {
    let next = descriptorValue(lvl2, prop);
    return next && next !== current;
  });
}

export function cloneProxy(obj, handler = {}, binder) {
  let cloneProx = new Sub(obj, handler, binder);
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
  let stackTrace;
  let stack;
  stack = new Error().stack;
  stackTrace = stack.split("\n");
  stackTrace.forEach((st, ind) => {
    let returnVal = st.split("@")[0];
    if (returnVal.includes(" (")) returnVal = returnVal.split(" (")[0];
    if (returnVal.includes("    at "))
      returnVal = returnVal.split("    at ")[1];
    stackTrace[ind] = returnVal;
  });
  stackTrace.shift();
  stackTrace.pop();
  if (stackTrace[0].includes("getStackTrace")) stackTrace.shift();
  return stackTrace.filter((ti) => ti !== "");
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
  let safeProx = Sub(ob, {
    get: function (ob,prop) {
      if (prop !== "done" && prop !== "setVal") props.push(prop);
      ob = ob["{{target}}"] || ob;
      if (prop === "done" || prop === "setVal") {
        return function(val) {
          if (val) {
             prop = props[props.length - 1];
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

export const Module = (function() {
  class Module {
    constructor(mod,mode='common') {
     
       const ModPriv = vars.default(Module,{imports: new ObjMap(new Map())})
       const ext = Obj(this)
       priv.module = mod
       if (!mod.exports) mod.exports = priv.exports = {}
       priv.mode = arguments[1] ? mode : mod.exports.__esModule ? 'es' : 'common'

       let self = this

       this.imports = new MapFunc(new Map())
       this.requirements = new MapFunc(new Map())

       let exportsHandler = {
          get target() { return priv.exports },
          get(ob,prop) {
             ob = this.target
             if (prop === '__esModule')
                return priv.mode === 'es'

             if (prop === 'default')
                return ('default' in ob) ? ob.default : ob

             return ob[prop]
          },
          set(ob,prop,val) { 
             if (prop === '__esModule')
                if (val === true) priv.mode = 'es'
             return ob[prop] = val
          }
       }

       const { proxy:exportsProxy,swap } = swapProxy(() => { return priv.mod.exports },exportsHandler)
       ext.define('exports', {

          get() { 

             let compiled; let returnVal

             const exp = (modex) => {
                if (modex.default) returnVal = modex.default
                else if (!modex.__esModule) returnVal = modex
                else returnVal = exportsProxy
             }

             if (this.mode === 'es') {
                   
                try { 
                   exp(priv.mod.exports)
                   return returnVal
                }  
                catch {
                   // get compiled version
                   /* uncomment this */
                   // compiled = this.compile.babel()
                   return exp(compiled)
                } 

             }

          },
          set(val) { priv.mod.exports = val },
          configurable:true
       })

       let thisProxy = new Proxy(mod,{
          get(ob,prop) { return (prop in self) ? self[prop] : ob[prop] }
       })

       return thisProxy

    }

    get import() {
       vars.default(this,imports)
       return vars(this).import || function(mod) {
         let env = (is.function(require) && is.defined(path) && is.defined(path.resolve) && is.defined(module)) ? 'npm' : 'browser'
         let resolved = (is.string(mod)) && require.resolve(mod)
         let fromCache = this.imports.has(mod)
         if (fromCache)
            return fromCache.compiled || fromCache.exports
         let returnVal; let compiled
         let obj = (typeof mod === 'object') && mod
         if (!obj) {
            try { 
               obj = this.require(mod) 
            } catch {
               compiled = obj = this.compile.babel(resolved)
            }
         }
         returnVal = obj.default || obj
         let modl = (typeof mod === 'string') ? resolved : mod
         this.imports.set(modl,{ exports:returnVal,compiled })

         return returnVal
      }
    }
  

/*

 	// expose the modules object (__webpack_modules__)
 	__webpack_require__.m = modules;

 	// expose the module cache
 	__webpack_require__.c = installedModules;

 	// define getter function for harmony exports
 	__webpack_require__.d = function(exports, name, getter) {
 		if(!__webpack_require__.o(exports, name)) {
 			Object.defineProperty(exports, name, {
 				configurable: false,
 				enumerable: true,
 				get: getter
 			});
 		}
 	};

 	// define __esModule on exports
 	__webpack_require__.r = function(exports) {
 		Object.defineProperty(exports, '__esModule', { value: true });
 	};

 	// getDefaultExport function for compatibility with non-harmony modules
 	__webpack_require__.n = function(module) {
 		var getter = module && module.__esModule ?
 			function getDefault() { return module['default']; } :
 			function getModuleExports() { return module; };
 		__webpack_require__.d(getter, 'a', getter);
 		return getter;
 	};

 	// Object.prototype.hasOwnProperty.call
 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

 	// __webpack_public_path__
 	__webpack_require__.p = "";


 	// Load entry module and return exports
 	return __webpack_require__(__webpack_require__.s = 0);
 })
*/




    get dynamicImport() { return dynamicImport.bind(this) }
    dynamicImportSync(mod) { return (function() { return require(mod) })() }
    get imports() {  
       let imports = vars.default(Module,{imports:new new MapFunc(new Map())})
       return Array.from(imports.entries).map(ent => ent[0])
    }
    require(mod) {
       let required = this.requirements.get(mod) || require(mod)
       this.requirements.set(mod,required); 
       return required
    }
    get mode() {
       let priv = vars(this)
       if (!priv.mode) priv.mode = (priv.exports && priv.exports.__esModule) ? 'es' : 'common' 
       return priv.mode
    }
    set mode(mood) { 
       let priv = vars(this)
       priv.mode = mood; 
       if (priv.exports && ('__esModule' in priv.exports)) {
          try { Object.defineProperty(priv.exports,'__esModule',{value:mood}) } catch {}
       } 
       return true
    }
    get compile() {
       let comp = function compile() {}
       let self = this
       comp.babel = function(src,pth) {
          
          src = path.resolve(process.cwd(),src || self.id)
          let processed

          let asString = require('fs').readFileSync(src)
          processed = require("@babel/core").transformSync(asString,{
             presets: ["@babel/preset-react”,”@babel/preset-env"],
             plugins: ["@babel/plugin-transform/react-jsx"]
          }); 

          if (!pth) return require('require-from-string')(processed)
          let dest = path.resolve(process.cwd(),pth)
          require('fs').writeFileSync(dest,asString)

       }
       Obj(comp).define('webpack',() =>require('../../../server').webpack,'get')
       return comp
    }
  }

  return Module
})()