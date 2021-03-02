let Global;
try {
  Global = Global || window;
} catch {
  Global = Global || global;
}
export { Global };
export function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
export const proto = { get: Object.getPrototypeOf, set: Object.setPrototypeOf };
export function tryCatch(exp, cb) {
  let res;
  let err;
  try {
    res = exp();
  } catch (error) {
    err = error;
  } finally {
    return cb ? cb(res, err) : err || res;
  }
}
export function suppress(exp, deflt) {
  let res = tryCatch(exp);
  return res instanceof Error ? deflt : res;
}
export function bindIt(obj, key, bnd) {
  let res, args;
  if (arguments.length < 3) {
    if (!key) return obj;
    if (typeof key === "string" || typeof key === "symbol") return obj[key];
    bnd = key;
    res = obj;
  }
  args = [obj, key, bnd].filter(Boolean);
  res = res || Reflect.get(...args);
  return typeof res === "function" ? res.bind(bnd) : res;
}
function isClass(func) {
  let classText = (str) => str.split(" ")[0] === "class";
  let funcString = func.toString().toLowerCase();
  if (classText(funcString)) return true;
  let call = tryCatch(() => func());
  return call.message && classText(call.message.toLowerCase()) ? true : false;
}
function isDescriptor(desc) {
   if (!isValidDescriptor(desc))
     return false
   return suppress(() => {
      let def = Object.defineProperty({},'prop',desc)
      let de = Object.getOwnPropertyDescriptor(def,'prop')
      return Reflect.ownKeys(de).every(key => de[key] === def[key] 
         && JSON.stringify(Reflect.ownKeys(Object.getOwnPropertyDescriptor(def,key))) === JSON.stringify(Reflect.ownKeys(Object.getOwnPropertyDescriptor(de,key))) 
         && JSON.stringify(Reflect.ownKeys(def)) === JSON.stringify(Reflect.ownKeys(de)))
   },false)
}
function isValidDescriptor(desc) {
   if (typeof desc !== 'object') return false
   return suppress(() => {
     let isDescriptor = true
     let defined = Object.defineProperty({},'prop',desc)
     let described = Object.getOwnPropertyDescriptor(defined,'prop')
     if (desc.value) return !!(descriptor.value === defined.prop)
     if (desc.get) isDescriptor = descriptor.get === described.get
     if (desc.set) isDescriptor = descriptor.set === described.set
     return isDescriptor
   },false)
}
export function merge(target, src, exclude, binder) {
  let args = [...arguments];
  let callback = typeof args[2] === "function" ? args[2] : undefined;
  if (!src) return target;
  let bindIt = (obj, key, bnd) => {
    if (!bnd) return obj[key];
    let res = Reflect.get(obj, key, bnd);
    return typeof res === "function" ? res.bind(bnd) : res;
  };
  if (!Array.isArray(exclude)) exclude = [];

  if (!callback && Array.isArray(target) && Array.isArray(src))
    return (
      target.splice(
        target.length,
        0,
        ...src.filter((item) => !exclude.includes(item))
      ) && target
    );
  Reflect.ownKeys(src)
    .filter((key) => !exclude.includes(key))
    .forEach((key) => {
      let desc = Object.getOwnPropertyDescriptor(src, key);
      let type = desc.get ? "get" : "value";
      if (binder) {
        desc[type] =
          key === "constructor" ? desc[type] : bindIt(desc, type, binder);
        if (desc.set) desc.set = desc.set.bind(binder);
      }
      let throwThis;
      try {
        if (typeof callback === "function") {
          let cbResult = callback(key, desc);
          desc = cbResult === true ? desc : cbResult;

          if (cbResult instanceof Error || typeof cbResult === "string") {
            throwThis = cbResult;
            desc = undefined;
          }
        }
        if (typeof desc === "object" && !Array.isArray(desc)) {
          desc.configurable = true;
          if (desc.get || desc.set) {
            delete desc.value;
            delete desc.writable;
          }
          let trgDesc = Object.getOwnPropertyDescriptor(target, key);
          if (trgDesc && trgDesc.configurable === false) target[key] = src[key];
          else Object.defineProperty(target, key, desc);
        }
      } catch (err) {
        if (err) console.error(err);
        if (throwThis) throw throwThis;
      }
    });

  return target;
}

export function clone(obj, withProto = false, exclude = [], binder) {
  let cb = typeof exclude === "function" ? exclude : undefined;
  let constructorName = capitalize(_typeof(obj));
  let typeConstructor = Global[constructorName];
  let target; let arg
  if (Symbol.iterator in obj.constructor.prototype) {
    if (Array.isArray(obj)) target = [...obj].filter(item => !exclude.includes(item));
    else if (obj instanceof String) {
       if (Object(obj) !== obj) return obj
       target = Object.setPrototypeOf(new String(Object(obj).toString()),Object.getPrototypeOf(obj))
    }
    else {
       let argSpread = [...obj]
       arg = [...argSpread.entries()].map((ent,ind) => {
          // if it's a numeric key
          if (obj.hasOwnProperty(ind) && ent[1] === obj[ind] && exclude.includes(ent[1]))
            return false
          // if it's something else - i.e. a map
          if (exclude.includes(ent[0])) return false
          return argSpread[ind]
       }).filter(Boolean)
       let consTarget = suppress(new obj.constructor(arg), false);
       if (
         consTarget &&
         JSON.stringify([...consTarget]) === JSON.stringify(arg)
       )
         target = consTarget;
      else {
        let typeTarget = new typeConstructor(arg);
        if (
          typeTarget &&
          JSON.stringify([...typeTarget]) === JSON.stringify(arg)
        )
        target = typeTarget;
      }
    }
  }
  target =
    target || suppress(() => new obj.constructor(), new typeConstructor());

  if (withProto) proto.set(target, proto.get(obj))

  let descs = Object.getOwnPropertyDescriptors(obj);
  if (withProto) proto.set(descs, proto.get(obj))

  if (typeof exclude !== "function") {
    if (exclude.length)
      Reflect.ownKeys(obj).forEach((key) => {
        if (exclude.includes(key)) delete descs[key];
      });
    return Object.defineProperties(target, descs);
  }

  Object.entries(descs).forEach(([key,desc]) => {
    if (cb) descs[key] = cb(desc)
    if (binder) descs[key] = boundDescriptor(desc,binder);
  });

  return target;
}

export const _typeof = (ob, type) => {
  let returnVal = {}.toString
    .call(ob)
    .split("[object ")
    .join("")
    .split("]")[0]
    .toLowerCase();

  let ret = !!(type === returnVal);
  let split = type ? type.split(" ") : [];

  split.forEach((key, ind) => {
    if (key === "and" || key === "or") return;
    if (split[ind + 1] === "or")
      ret = !!(returnVal === key || returnVal === ind + 2);
    if (split[ind + 1] === "and")
      ret = !!(returnVal === key && returnVal === ind + 2);
  });
  return typeof type === "string" ? ret : returnVal;
};

export function keyMatch(prop) {
  let match = /^{{([^ ]*)}}$/.exec(prop);
  if (!match && prop.split("_")[0] === "") match = ["", prop.slice(1)];
  return match ? match[1] : prop;
}

keyMatch.match = function (ob, prop, method = Reflect.has) {
  return (
    (suppress(() => method(ob, prop), false) && prop) ||
    (suppress(() => method(ob, keyMatch(prop)), false) && keyMatch(prop)) ||
    (suppress(() => method(ob, `{{${keyMatch(prop)}}}`), false) &&
      `{{${keyMatch(prop)}}}`) ||
    prop
  );
};
keyMatch.has = function () {
  return !!keyMatch.match(...arguments);
};
keyMatch.hasOwn = function (ob, prop) {
  return keyMatch.has(ob, prop, Object.hasOwnProperty);
};
keyMatch.get = function (...arg) {
  let [tmp, prop, bnd] = arg;
  let match = keyMatch(prop);
  if (!match)
    return prop in tmp
      ? Reflect.get(...arg.filter(Boolean))
      : Reflect.get(...[tmp, `{{${prop}}}`, bnd].filter(Boolean));
  match = match[1];
  return prop in tmp
    ? Reflect.get(...arg.filter(Boolean))
    : Reflect.get(...[tmp, match, bnd].filter(Boolean));
};
keyMatch.set = function (ob, prop, val) {
  let match = keyMatch.match(ob, prop, Object.hasOwnProperty);
  return Reflect.set(ob, match, val);
};

export function getLevel(obj, cb) {
  let level = obj;
  let success = false;
  if (typeof level === "undefined") return;
  const loop = () => {
    level = proto.set({}, level);
    while ((level = proto.get(level))) {
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
}

export function getLevels(ob) {
  let levels = new Set();
  getLevel(ob, (lvl) => {
    if (!lvl) return true;
    levels.add(lvl.constructor);
  });
  let lvls = Array.from(levels);
  lvls.strings = () => lvls.map((lvl) => lvl.constructor.name);
}

export function getDescriptor(obj, prop) {
  let level = getLevel(obj, (lvl) => lvl && lvl.hasOwnProperty(prop));
  return level ? Object.getOwnPropertyDescriptor(level, prop) : undefined;
}

export const ReflectBind = (function() {
   let ReflectBind = function(...bind) {
      let RB = {
         descriptor(object,property,...bindTarget) {
            let {object:ob=object,property:prop=property,descriptor:desc,callback,includeSet=false,override,bind=bindTarget} = arguments.length === 1 && object
            if (arguments.length > 1 && typeof property === 'object') {
               let isDesc = isDescriptor(property)
               if (isDesc instanceof Error) {
                  throw isDesc
               }
               desc = ob
            }
            else desc = Reflect.getOwnPropertyDescriptor(ob,prop)
            if (!bind) return callback ? callback(desc) : Object.assign(desc,override)
            Reflect.ownKeys(desc).filter(key => key === set ? includeSet : true).forEach(key => {
               if (typeof desc[key] === 'function')
                 desc[key] = desc[key].bind(...bind)
            })
            desc = override ? Object.assign(desc,override) : desc
            return desc
         },
         ownDescriptor(object,property,bind) {
            if (!object.hasOwnProperty(property)) return
            return this.descriptor({object,property,bind,exclude:['set']})
         },
         get(ob, prop, ...arg) {
            let bind = arg[0];
            if (!bind) return ob[prop];
            arg = arg.length > 1 ? arg : [bind];
            let desc = getDescriptor(ob, prop, bind);
            if (!desc.get && typeof desc.value !== "function") return ob[prop];
            const bindIt = (func, ...ar) => func.bind(...ar);
            return desc.get ? bindIt(desc.get, ...arg)() : bindIt(desc.value, ...arg);
         }
      }
      if (!bind.length) return br
      Reflect.ownKeys(br).forEach(key => {
         let property = br[key]
         br[key] = function(...args) {
            args.splice(2,0,...bind)
            return property.call(...args)
         }
      })
      return RB
   }
   return ReflectBind
})()


export function boundReflect(obj) {
   return boundProperties(Reflect,obj)
}
