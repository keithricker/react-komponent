import klass from "./klass";
import _Proxy from "./_Proxy";
const utilTypes = () => require("util").types;

let boundDescriptor = (ob, prop, bind) => {
  let desc = Object.getOwnPropertyDescriptor(ob, prop);
  if (!bind) return desc;
  let type = desc.get ? "get" : "value";
  desc[type] = desc[type].bind(bind);
  return desc;
};
let merge = (trg, src, ex = [], bind) => {
  let descs = {};
  Reflect.ownKeys(src)
    .filter((key) => !ex.includes(key))
    .forEach((key) => (descs[key] = boundDescriptor(src, key, bind)));
  return Object.defineProperties(trg, descs);
};
const mixin = (target, mix, trg) => {
  return Object.setPrototypeOf(
    target,
    Object.setPrototypeOf(mix, Object.getPrototypeOf(target))
  );
}

function entries(obj) {
  return Reflect.ownKeys(obj).map(key => {
     let ent = [key,'']; Object.defineProperty(ent,1,Object.getOwnPropertyDescriptor(obj,key))
     return ent
  })
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

function descriptors(ob,defaults, ...bind) {
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
     if (typeof defaults === "function") descs[key] = defaults(desc) || desc;
     else Object.assign(desc, defaults);
   }
 })
 console.log('descs',descs)
 return descs;
}


function boundObject(object,bind,callback) {

 if (arguments.length === 1) {
    callback = object; object = {}
 }
 if (arguments.length === 2) {
    callback = bind
    bind = undefined
 }
 if (arguments.length < 3 && !Array(...arguments).some(ar => typeof ar === 'function'))
   callback = function() { return Object.defineProperties(this,Object.getOwnPropertyDescriptors(object)) }

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
  key = Object(key).toString()
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

function boundProperties(object,...bind) {
    console.log('hey!')
    return boundObject({},object,function() {
       let descs = descriptors(object,(desc) => {
         Array('set','get','value').forEach(type => {
           if (typeof desc[type] === 'function') {
             let property = desc[type]
             desc[type] = function(...arg) {
                 arg = Object.assign(arg,bind.slice(1))
                 try { return property.call(bind[0],...arg) } catch(err) { console.log(bind[0]); if (desc.key in bind[0]) return bind[desc.key](...arg);  }
             }
             console.log('desc',desc)
             return desc
           }
         })
       })
       return Object.defineProperties(this,descs)    
    })
} 
export const is = (function () {
  const isHandler = {
    get props() {
      return {
        get promise() {
          return (
            utilTypes().isPromise ||
            function (res) {
              return typeof res === "object" && res instanceof Promise;
            }
          );
        },
        get json() {
          return (
            utilTypes().isJSON ||
            function isJSON(data) {
              if (typeof data !== "string") return false;
              data = data.trim();
              let match = data.match(/\{[^{}]+\}/) || [];
              return match[0] === data;
            }
          );
        },
        get url() {
          return (
            utilTypes().isURL ||
            function isURL(url) {
              if (typeof url !== "string") return false;
              if (!isURL.pattern)
                isURL.pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
              return isURL.pattern.test(url) ? true : false;
            }
          );
        },
        defined(arg) {
          return utilTypes().isDefined
            ? utilTypes().isDefined(arg)
            : typeof arg !== "undefined";
        },
        empty(ob) {
          return typeof ob === "undefined"
            ? undefined
            : !utilTypes().length
            ? true
            : false;
        },
        class(func) {
          let classText = (str) => str.split(" ")[0] === "class";
          let funcString = func.toString().toLowerCase();
          if (classText(funcString)) return true;
          let call = suppress(() => func());
          return call && call.message && classText(call.message.toLowerCase())
            ? true
            : false;
        },
        object(ob) {
          let deflt = ob.isObject ? ob.isObject(ob) : typeof ob === "object";
          return deflt && !Array.isArray(ob);
        },
        instanceOf(ob, ...arg) {
          let last = (arr) => [...arr][arr.length - 1];
          if (arg.length > 1) {
            let op = ["all", "some", "and", "or"].includes(last(arg))
              ? last(arg)
              : "all";
            let res = arg.filter((ar) => ob instanceof ar);
            if (["all", "and"].includes(op))
              return !!(res.length === arg.length);
            if (["some", "or"].includes(op)) return !!res.length;
          }
          return ob instanceof arg[0];
        },
        equivalent(ob2) {
          let ob1 = this;
          if (ob1 == ob2 && typeof ob1 === typeof ob2) return true;
          if (typeof ob1 !== typeof ob2) return false;
          ob1 = Object(ob1);
          ob2 = Object(ob2);
          if (Reflect.ownKeys(ob1).length !== Reflect.ownKeys(ob2).length)
            return false;
          if (
            suppress(() => {
              return ob1.toString() !== ob2.toString();
            }, true)
          )
            return false;
          return (
            JSON.stringify(Reflect.ownKeys(ob1)) ===
              JSON.stringify(Reflect.ownKeys(ob2)) &&
            Reflect.ownKeys(ob1).every((key) => ob1[key] === ob2[key]) &&
            entries(Object.getOwnPropertyDescriptors(ob1)).every(
              ([key, desc]) => {
                return (
                  JSON.stringify(desc) ===
                  JSON.stringify(Object.getOwnPropertyDescriptor(ob2, key))
                );
              }
            )
          );
        },
        descriptor(desc) {
          if (!this.isValidDescriptor(desc)) return false;
          let def = Object.defineProperty({}, "prop", desc);
          let newDesc = Object.getOwnPropertyDescriptor(def, "prop");
          return this.equivalent(desc, newDesc);
        },
        validDescriptor(desc) {
          if (typeof desc !== "object") return false;
          return suppress(() => {
            let isDescriptor = true;
            let defined = Object.defineProperty({}, "prop", desc);
            let described = Object.getOwnPropertyDescriptor(defined, "prop");
            if (desc.value) return desc.value === defined.prop;
            if (desc.get) isDescriptor = desc.get === described.get;
            if (desc.set) isDescriptor = desc.set === described.set;
            return isDescriptor;
          }, false);
        },
        descriptors(ob) {
          if (ob.constructor.name === 'Descriptors') return true
          let keys = Reflect.ownKeys(ob)
          if (!ob.length || !keys.every(key => isNaN(key))) return false
          let copy = Object.getOwnPropertyDescriptors(Object.defineProperties({},ob))
          return JSON.stringify(ob) === JSON.stringify(copy)
        },
        numeric(num) {
          return !isNaN(num);
        }
      };
    },
    get(ob, prop) {
      if (prop === "{{handler}}") return isHandler;
      let types = [
        "undefined",
        "object",
        "boolean",
        "number",
        "bingint",
        "string",
        "symbol",
        "function",
        "object"
      ];
      let deflt = (...args) => {
        let item = args.length > 1 ? args[1] : args[0];
        return typeof ob[prop] === "function"
          ? ob[prop](...args)
          : types.includes(prop) && typeof item === prop;
      };

      let lcProp = prop.toLowerCase();
      if (this.props.hasOwnProperty(lcProp)) return this.props[lcProp](ob);

      let lcProps = {};
      let mod = (str) => {
        str = str.toLowerCase();
        let spl = str.split("is");
        if (spl[1] && spl[0] === "") return str[1];
      };
      Reflect.ownKeys(ob).forEach((key) => (lcProps[mod(key)] = ob[key]));
      let mprop = mod(prop);
      return typeof lcProps[mprop] === "function" ? lcProps[mprop] : deflt();
    }
  };

  const iz = function is(ob) {
    return new Proxy(ob, isHandler);
  };
  return new Proxy(iz, isHandler);
})();

const suppress = (cb, def) => {
  try {
    return cb();
  } catch {
    return def;
  }
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
const ReflectBind = (obj, prop, bind) => {
  if (
    (typeof bind !== "function" || prop === "constructor") &&
    typeof bind !== "object"
  )
    return obj ? obj[prop] : undefined;
  let res = Reflect.get(obj, prop, bind);
  return typeof res === "function" ? res.bind(bind) : res;
};
const proto = { get: Object.getPrototypeOf, set: Object.setProrotypeOf };
const _if = (exp, then) => {
  exp = exp();
  if (typeof then === "function") return then(exp);
  return exp || then;
};
let Obj = function (obj) {
  const iz = is;
  const mixins = new WeakMap([[Obj, { mixins: new WeakMap() }]]).get(Obj)
    .mixins;
  // const mixin = (...arg) => require('./utils').mixin(...arg)
  // const PrivateVariables = (...arg) => new require('./utils').PrivateVariables(...arg)
  // const vars = (...arg) => require('./utils').vars(...arg)
  // const ReflectBind = (...arg) => require('./utils').ReflectBind(...arg)

  // vars.default(Obj,{ mixins:new PrivateVariables() })
  // let iz = is
  obj = Object(obj);
  console.log("obj", obj);

  this.bind = obj;
  let properties = (this.properties = {
    has(prop) {
      return this.hasOwnProperty(prop);
    },
    get keys() {
      return Reflect.ownKeys(this);
    },
    get type() {
      return Array.isArray(this) ? "array" : typeof this;
    },
    get Type() {
      let theType;
      let self = this["{{target}}"] || this;
      console.log("thiss", this);
      const Type = function Type() {
        return {}.toString.call(self).split("[")[1].split(" ")[1].split("]")[0];
      };
      // let glb = suppress(() => window,global)
      Type.class = () => global[theType];
      return Type;
    },
    getLevel(cb) {
      let obj = this;
      cb = [...arguments].find((ar) => typeof ar === "function");
      let level = obj;
      let success = false;
      if (typeof level === "undefined") return;
      const loop = () => {
        level = Object.setPrototypeOf({}, level);
        while ((level = Object.getPrototypeOf(level))) {
          if (typeof level === "undefined") return;
          let result = cb(level);
          if (result) {
            success = true;
            return level;
          }
        }
      };
      loop();
      return success ? level : undefined;
    },
    tree() {
      let levels = {};
      properties.getLevel.call(this, (lvl) => {
        if (!lvl) return true;
        if (!lvl.constructor) return false;
        levels[lvl.constructor.name] = lvl.constructor;
      });
      Object.setPrototypeOf(levels, {
        get reversed() {
          let reversed = {};
          Object.keys(levels)
            .reverse()
            .forEach((key) => (reversed[key] = levels[key]));
          return reversed;
        }
      });
      return levels;
    },
    descriptor(property, ...bind) {
      desc = Reflect.getOwnPropertyDescriptor(this, property);
      if (bind.length) {
        Reflect.ownKeys(desc)
          .filter((key) => key !== "set")
          .forEach((key) => {
            if (typeof desc[key] === "function")
              desc[key] = desc[key].bind(...bind);
          });
      }
      return desc;
    },
    descriptors(defaults, ...bind) {
      let ob = this;
      // spreading the bind argument allows for passing multiple arguments to bind method
      let descs = Object.getOwnPropertyDescriptors(ob);
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
    },
    get entries() {
      let self = this;
      const entries = function (enumerable = false, symb = false) {
        if ("entries" in self) return self.entries;
        let method;
        let ents = [];
        method =
          (symb && enumerable && Reflect.ownKeys) ||
          (enumerable && Object.getOwnPropertyNames) ||
          Object.keys;
        let entry = [];
        method(self).forEach((key) => {
          let descriptor = Object.getOwnPropertyDescriptor(self, key);
          let type = descriptor.get || descriptor.value;
          if (typeof descriptor[type] === "function")
            descriptor[type] = descriptor[type].bind(self);
          entry[0] = key;
          Object.defineProperty(
            entry,
            1,
            Object.getOwnPropertyDescriptor(this, key)
          );
          ents.push(entry);
        });
        return ents;
        // let method = (symb) && Reflect.ownKeys || enumerable && Object.getOwnPropertyNames ||
      };
      entries.asArray = function () {
        return Array.from(self.entries());
      };
      return entries;
    },
    size(enumerable = false, symb = false) {
      let self = this;
      if ("size" in this && !isNaN(this.size)) return this.size;
      if (typeof this === "string") return this.length;
      if (
        (suppress(() => {
          self = [...this];
          return self;
        }),
        false)
      )
        return this.length;
      self = Object(self);
      self = suppress(() => {
        let res = Object.fromEntries(self);
        return res || self;
      }, self);
      return enumerable && symb
        ? Reflect.ownKeys(self).length
        : enumerable
        ? Object.getOwnPropertyNames(self).length
        : Object.keys(self).length;
    },

    clear() {
      Reflect.ownKeys(this).forEach((key) => {
        try {
          delete this[key];
        } catch (err) {
          console.error(err);
        }
      });
    },
    forEach(cb) {
      Reflect.ownKeys(this).forEach((key, ind) =>
        cb(key, this[key], ind, this)
      );
    },
    filter(cb) {
      let filtered = {};
      Reflect.ownKeys(this).forEach(
        function (key, ind) {
          let res = cb(key, this[key], ind, filtered);
          if (res === true) filtered[key] = res;
        }.bind(this)
      );
      return filtered;
    },
    map(mapped, cb) {
      cb = cb || mapped;
      mapped = arguments[1] ? mapped : undefined;
      let self = this;
      if (proto.get(this).hasOwnProperty("map"))
        return proto.get(this).map.bind(this);
      mapped = new Obj(this).Type.class();
      Reflect.ownKeys(this).forEach((key, ind) => {
        let res = cb(key, self[key], ind, mapped);
        let desc = is.descriptor(res)
          ? res
          : {
              value: res,
              writable: true,
              configurable: true,
              enumerable: true
            };
        Object.defineProperty(mapped, key, desc);
      });
      return mapped;
    },
    define(key, val, type) {
      let isDef = false;
      if ([...arguments].length === 2 && is.thisect(val))
        isDef = is.descriptor(val);
      return Object.defineProperty(
        this,
        key,
        isDef ? val : { [type]: val, configurable: true }
      );
    },
    reverseLookup(val) {
      let key;
      let lvl = properties.getLevel(this, (lv) => {
        if (
          val.name &&
          lvl.hasOwnProperty(val.name) &&
          iz.equivalent(val, lvl[val.name], false)
        )
          key = val.name;
        Reflect.ownKeys(lv).some((pr) => {
          key = iz.equivalent(val, lv[pr]) && pr;
        });
        if (key) return true;
      });
      return key;
    },
    mixin(mix, target) {
      return mixin(this, mix);
    },
    bind(target) {
      return new Proxy(this, {
        get(ob, prop) {
          return ReflectBind(ob, prop, target);
        }
      });
    },
    mirror(trg, bnd) {
      let bind = (target = trg) => bnd || (target !== bnd && trg);
      trg = trg || new Obj(this).Type.class();
      return merge(trg, this, (key, desc) => {
        delete desc.value;
        desc.get = function () {
          return ReflectBind(key, this[key], bind);
        };
        return desc;
      });
    },

    get is() {
      return iz(this);
    },
    equivalent(obj) {
      return iz.equivalent(obj, this);
    },
    get proto() {
      return Object.getPrototypeOf(this);
    },
    set proto(val) {
      return Object.setPrototypeOf(this, val);
    }
  });
  return this;
};
Obj = klass(Obj);
Object.defineProperty(module, "exports", {
  get Obj() { return Obj },
  get is() {return is}
});