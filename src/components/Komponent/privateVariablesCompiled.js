"use strict";

var _require = require("../helpers/utilsCompiled"),
    randomString = _require.randomString;

var privs = new WeakMap();
var handlerMap = new WeakMap();

var privateMap = function privateMap(obj, properties) {
  if (!privs.has(obj)) return privateMap.get.apply(privateMap, arguments);
  if (!arguments.hasOwnProperty(1)) return privateMap.get(obj);
  return privateMap.set.apply(privateMap, arguments);
};

Reflect.ownKeys(WeakMap.prototype).forEach(function (key) {
  privateMap[key] = typeof WeakMap.prototype[key] === "function" ? WeakMap.prototype[key].bind(privs) : WeakMap.prototype[key];
});

privateMap.get = function (obj, properties) {
  var _arguments = arguments;
  var def = {};

  var props = function props() {
    return _arguments.hasOwnProperty(1);
  };

  if (!props() && privs.has(obj)) return privs.get(obj);
  if (!privs.has(obj)) privateMap.set(obj, props() ? properties : def);
  return privs.get(obj);
};

privateMap.set = function (obj, props) {
  if (privs.has(obj)) return privs.set(obj, props);
  var handler = {
    get: function get(ob, prop, prx) {
      if (prop === "randomString") {
        if (handlerMap.get(handler).handedOutString) return;
        handlerMap.get(handler).handedOutString = true;
        var rs = handlerMap.get(handler).randomString;
        return rs;
      }

      if (prop === "{{target}}" || prop === "{{handler}}") return new Proxy({}, {
        get: function get(obj, prp) {
          if (prp === handlerMap.get(handler).randomString) return prop === "{{target}}" ? props : this;
        },
        set: function set() {
          return true;
        }
      });
      return prop === "{{isProxy}}" ? true : typeof props[prop] === "function" ? props[prop].bind(obj) : props[prop];
    },
    set: function set(ob, prop, val) {
      return !!(props[prop] = val);
    }
  };
  handlerMap.set(handler, {
    randomString: randomString()
  });
  return privs.set(obj, new Proxy({}, handler));
};

module.exports = privateMap;
module.exports["default"] = privateMap;