import * as helpers from './helpers'
import _Proxy from '../_Proxy'
import priv from '../../Komponent/privateVariables'
import Mod from '../Module'

let theMod = Mod(module)
const { clone,merge,_typeof,getLevel,ReflectBind } = theMod.import.onDemand('../utils')

let privKeys = new WeakMap()

function suppress(cb, def) {
  try {
    return cb();
  } catch {
    return def;
  }
}
function utilTypes() { return require("util").types; }


let subj = {}
subj.thiss = subj
subj.jello = 'fellow'
Object.defineProperties(subj,{
  hello: { get() {return 'hello'}, set(val) {  this.jello='mellow', Object.defineProperty(this,'hello',{value:val}); return true  },configurable:true},
})
// let object = new (function hello() {})()
let object = {}
object.i = 'have a prop'
let cb = function() { 
  return { 
    [prototype]: { this:'is', so:'fun' },
    thiss:this, 
    getThis() { return this }, 
    hello: "flagrant hello!",
    melloww:'wellow', 
    mister: this.melloww,
    [name]:'fuckingawesome',
    [descriptors]: {
      mister: { configurable:false, writable:false }
    }
  } 
} 
let constr = new helpers.Constructor(cb)
console.log('ConstructorCall',constr.call(object))


const is = (function() {
  function mod(str) {
    str = str.toLowerCase();
    let spl = str.split("is");
    if (spl[1] && spl[0] === "") return spl[1];
    return str
  };
  const is = {}
  let types = [
    "undefined",
    "object",
    "boolean",
    "number",
    "bigint",
    "string",
    "symbol",
    "function",
    "object"
  ];
  let izHandler = {
    get(ob,prop) {
      if (prop === "{{handler}}") return this;

      let propMatch = [...new Set([...Reflect.ownKeys(proto.get(ob)),...Reflect.ownKeys(ob)])].find(key => {
        return mod(prop) === mod(key)
      })
      if (propMatch) return ob[propMatch]
      
      propMatch = types.includes(mod(prop)) && prop
    

      let obType = _typeof(ob).toLowerCase()
      let matchKeys = Reflect.ownKeys(Global).filter(key => !!(this.class(Global[key])))
      propMatch = matchKeys.find(key => mod(key) === mod(prop)) || propMatch
      if (propMatch) return !!(mod(propMatch) === _typeof(ob).toLowerCase()) || typeof ob === mod(propMatch)

      return (prop in ob) ? ob[prop] : Function.prototype[prop]
    }
  }
  merge(is,{
    promise(obj) {
      return utilTypes().isPromise(obj) || typeof obj === "object" && obj instanceof Promise;
    },
    json(data) {
      if (utilTypes().isJSON()) return utilTypes().isJSON(data)
      if (typeof data !== "string") return false;
      data = data.trim();
      let match = data.match(/\{[^{}]+\}/) || [];
      return match[0] === data;
    },
    url(url) {
      if (utilTypes().isURL()) return utilTypes().isURL(url)
      if (typeof url !== "string") return false;
      if (!isURL.pattern)
        isURL.pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
      return isURL.pattern.test(url) ? true : false;
    },
    defined(arg) {
      return typeof arg !== "undefined";
    },
    empty(ob) {
      if (utilTypes().isEmpty()) return utilTypes().isEmpty(ob)
      if (ob[Symbol.iterator]) return !([...ob].length)
      if (this.object(ob) || typeof ob === 'function') return !(Reflect.ownKeys(ob).length)
      return !(Object(ob).length)
    },
    class(func) {
      if (utilTypes().isClass()) return utilTypes().isClass(ob)
      let classText = (str) => str.trim().split(" ")[0] === "class";
      let funcString = func.toString().toLowerCase();
      if (classText(funcString)) return true;
      let call = suppress(() => func());
      return call && call.message && classText(call.message.toLowerCase())
        ? true
        : false;
    },
    object(ob) {
      return typeof ob === 'object' && !this.arrayLikeObject(ob) && Object(ob) === ob;
    },
    array(ob) { return Array.isArray(ob) },
    arrayLikeObject(obj) {
      if (!obj[Symbol.iterator]) return false
      let argSpread = [...obj];
      let arg = [...argSpread.entries()];
      return arg.every((ent, ind) => obj.hasOwnProperty(ind) && ent[1] === obj[ind])
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
    equivalent(ob1,ob2) {
      ob1 = arguments.length === 1 ? this : ob1
      ob2 = ob2 || ob1
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
      if (!this.validDescriptor(desc)) return false;
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
    },
    bind(...bind) {
      let boundIs = {}
      Reflect.ownKeys(is).filter(key => typeof is[key] === 'function').forEach(key => {
        boundIs[key] = is[key].bind(null,...bind)
      })
      return new Proxy(boundIs,izHandler)
    },
    proxy(prox) {
      let isProx = false
      try { Map.prototype.get(prox,'property') } catch {}
    }
  })
  Object.setPrototypeOf(is,utilTypes())
  
  iz = new Proxy(is,izHandler)

  function isFunc(ob) {
    return iz.bind(ob)
  }
  Object.setPrototypeOf(isFunc,iz)
  return isFunc

})()


const proto = { get: Object.getPrototypeOf, set: Object.setProrotypeOf };
const _if = (exp, then) => {
  exp = exp();
  if (typeof then === "function") return then(exp);
  return exp || then;
};

let Obj = function (obj) {
  obj = Object(obj);
  if (priv(obj).Obj) return priv(obj).Obj
  
  const iz = is;
  
  let Obj = function() {
    return {


      get priv() {
        let thisPriv
        if (!privKeys.has(this)) privKeys.set(this,{key:undefined})
        if (!priv.has(this)) {
          console.log('they dont have me!')
          thisPriv = priv(this)
          let rando = thisPriv.randomString
          privKeys.get(this).key = rando
        }
        return priv(this)
      },
      set priv(val) {
        let thisPriv = Object.getOwnPropertyDescriptor(this,'priv').get.call(this)
        let randoString = privKeys.get(this).key
        let props = thisPriv['{{target}}'][randoString]
        if (props && val) mergeProps(props,val)
        return true          
      },


      get extends() {
        return Object.getPrototypeOf(this.constructor) === 'Function' ? Object : Object.getPrototypeOf(this.constructor)
      },
      ownProp(prop) {
        return Reflect.ownKeys(this).includes(prop)
      },
      has(prop) {
        return Reflect.has(this,prop);
      },
      get keys() {
        return Reflect.ownKeys(this);
      },
      get type() {
        return Array.isArray(this) ? "array" : typeof this;
      },
      get _type() {
        let tp = _type.bind(null,this) 
        tp.class = _type.class.bind(null,this)
        return tp
      },
      getLevel(...arg) {
        return getLevel(this,...arg)
      },
      tree() {
        let levels = {};
        this.getLevel.call(this, (lvl) => {
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
      descriptor(...arg) {
        return helpers.getDescriptor(this,...arg)
      },
      descriptors(...arg) {
        return helpers.getDescriptors(this,...arg)
      },
      get entries() {
        return helpers.entries.bind(null,this)
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
          return self.length;
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
        if (this[Symbol.iterator] && this.clear) {
          this.clear(); return this
        }
        Reflect.ownKeys(this).forEach((key) => {
          try {
            delete this[key];
          } catch (err) {
            console.error(err);
          }
        });
      },
      forEach(cb) {
        if ('forEach' in Object.getPrototypeOf(this)) return Object.getPrototypeOf(this).forEach(...arguments)
        let self = this
        Reflect.ownKeys(this).forEach((key, ind) =>
          cb.call(self,key, self[key], ind, self)
        );
      },
      filter(filtered,cb) {
        if ('filter' in proto.get(this)) return proto.get(this).filter(...arguments)
        cb = cb || filtered
        filtered = arguments[1] ? filtered : clone(this,true,Reflect.ownKeys(this));
        Reflect.ownKeys(this).forEach(
          function (key, ind) {
            let res = cb.call(filtered,key, this[key], ind, filtered);
            if (res === true) filtered[key] = res;
          }.bind(this)
        );
        return filtered;
      },
      map(mapped, cb) {
        cb = cb || mapped;
        let self = this;
        if (proto.get(this).hasOwnProperty("map"))
          return proto.get(this).map.bind(this);
        mapped = arguments[1] ? mapped : clone(this,true,Reflect.ownKeys(this));

        Reflect.ownKeys(this).forEach((key, ind) => {
          let res = cb.call(mapped,key, self[key], ind, mapped);
          let desc = iz.descriptor(res)
            ? res
            : {
                value: res,
                enumerable:true,
                configurable: true,
              };
          helpers.defineProp(mapped,key,desc);
        });
        return mapped;
      },
      asMap() {
        return utils.ObjectMap(this)
      },
      defineProp(...arg) {
        return helpers.defineProp(this,...arg)
      },
      defineProps(...arg) {
        return helpers.defineProps(this,...arg)
      },
      reverseLookup(val) {
        let key;
        let lvl = this.getLevel(this, (lv) => {
          if (
            val.name &&
            Reflect.hasOwnProperty(lvl,val.name) &&
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
        return helpers.mixin(this, mix);
      },
      bind(target) {
        return helpers.boundObject(this,...arguments)
      },
      boundProperty(prop,bind) {
        return ReflectBind.get(this,prop,bind)
      },
      boundDescriptor(desc) {
        return helpers.boundDescriptor(desc,this)
      },
      mirror(trg, bnd) {
        let bind = (target = trg) => bnd || (target !== bnd && trg);
        trg = trg || clone(this,true,Reflect.ownKeys(this));
        return merge(trg, this, (key, desc) => {
          delete desc.value; delete desc.writable
          desc.get = function () {
            return ReflectBind.get(this, key, bind);
          };
          return desc;
        });
      },
      get backup() {
        let bu = helpers.backup.bind(null,this)
        bu.restore = helpers.resore.bind(null,bu)
      },
      clone(...arg) {
        return utils.clone(this,...arg)
      },
      merge(...arg) {
        return utils.merge(this,...arg)
      },
      get is() {
        if (priv(this).is) return priv(this).is
        priv(this).is = iz(this)
        return priv(this).iz
      },
      equivalent(obj) {
        return iz.equivalent(obj,this);
      },
      get proto() {
        return Object.getPrototypeOf(this);
      },
      set proto(val) {
        return Object.setPrototypeOf(this, val);
      }
    }
  
  }

  priv(obj).Obj = helpers.boundObject(obj,Obj)
  return priv(obj).Obj

};

let thingobj = Obj({i:'have props'})
console.log('thepriv',thingobj.priv)
thingobj.priv.hello = 'jello'
console.log('thingobjprivhello',thingobj.priv.hello)
console.log(Reflect.ownKeys(thingobj.priv))

merge(module.exports,{
  get Obj() { return Obj },
  get is() {return is},
  get Descriptors() {
    return require('./helpers').Descriptors
  }
})

console.log('helo',module.exports)
