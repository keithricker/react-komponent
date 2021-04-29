
const priv = require("../Komponent/privateVariablesCompiled");
const clone = (...args) => require("./utilsCompiled").clone(...args);
const merge = (trg, src, ex = [], bind) => {
  let descs = {};
  if (!src) return trg;
  Reflect.ownKeys(src)
    .filter((key) => !ex.includes(key))
    .forEach((key) => {
      let desc = Object.getOwnPropertyDescriptor(src, key);
      if (bind) {
        let originalDesc = { ...desc };
        if (typeof desc.value === "function")
          desc.value = desc.value.bind(bind);
        if (typeof desc.get === "function") {
          desc.get = function () {
            let res;
            try {
              res = originalDesc.call(bind);
            } catch {
              try {
                res = originalDesc.get.call(this);
              } catch {
                res = originalDesc.get.call(src);
              }
            }
            return typeof res === "function" ? res.bind(bind) : res;
          };
        }
      }
      descs[key] = desc;
    });
  Object.defineProperties(trg, descs);
  return trg;
};
const bindIt = function (ob, prop, bind) {
  let desc;
  if (Object(ob) !== ob) return ob;
  if (arguments.length < 3) {
    if (arguments.length === 1) {
      desc = { value: ob };
      ob = undefined;
    } else if (prop && typeof prop !== "string" && typeof prop !== "symbol") {
      bind = prop;
      desc = { value: ob };
      ob = undefined;
      prop === undefined;
    }
  }
  if (prop && ob && !(prop in ob)) return
  desc =
    desc ||
    (function () {
      desc = Object.getOwnPropertyDescriptor(ob, prop);
      if (desc) return desc;
      let trg = Object.setPrototypeOf({}, ob);
      while ((trg = Object.getPrototypeOf(trg))) {
        if (trg.hasOwnProperty(prop))
          desc = Object.getOwnPropertyDescriptor(trg, prop);
      }
      return desc;
    })();
  if (bind) {
    let type = Array("value", "get").find(
      (type) => typeof desc[type] === "function" && prop !== "constructor"
    );
    if (type) desc[type] = desc[type].bind(bind);
  }
  if (desc.value) return desc.value;
  let result = ob ? desc.get.call(ob) : desc.get();
  return bind && typeof result === "function" && prop !== "constructor"
    ? result.bind(bind)
    : result;
};

const _Proxy = (function () {
  class _Proxy {
    constructor(...argus) {
      priv(this).newTarget = true;
      let self = this;
      let [target, handler = undefined] = argus;
      let options =
        arguments.length === 1
          ? target
          : {
              handler,
              target
            };
      if (!options.target) return;
      options.actions = options.actions || [];
      handler = options.handler || {};
      if (!options.handler) {
        Object.defineProperty(options, "handler", {
          get() {
            return handler;
          },
          set(hand) {
            merge(handler, hand);
            merge(self.properties, hander, Reflect.ownKeys(self.properties));
            return !!Object.defineProperty(this, "handler", {
              value: handler,
              configurable: true,
              enumerable: true,
              writable: true
            });
          },
          enumerable: true,
          configurable: true
        });
      }

      let opt = options;
      let newProx = new Proxy(opt.target, this);
      if (opt.clone) {
        opt.target = opt.clone;
        opt.virtualTarget = opt.clone;
        opt.bind = opt.clone;
      }
      let handlerProps = opt.properties || {};
      opt.newTarget = true;
      priv.set(this, opt);
      if (opt.bind === opt.target) delete opt.bind;

      const reflectGet = (ob,prop,bnd) => {
        let desc = Object.getOwnPropertyDescriptor(ob,prop)
        if (!desc) return
        let type = desc.get ? 'get' : desc.value && 'value'
        return (bnd && type === 'get') ? desc.get.call(bnd) : type === 'get' ? desc.get() : desc.value
      }

      let defaultDefaults = merge({}, Reflect);
      let theProperties = {
        get(ob, prop, prox) {
          let original = ob;
          ob = ob !== opt.target ? ob : opt.virtualTarget || opt.target;
          prox = prox !== newProx ? prox : opt.bind || opt.clone || prox;

          let args = [ob, prop, prox];
          let properties =
            typeof opt.properties === "function"
              ? opt.properties(...args)
              : opt.properties;
          let alternate = ob === opt.primary ? opt.alternate : ob;
          let result,
            results = [];
          let getResult =
            opt.handler && opt.handler.get
              ? opt.handler.get(...args)
              : reflectGet(ob, prop, prox);
          if (properties && prop in properties)
            results.push([properties, prop, prox]);
          if (properties && properties.default)
            results.push([properties.default(...args)]);
          results.push([getResult]);
          if (alternate) results.push([alternate, prop, prox]);

          results.some((res) => {
            result = self.getProp(...res);
            if (typeof result !== "undefined") return true;
          });

          result =
            typeof result !== "undefined"
              ? result
              : prop in Object.getPrototypeOf(self)
              ? self[prop]
              : undefined;

          return result;
        },
        get properties() {
          let opt = priv.get(self);
          let result;
          if (
            typeof opt.properties !== "object" &&
            typeof opt.properties !== "function"
          )
            return {};
          return function (ob, prop, bind) {
            ob = ob !== opt.target ? ob : opt.clone || opt.virtualTarget || ob;
            bind = bind !== newProx ? bind : opt.bind || opt.clone;

            if (typeof opt.properties === "object")
              return bindIt(Reflect.get(opt.properties, prop, ob), bind);
            else return bindIt(opt.properties.call(opt, ob, prop, bind), bind);
          };
        },
        set(ob, prop, val) {
          let opt = priv.get(self);
          if (!Reflect.isExtensible(opt.target)) return true;
          let trgDesc = Object.getOwnPropertyDescriptor(opt.target,prop)
          if (trgDesc && trgDesc.configurable === false && trgDesc.writable === false)
              return true;
          if (opt.virtualTarget) ob = opt.virtualTarget;
          let desc = Object.getOwnPropertyDescriptor(self.properties, prop);
          if (desc && desc.set === "function")
            return self.properties[prop] === val;
          return opt.handler.set
            ? !!opt.handler.set(ob, prop, val)
            : !!(Object.defineProperty(ob,prop,{value:val,configurable:true,enumerable:true,writable:true}));
        },
        has(ob, prop) {
          let opt = priv.get(self);
          let vTarget = opt.virtualTarget;
          if (!Reflect.isExtensible(opt.target)) return Reflect.has(opt.target);
          if (vTarget) ob = vTarget;
          else return Reflect.has(ob, prop);
          let desc = Object.getOwnPropertyDescriptor(opt.target, prop);
          if (desc && desc.configurable === false) return true;
          return Reflect.ownKeys(vTarget || ob).includes(prop);
        },
        getPrototypeOf(ob, ...arg) {
          let opt = priv.get(self);
          let vTarget = opt.virtualTarget;
          if (vTarget) ob = vTarget;
          if (!Reflect.isExtensible(opt.target)) ob = opt.target;
          return Reflect.getPrototypeOf(ob, ...arg);
        },
        setPrototypeOf(ob, ...arg) {
          let opt = priv.get(self);
          let vTarget = opt.virtualTarget;
          if (vTarget) ob = vTarget;
          if (!Reflect.isExtensible(opt.target)) ob = opt.target;
          return Reflect.setPrototypeOf(ob, ...arg);
        },
        ownKeys(ob) {
          let opt = priv.get(self);
          if (!Reflect.isExtensible(opt.target))
            return Reflect.ownKeys(opt.target);
          let vTarget = opt.virtualTarget;

          if (vTarget) ob = vTarget;
          let keys = Reflect.ownKeys(ob);
          if (!vTarget) return keys;
          let vKeys = new Set(keys);

          Object.entries(Object.getOwnPropertyDescriptors(opt.target)).forEach(
            ([key, ent]) => {
              if (
                ent.configurable === false ||
                !Reflect.isExtensible(opt.target)
              )
                vKeys.add(key);
            }
          );
          return [...vKeys];
        },
        getOwnPropertyDescriptor(ob, prop) {
          let getDesc = Object.getOwnPropertyDescriptor;
          let opt = priv.get(self);
          if (!Reflect.isExtensible(opt.target))
            return Object.getOwnPropertyDescriptor(opt.target, prop)


          let obDesc = getDesc(ob, prop);
          if (!opt || !opt.virtualTarget) return obDesc;


          let vTarget = opt.virtualTarget;
          if (!vTarget) return obDesc;


          let targDesc = getDesc(opt.target,prop)
          if (
            targDesc &&
            targDesc.configurable === false &&
            targDesc.writable === false
          )
          return targDesc

          let vDesc = getDesc(vTarget, prop);
          if (
            !vDesc &&
            (targDesc && targDesc.configurable === false)
          )
            return targDesc;

          vDesc.configurable = obDesc ? obDesc.configurable : vDesc.configurable;
          return vDesc
        },
        defineProperty(ob, prop, desc) {
          let opt = priv.get(self);
          if (!(prop in opt.target) && !Reflect.isExtensible(opt.target))
            return;
          let obDesc = Object.getOwnPropertyDescriptor(ob, prop);
          desc.configurable =
            obDesc && "configurable" in obDesc ? obDesc.configurable : true;
          ob = priv.get(ob).virtualTarget || ob;
          if (priv.get(ob).actions)
            priv.get(ob).actions.push({
              key: "defineProperty",
              action: function (object = ob) {
                return Object.defineProperty(object, prop, desc);
              },
              method: Object.defineProperty,
              arguments: [...arguments]
            });
          return Object.defineProperty(ob, prop, desc) || undefined;
        },
        deleteProperty(...args) {
          let opt = priv.get(self);
          let vTarget = opt.virtualTarget;
          if (vTarget) ob = vTarget;
          args[0] = ob;
          return Reflect.deleteProperty(...args);
        },
        apply: function(ob, thisArg, argumentsList) {
          let opt = priv.get(self);
          let vTarget = opt.virtualTarget;
          if (typeof vTarget === 'function') ob = vTarget;
          else if (typeof ob !== 'function' && typeof opt.target === 'function') ob = opt.target
          return ob(...argumentsList);
        }
      };
      if (!handler.defaults) {
        Object.defineProperty(handler, "defaults", {
          get() {
            let opt = priv.get(self);
            return new Proxy(defaultDefaults, {
              get(ob, prop) {
                if (prop === "get") return ob[prop];

                let object = opt.virtualTarget || opt.clone;
                let theTarget =
                  typeof theProperties[prop] === "function"
                    ? theProperties[prop]
                    : ob[prop];

                return function (obj, ...arg) {
                  let result,
                    bind = arg[1];
                  obj = obj !== opt.target ? obj : opt.virtualTarget || obj;
                  if (prop === "get" || prop === "set") {
                    if (prop === "set") bind = obj;
                    else bind = opt.bind || obj;
                  }
                  if (opt.actions) {
                    opt.actions.push({
                      prop,
                      action: (object = obj) => theTarget(object, ...arg),
                      arguments: [...arguments],
                      method: prop,
                      function: theTarget
                    });
                  }
                  return theTarget(obj, ...arg);
                };
              }
            });
          },
          set(def) {
            merge(defaultDefaults, def);
            return true;
          },
          enumerable: true,
          configurable: true
        });
      }
      let filtered = Reflect.ownKeys(theProperties).filter(
        (key) =>
          !(
            typeof Reflect[key] === "function" &&
            key !== "get" &&
            typeof opt.handler[key] === "function"
          )
      );
      merge(this.properties, theProperties);
      merge(this, handler, filtered, this);
      reflectTraps(this);
      priv(this).newTarget = false;
      return newProx;
    }

    get ["{{handler}}"]() {
      return this["{{handler}}"] || this;
    }
    get ["{{target}}"]() {
      return priv.get(this).target["{{target}}"] || priv.get(this).target;
    }

    get _get() {
      if (!priv(this).newTarget) return;
      return new Proxy(this, {
        set(ob, prop, val) {
          return ob.define.get(prop, val);
        }
      });
    }
    get properties() {
      if (!priv(this).newTarget) return;
      return this;
    }
    set properties(val) {
      merge(this, val);
      return true;
    }

    define() {
      return Object.defineProperty.bind(null, this);
    }
    defineProps() {
      return Object.defineProperties;
    }
    getProp(...arg) {
      return bindIt(...arg);
    }
    get keys() {
      return Reflect.ownKeys(this);
    }

    static swappable(ob, hand, callback) {
      hand = hand || {};
      hand.actions = [];
      let target = {};
      priv.set(target, { archive: [ob], actions: [] });
      let backup = clone(ob);
      if (!priv.has(ob)) priv.set(ob, { archive: [backup] });
      let archive = priv.get(ob).archive;
      swap(ob);
      let options = {
        target: target,
        get properties() {
          return ob;
        },
        get alternate() {
          return {
            ["{{swap}}"]: swap,
            ["{{rollback}}"]: rollback,
            ["{{archive}}"]: archive,
            ["{{clone}}"]: klone
          };
        },
        get bind() {
          return ob;
        },
        get virtualTarget() {
          return ob;
        }
      };
      options.handler = hand;
      options.actions = hand.actions;
      let originalGet = options.handler.get;
      options.handler.get = function (obj, prop, prox) {
        let og;
        if (originalGet) {
          og = originalGet(obj, prop, prox);

          if (typeof og !== "undefined") {
            options.actions.push({
              key: prop,
              action: (object = obj) => originalGet(object, prop, prox),
              arguments: [...arguments],
              method: "get",
              function: originalGet
            });
            return og;
          }
        }
        let res = Reflect.get(...arguments);
        let result = typeof res === "function" ? res.bind(obj) : res;
        if (!priv.get(obj)) priv.set(obj, { actions: [] });
        priv.get(obj).actions.push({
          key: prop,
          action: (object = obj) => Reflect.get(object, prop, prox),
          arguments: [...arguments],
          method: "get",
          function: Reflect.get
        });
        return result;
      };
      const returnVal = new _Proxy(options);
      function swap(replace, callback) {
        if (ob !== replace) {
          backup = clone(ob);
          priv.set(backup, { original: ob });
          priv.get(target).archive.push(replace);
          if (!priv.has(ob)) priv.set(ob, { archive: [], actions: [] });
          archive = priv.get(ob).archive;
          archive.push(backup);
        }
        ob = replace;
        return callback ? callback(replace, options) : returnVal;
      }
      hand.swap = swap;
      hand.rollback = function () {
        ob = archive.pop();
        backup = archive[archive.length - 1] || clone(ob);
        if (!priv.has(backup)) priv.set(backup, { original: ob });
        if (!archive.length) archive.push(backup);
        return returnVal;
      };
      hand.klone = function (obj) {
        if (obj) {
          options.apply(obj);
          return obj;
        }
        /*
        let subject = archive[archive.length - 2] || backup;
        archive.actions.apply(subject);
        return subject; */
      };
      hand.refresh = function (obj = ob, exclude) {
        Reflect.ownKeys(target)
          .filter((key) => !exclude.includes(key))
          .forEach((key) => {
            delete target[key];
          });
        return merge(target, obj, (key, desc) => setProp(obj, key, desc));
      };
      return returnVal;
    }
  }
  function reflectTraps(handler) {
    Reflect.ownKeys(Reflect).forEach((key) => {
      let oldKey = handler[key];
      Object.defineProperty(handler, key, {
        value: function (ob, ...arg) {
          let pr = priv.get(handler);
          let theTarget = typeof oldKey === "function" ? oldKey : Reflect[key];
          if (pr.clone) ob = clone;
          if (pr.virtualTarget) ob = pr.virtualTarget;
          if (key === "get" || key === "set") {
            let bind = pr.bind || pr.clone;
            arg[2] = bind;
          }
          if (pr.actions) {
            pr.actions.push({
              key,
              action: (object = ob) => theTarget(object, ...arg),
              arguments: [...arguments],
              method: key,
              function: theTarget
            });
          }
          return theTarget(ob, ...arg);
        }
      });
    });
    return handler;
  }
  (function () {
    var _privateLog = console.log;
    console.log = function (item) {
      if (item && item["{{target}}"]) {
        class Proxy {
          constructor(ob) {
            Object.defineProperties(this, Object.getOwnPropertyDescriptors(ob));
            Object.setPrototypeOf(this, Object.getPrototypeOf(ob));
            return this;
          }
        }
        let newTarget = new Proxy(item["{{target}}"]);
        arguments[0] = newTarget;
      }
      _privateLog.apply(console, arguments);
    };
  })();
  return _Proxy;
})();
module.exports = _Proxy;
_Proxy.default = _Proxy
