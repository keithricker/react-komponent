import { merge, clone, bindIt, _typeof, merge,MapFunc } from "./newUtils";

let priv = new MapFunc(new WeakMap())

const _Proxy = (function() {
  class _Proxy {
    constructor(...argus) {
      let [target,handler] = argus
      let options =
        arguments.length === 1
          ? target
          : {
              handler,
              target
            };
      if (!options.target) return;
      options.actions = options.actions || [];
      handler = options.handler = options.handler || {};
      
      let opt = options;
      let newProx = new Proxy(opt.target, this);
      if (opt.clone) {
        opt.target = opt.clone;
        opt.virtualTarget = opt.clone;
        opt.bind = opt.clone;
      }
      let handlerProps = opt.properties || {}
      priv.set(this, opt);
      if (opt.bind === opt.target) delete opt.bind;

      this.properties = {
        get(ob, prop, prox) {
          let original = ob;
          ob = arguments[0] = opt.target;
          prox = opt.bind || prox;
          let args = [ob, prop, prox];
          let properties =
            typeof opt.properties === "function"
              ? opt.properties(...args)
              : opt.properties;
          let alternate = ob === opt.primary ? opt.alternate : ob;
    
          let result,
            results = [];
          let getResult = opt.handler.get
            ? opt.handler.get(...args)
            : Reflect.get(ob, prop, prox);
          if (properties && prop in properties)
            results.push([properties, prop, prox]);
          if (properties && properties.default)
            results.push([properties.default(...args)]);
          results.push([getResult]);
          if (alternate) results.push([alternate, prop, prox]);
    
          results.some((res) => {
            result = this.getProp(...res);
            if (typeof result !== "undefined") return true;
          });
          return typeof result !== "undefined"
            ? result
            : prop in Object.getPrototypeOf(this)
            ? this[prop]
            : undefined;
        },
        get properties() {
          return function(ob,prop,bind) {
            if (typeof opt.properties === "function")
              return opt.properties(...arguments);
            let result = Reflect.get(opt.properties,prop,bind)
            return ((typeof result === 'function') && bind !== newProx) ? result.bind(bind) : result
          }      
        },
        set(ob,prop,val) {
          let desc = Object.getOwnPropertyDescriptor(this.properties,prop)
          if (desc && desc.set === 'function') return this.properties[prop] === val
          return ob[prop] = val
        },
        has(ob, prop) {
          let opt = priv.get(this);
          if (opt.clone) return prop in opt.clone;
          let vTarget = opt.virtualTarget;
          if (!Reflect.isExtensible(ob)) return Reflect.has(ob);
          if (vTarget) ob = vTarget;
          else return Reflect.has(ob, prop);
          let desc = Object.getOwnPropertyDescriptor(ob, prop);
          if (desc && desc.configurable === false) return true;
          return Reflect.has(vTarget, prop);
        },
        ownKeys = function(ob) {
          let opt = priv.get(this);
          if (opt.clone) return Reflect.ownKeys(opt.clone);
          let keys = Reflect.ownKeys(ob);
          let vTarget = opt.virtualTarget;
          if (vTarget) ob = vTarget;
          else return keys;
          let vKeys = new Set(Reflect.ownKeys(vTarget));
          Object.entries(Object.getOwnPropertyDescriptors(ob)).forEach(
            ([key, ent]) => {
              if (ent.confirgurable === false || !Reflect.isExtensible(ob))
                vKeys.add(key);
            }
          );
          return [...keys];
        },
        getOwnPropertyDescriptor = function(ob, prop) {
          let getDesc = Object.getOwnPropertyDescriptor;
          let opt = priv.get(this);
          let obDesc = getDesc(ob, prop);
          if (!opt || !opt.VirtualTarget) return obDesc;
          let vTarget = opt.virtualTarget;
          if (!vTarget) return obDesc;
          let vDesc = getDesc(vTarget, prop);
          if (
            !vDesc &&
            ((obDesc && obDesc.configurable === false) ||
              (obDesc && !Reflect.isExtensible(ob)))
          )
            return obDesc;
          vDesc.configurable = obDesc ? obDesc.configurable : true;
          if (obDesc && obDesc.configurable === false && obDesc.writable === false)
            return obDesc;
          return vDesc;
        },
        defineProperty = function(ob, prop, desc) {
          if (!(prop in ob) && !Reflect.isExtensible(ob)) return;
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
        get ["{{handler}}"]() {
          return this;
        },
        get ["{{target}}"]() {
          return priv.get(this).target;
        },
        get [Symbol.toStringTag]() {
          return "Proxy";
        }
      }    
      merge(this.properties,handler,Reflect.ownKeys(this.properties));
      reflectTraps(this.properties)

      console.log("this,this", this);
      return newProx
    }
    get _get() {
      if (!this.newTarget) return
      return new Proxy(this,{
        set(ob,prop,val) {
          return ob.define.get(prop,val)
        }
      })
    }
    get properties() {
      if (!this.newTarget) return
      return new Proxy(this,{
        set(ob,prop,val) {
          return ob[prop] = val
        }
      })
    }
    
    define() { return Object.defineProperty.bind(null,this) }
    defineProps() { return Object.defineProperties }
    getProp(...arg) {
      return bindIt(...arg);
    }
    get keys() { return Reflect.ownKeys(this)  }
    
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
        console.log("ob", ob);
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
  reflectTraps()
  function reflectTraps(handler) {
    Reflect.ownKeys(Reflect)
      .filter((key) => key !== "getPrototypeOf")
      .forEach((key) => {
        let oldKey = handler[key];
        Object.defineProperty(handler, key, {
          value: function (ob, ...arg) {
            let pr = priv.get(this);
            let target = typeof oldKey === "function" ? oldKey : Reflect[key];
            console.log("pr", pr, "key,", key);
            if (pr.virtualTarget) ob = pr.virtualTarget;
            if (pr.actions) {
              pr.actions.push({
                key,
                action: (object = ob) => target(object, ...arg),
                arguments: [...arguments],
                method: "get",
                function: target
              });
            }
            return target(ob, ...arg);
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
            merge(this, ob);
            Object.setPrototypeOf(this, Object.getPrototypeOf(ob));
            return this;
          }
        }
        let newTarget = new Proxy(item["{{target}}"]);
        arguments[0] = newTarget;
      }
      _privateLog.apply(console, arguments);
    };
  })()
  return _Proxy
})()
export default _Proxy;