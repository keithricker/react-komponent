
const proxInstances = new WeakMap();
const  Standin = (function () {
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
  let ownProp
  const hasProp = (src,prop) => {
     if (src.hasOwnProperty(prop)) ownProp = true
     return ownProp || (proto.get(src).hasOwnProperty(prop) && proto.get(src).constructor !== Object)
  }
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
    static: {
       merge(trg,src,bind) {
          return new Proxy(trg,{
             get(ob,prop) {
                if (hasProp(src) && (ownProp || (!hasProp(trg)))) return ReflectBind(src,prop,trg)
                if (hasProp(trg) && (ownProp || (!hasProp(src)))) return ReflectBind(trg,prop)
                return (prop in src) ? ReflectBind(src,prop,trg) : ReflectBind(trg,prop)
             }
          }) 
       },
       handlers: {
          default(trg) {
             let handler = {}; 
             Reflect.ownKeys(Reflect).forEach(key => { 
                if (typeof Reflect[key] === 'function') handler[key] = function(oo,...prop) { 
                  return Reflect[key](trg,...prop) 
                }
             })
             return handler
          }
       }
    },
    get(obj, prop) {
      if (prop === Symbol.hasInstance) {
        return (instance) => {
          return proxInstances.has(instance);
        };
      }
      if ((prop in this.static)) return this.static[prop]
      return Reflect.get(...arguments);
    }
  }
  );
})();
module.exports = Standin