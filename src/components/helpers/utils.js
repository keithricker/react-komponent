
import React from "react";
import path from 'path'
const proto = { get: Object.getPrototypeOf, set: Object.setPrototypeOf };
const reflectKeys = Reflect.ownKeys(Reflect).concat(["enumerate"]);


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
        descriptor(obj) {
           if (!obj) return false
           if (!obj.hasOwnProperty('get') && !obj.hasOwnProperty('value')) return false
           if (Reflect.ownKeys(obj).length === 1) return true
           const descProperties = Reflect.ownKeys(Object.getOwnPropertyDescriptor(Object.defineProperty({},'property',{get:()=>{},set:()=>{}}),'property')).concat('value')
           return Reflect.ownKeys(obj).every(key => descProperties.includes(key))  
        }
      };
      let types = ['undefined','object','boolean','number','bingint','string','symbol','function','object']
      let deflt = (...args) => { let item = (args.length > 1) ? arguments: args[0]; return (typeof ob[prop] === 'function') ? ob[prop](...args) : types.includes(prop) && typeof item === prop }
      if (props.hasOwnProperty(prop)) return props[prop]
      let modProp = "is" + capitalize(prop);
      return typeof ob[modProp] === "function" ? ob[modProp] : deflt
    }
  });
})();
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
export function mapFunc(map,func) {
   let returnFunc = function mapFunc(ob,val) {
      if (func) return func(ob,val,map,[...arguments])
      let set; let retrieved = map.get(ob)
      if (arguments[1]) set = map.set(ob,val)
      return set || retrieved
   }
   proto.set(returnFunc,new Proxy(Function,{
      get(ob,prop) {
         let propOwner = (prop in map) ? map : returnFunc 
         return (typeof propOwner[prop] === 'function') ? propOwner[prop].bind(propOwner) : Reflect.get(propOwner,prop,propOwner)
      }
   }))
   return returnFunc
}

export class PrivateVariables {
   constructor(newVars) {
      if (!newVars) newVars = new WeakMap()
      const newMapFunc = mapFunc(newVars,(key,val,map,args) => {
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
      newMapFunc.default = function(key,val={},defKey,defValue) {
         key = newVars.get(key) || newVars.set(key,val)
         if (!is.defined(arguments[2]) || val.hasOwnProperty(defKey)) return val
         if (is.instanceOf(val,Map,WeakMap,'or')) val.set(defKey,defValue); else val[defKey] = defValue
         return defValue
      }
      return newMapFunc
   }
}
const vars = new PrivateVariables()

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
        descriptor(obj) {
           if (!obj) return false
           if (!obj.hasOwnProperty('get') && !obj.hasOwnProperty('value')) return false
           if (Reflect.ownKeys(obj).length === 1) return true
           const descProperties = Reflect.ownKeys(Object.getOwnPropertyDescriptor(Object.defineProperty({},'property',{get:()=>{},set:()=>{}}),'property')).concat('value')
           return Reflect.ownKeys(obj).every(key => descProperties.includes(key))  
        }
      };
      let types = ['undefined','object','boolean','number','bingint','string','symbol','function','object']
      let deflt = (...args) => { let item = (args.length > 1) ? arguments: args[0]; return (typeof ob[prop] === 'function') ? ob[prop](...args) : types.includes(prop) && typeof item === prop }
      if (props.hasOwnProperty(prop)) return props[prop]
      let modProp = "is" + capitalize(prop);
      return typeof ob[modProp] === "function" ? ob[modProp] : deflt
    }
  });
})();

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

export function lowerFirst(word) {
  console.log("word", word);
  return word.charAt(0).toLowerCase() + word.slice(1);
}

export function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
export function toHash(obj) {
  if (!obj) return 0;
  console.log("the objj", obj);
  let toString = JSON.stringify(obj);
  var hash = 0;
  let char;
  let i;

  if (toString.length === 0) return hash;

  for (i = 0; i < toString.length; i++) {
    char = toString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash;
}
export function randomString(length = 32) {
  return Math.round(
    Math.pow(36, length + 1) - Math.random() * Math.pow(36, length)
  )
    .toString(36)
    .slice(1);
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
     let imports = dynImport.imports || {}
     let scriptTag = document.createElement("script")
     scriptTag.setAttribute("id",id)
     scriptTag.setAttribute("src", script);
     scriptTag.setAttribute("async", "false")
 
     let head = document.head;
     head.insertBefore(scriptTag,head.firstElementChild)

     let before = Reflect.ownKeys(window)
     scriptTag.addEventListener("load", loaded, false)
     function loaded() {
        let newProps = mapFunc(new Map())
        let difference = Reflect.ownKeys(window).filter(key => !before.includes(key))
        difference.forEach(key => newProps(key,window[key]))
        imports[id] = newProps
        return callback ? callback(newProps) : newProps
     }
  }
})()

export const mixin = (obj, mix) => {
  let mixProx = new Proxy(proto.get(obj), {
    get(ob, prop) {
      if (obj.hasOwnProperty(prop)) return ob[prop];
      if (ob.hasOwnProperty(prop)) return obj[prop];
      return tie(Reflect.get(mix, prop, obj), obj);
    }
  });
  return mixProx;
};

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
         Reflect.ownKeys(this).forEach(key => {
            try { delete this[key] } catch(err) { console.error(err) }
         })
      },
      forEach(cb) {
         Reflect.ownKeys(this).forEach((key,ind,ths) => cb(key,this[key],ind,ths))
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

export function ObjectMap(obMap={}) {
  let types = mapFunc(new WeakMap());
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
  if (oneBefore) proto.set(oneBefore, proto.get(kompProto));
  proto.set(comp, proto.set(kompProto, proto.get(comp)));
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
         if (callback) cbResult = callback(key,desc)
         if (cbResult instanceof Error || typeof cbResult === 'string') throwThis = cbResult
         else if (cbResult && is.descriptor(cbResult))
            desc = cbResult
         if (cbResult !== false)
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

       this.imports = mapFunc(new Map())

       this.requirements = mapFunc(new Map())

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
    import(mod) {
       let fromCache = this.imports(typeof mod === 'string' ? require.resolve(mod) : mod)
       if (fromCache)
          return fromCache.returned
       let returnVal; let compiled
       let obj = (typeof mod === 'object') && mod
       if (!obj) {
          try { 
             obj = require(mod) 
          } catch {
             if (this.requirements)
             compiled = obj = this.compile.babel(require.resolve(mod))
          }
       }
       returnVal = obj.default || obj
       if (typeof mod === 'string') mod = require.resolve(mod)
       this.imports.set(mod,{ returned:returnVal,compiled })

       return returnVal
    }
    get imports() {  
       let imports = vars(Module,{},'imports',importsMap)
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