"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var priv = require("../Komponent/privateVariablesCompiled");

var clone = function clone() {
  var _require;

  return (_require = require("./utilsCompiled")).clone.apply(_require, arguments);
};

var merge = function merge(trg, src) {
  var ex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var bind = arguments.length > 3 ? arguments[3] : undefined;
  var descs = {};
  if (!src) return trg;
  Reflect.ownKeys(src).filter(function (key) {
    return !ex.includes(key);
  }).forEach(function (key) {
    var desc = Object.getOwnPropertyDescriptor(src, key);

    if (bind) {
      var originalDesc = _objectSpread({}, desc);

      if (typeof desc.value === "function") desc.value = desc.value.bind(bind);

      if (typeof desc.get === "function") {
        desc.get = function () {
          var res;

          try {
            res = originalDesc.call(bind);
          } catch (_unused) {
            try {
              res = originalDesc.get.call(this);
            } catch (_unused2) {
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

var bindIt = function bindIt(ob, prop, bind) {
  var desc;
  if (Object(ob) !== ob) return ob;

  if (arguments.length < 3) {
    if (arguments.length === 1) {
      desc = {
        value: ob
      };
      ob = undefined;
    } else if (prop && typeof prop !== "string" && (0, _typeof2["default"])(prop) !== "symbol") {
      bind = prop;
      desc = {
        value: ob
      };
      ob = undefined;
      prop === undefined;
    }
  }

  if (prop && ob && !(prop in ob)) return;

  desc = desc || function () {
    desc = Object.getOwnPropertyDescriptor(ob, prop);
    if (desc) return desc;
    var trg = Object.setPrototypeOf({}, ob);

    while (trg = Object.getPrototypeOf(trg)) {
      if (trg.hasOwnProperty(prop)) desc = Object.getOwnPropertyDescriptor(trg, prop);
    }

    return desc;
  }();

  if (bind) {
    var type = Array("value", "get").find(function (type) {
      return typeof desc[type] === "function" && prop !== "constructor";
    });
    if (type) desc[type] = desc[type].bind(bind);
  }

  if (desc.value) return desc.value;
  var result = ob ? desc.get.call(ob) : desc.get();
  return bind && typeof result === "function" && prop !== "constructor" ? result.bind(bind) : result;
};

var _Proxy = function () {
  var _Proxy = /*#__PURE__*/function () {
    function _Proxy() {
      for (var _len = arguments.length, argus = new Array(_len), _key = 0; _key < _len; _key++) {
        argus[_key] = arguments[_key];
      }

      (0, _classCallCheck2["default"])(this, _Proxy);
      priv(this).newTarget = true;
      var self = this;
      var target = argus[0],
          _argus$ = argus[1],
          handler = _argus$ === void 0 ? undefined : _argus$;
      var options = arguments.length === 1 ? target : {
        handler: handler,
        target: target
      };
      if (!options.target) return;
      options.actions = options.actions || [];
      handler = options.handler || {};

      if (!options.handler) {
        Object.defineProperty(options, "handler", {
          get: function get() {
            return handler;
          },
          set: function set(hand) {
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

      var opt = options;
      var newProx = new Proxy(opt.target, this);

      if (opt.clone) {
        opt.target = opt.clone;
        opt.virtualTarget = opt.clone;
        opt.bind = opt.clone;
      }

      var handlerProps = opt.properties || {};
      opt.newTarget = true;
      priv.set(this, opt);
      if (opt.bind === opt.target) delete opt.bind;

      var reflectGet = function reflectGet(ob, prop, bnd) {
        var desc = Object.getOwnPropertyDescriptor(ob, prop);
        if (!desc) return;
        var type = desc.get ? 'get' : desc.value && 'value';
        return bnd && type === 'get' ? desc.get.call(bnd) : type === 'get' ? desc.get() : desc.value;
      };

      var defaultDefaults = merge({}, Reflect);
      var theProperties = {
        get: function get(ob, prop, prox) {
          var _opt$handler;

          var original = ob;
          ob = ob !== opt.target ? ob : opt.virtualTarget || opt.target;
          prox = prox !== newProx ? prox : opt.bind || opt.clone || prox;
          var args = [ob, prop, prox];
          var properties = typeof opt.properties === "function" ? opt.properties.apply(opt, args) : opt.properties;
          var alternate = ob === opt.primary ? opt.alternate : ob;
          var result,
              results = [];
          var getResult = opt.handler && opt.handler.get ? (_opt$handler = opt.handler).get.apply(_opt$handler, args) : reflectGet(ob, prop, prox);
          if (properties && prop in properties) results.push([properties, prop, prox]);
          if (properties && properties["default"]) results.push([properties["default"].apply(properties, args)]);
          results.push([getResult]);
          if (alternate) results.push([alternate, prop, prox]);
          results.some(function (res) {
            result = self.getProp.apply(self, (0, _toConsumableArray2["default"])(res));
            if (typeof result !== "undefined") return true;
          });
          result = typeof result !== "undefined" ? result : prop in Object.getPrototypeOf(self) ? self[prop] : undefined;
          return result;
        },

        get properties() {
          var opt = priv.get(self);
          var result;
          if ((0, _typeof2["default"])(opt.properties) !== "object" && typeof opt.properties !== "function") return {};
          return function (ob, prop, bind) {
            ob = ob !== opt.target ? ob : opt.clone || opt.virtualTarget || ob;
            bind = bind !== newProx ? bind : opt.bind || opt.clone;
            if ((0, _typeof2["default"])(opt.properties) === "object") return bindIt(Reflect.get(opt.properties, prop, ob), bind);else return bindIt(opt.properties.call(opt, ob, prop, bind), bind);
          };
        },

        set: function set(ob, prop, val) {
          var opt = priv.get(self);
          if (!Reflect.isExtensible(opt.target)) return true;
          var trgDesc = Object.getOwnPropertyDescriptor(opt.target, prop);
          if (trgDesc && trgDesc.configurable === false && trgDesc.writable === false) return true;
          if (opt.virtualTarget) ob = opt.virtualTarget;
          var desc = Object.getOwnPropertyDescriptor(self.properties, prop);
          if (desc && desc.set === "function") return self.properties[prop] === val;
          return opt.handler.set ? !!opt.handler.set(ob, prop, val) : !!Object.defineProperty(ob, prop, {
            value: val,
            configurable: true,
            enumerable: true,
            writable: true
          });
        },
        has: function has(ob, prop) {
          var opt = priv.get(self);
          var vTarget = opt.virtualTarget;
          if (!Reflect.isExtensible(opt.target)) return Reflect.has(opt.target);
          if (vTarget) ob = vTarget;else return Reflect.has(ob, prop);
          var desc = Object.getOwnPropertyDescriptor(opt.target, prop);
          if (desc && desc.configurable === false) return true;
          return Reflect.ownKeys(vTarget || ob).includes(prop);
        },
        getPrototypeOf: function getPrototypeOf(ob) {
          var opt = priv.get(self);
          var vTarget = opt.virtualTarget;
          if (vTarget) ob = vTarget;
          if (!Reflect.isExtensible(opt.target)) ob = opt.target;

          for (var _len2 = arguments.length, arg = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            arg[_key2 - 1] = arguments[_key2];
          }

          return Reflect.getPrototypeOf.apply(Reflect, [ob].concat(arg));
        },
        setPrototypeOf: function setPrototypeOf(ob) {
          var opt = priv.get(self);
          var vTarget = opt.virtualTarget;
          if (vTarget) ob = vTarget;
          if (!Reflect.isExtensible(opt.target)) ob = opt.target;

          for (var _len3 = arguments.length, arg = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
            arg[_key3 - 1] = arguments[_key3];
          }

          return Reflect.setPrototypeOf.apply(Reflect, [ob].concat(arg));
        },
        ownKeys: function ownKeys(ob) {
          var opt = priv.get(self);
          if (!Reflect.isExtensible(opt.target)) return Reflect.ownKeys(opt.target);
          var vTarget = opt.virtualTarget;
          if (vTarget) ob = vTarget;
          var keys = Reflect.ownKeys(ob);
          if (!vTarget) return keys;
          var vKeys = new Set(keys);
          Object.entries(Object.getOwnPropertyDescriptors(opt.target)).forEach(function (_ref) {
            var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
                key = _ref2[0],
                ent = _ref2[1];

            if (ent.configurable === false || !Reflect.isExtensible(opt.target)) vKeys.add(key);
          });
          return (0, _toConsumableArray2["default"])(vKeys);
        },
        getOwnPropertyDescriptor: function getOwnPropertyDescriptor(ob, prop) {
          var getDesc = Object.getOwnPropertyDescriptor;
          var opt = priv.get(self);
          if (!Reflect.isExtensible(opt.target)) return Object.getOwnPropertyDescriptor(opt.target, prop);
          var obDesc = getDesc(ob, prop);
          if (!opt || !opt.virtualTarget) return obDesc;
          var vTarget = opt.virtualTarget;
          if (!vTarget) return obDesc;
          var targDesc = getDesc(opt.target, prop);
          if (targDesc && targDesc.configurable === false && targDesc.writable === false) return targDesc;
          var vDesc = getDesc(vTarget, prop);
          if (!vDesc && targDesc && targDesc.configurable === false) return targDesc;
          vDesc.configurable = obDesc ? obDesc.configurable : vDesc.configurable;
          return vDesc;
        },
        defineProperty: function defineProperty(ob, prop, desc) {
          var opt = priv.get(self);
          if (!(prop in opt.target) && !Reflect.isExtensible(opt.target)) return;
          var obDesc = Object.getOwnPropertyDescriptor(ob, prop);
          desc.configurable = obDesc && "configurable" in obDesc ? obDesc.configurable : true;
          ob = priv.get(ob).virtualTarget || ob;
          if (priv.get(ob).actions) priv.get(ob).actions.push({
            key: "defineProperty",
            action: function action() {
              var object = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ob;
              return Object.defineProperty(object, prop, desc);
            },
            method: Object.defineProperty,
            arguments: Array.prototype.slice.call(arguments)
          });
          return Object.defineProperty(ob, prop, desc) || undefined;
        },
        deleteProperty: function deleteProperty() {
          var opt = priv.get(self);
          var vTarget = opt.virtualTarget;
          if (vTarget) ob = vTarget;

          for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            args[_key4] = arguments[_key4];
          }

          args[0] = ob;
          return Reflect.deleteProperty.apply(Reflect, args);
        },
        apply: function apply(ob, thisArg, argumentsList) {
          var opt = priv.get(self);
          var vTarget = opt.virtualTarget;
          if (typeof vTarget === 'function') ob = vTarget;else if (typeof ob !== 'function' && typeof opt.target === 'function') ob = opt.target;
          return ob.apply(void 0, (0, _toConsumableArray2["default"])(argumentsList));
        }
      };

      if (!handler.defaults) {
        Object.defineProperty(handler, "defaults", {
          get: function get() {
            var opt = priv.get(self);
            return new Proxy(defaultDefaults, {
              get: function get(ob, prop) {
                if (prop === "get") return ob[prop];
                var object = opt.virtualTarget || opt.clone;
                var theTarget = typeof theProperties[prop] === "function" ? theProperties[prop] : ob[prop];
                return function (obj) {
                  for (var _len5 = arguments.length, arg = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
                    arg[_key5 - 1] = arguments[_key5];
                  }

                  var result,
                      bind = arg[1];
                  obj = obj !== opt.target ? obj : opt.virtualTarget || obj;

                  if (prop === "get" || prop === "set") {
                    if (prop === "set") bind = obj;else bind = opt.bind || obj;
                  }

                  if (opt.actions) {
                    opt.actions.push({
                      prop: prop,
                      action: function action() {
                        var object = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : obj;
                        return theTarget.apply(void 0, [object].concat(arg));
                      },
                      arguments: Array.prototype.slice.call(arguments),
                      method: prop,
                      "function": theTarget
                    });
                  }

                  return theTarget.apply(void 0, [obj].concat(arg));
                };
              }
            });
          },
          set: function set(def) {
            merge(defaultDefaults, def);
            return true;
          },
          enumerable: true,
          configurable: true
        });
      }

      var filtered = Reflect.ownKeys(theProperties).filter(function (key) {
        return !(typeof Reflect[key] === "function" && key !== "get" && typeof opt.handler[key] === "function");
      });
      merge(this.properties, theProperties);
      merge(this, handler, filtered, this);
      reflectTraps(this);
      priv(this).newTarget = false;
      return newProx;
    }

    (0, _createClass2["default"])(_Proxy, [{
      key: "{{handler}}",
      get: function get() {
        return this["{{handler}}"] || this;
      }
    }, {
      key: "{{target}}",
      get: function get() {
        return priv.get(this).target["{{target}}"] || priv.get(this).target;
      }
    }, {
      key: "_get",
      get: function get() {
        if (!priv(this).newTarget) return;
        return new Proxy(this, {
          set: function set(ob, prop, val) {
            return ob.define.get(prop, val);
          }
        });
      }
    }, {
      key: "properties",
      get: function get() {
        if (!priv(this).newTarget) return;
        return this;
      },
      set: function set(val) {
        merge(this, val);
        return true;
      }
    }, {
      key: "define",
      value: function define() {
        return Object.defineProperty.bind(null, this);
      }
    }, {
      key: "defineProps",
      value: function defineProps() {
        return Object.defineProperties;
      }
    }, {
      key: "getProp",
      value: function getProp() {
        return bindIt.apply(void 0, arguments);
      }
    }, {
      key: "keys",
      get: function get() {
        return Reflect.ownKeys(this);
      }
    }], [{
      key: "swappable",
      value: function swappable(ob, hand, callback) {
        hand = hand || {};
        hand.actions = [];
        var target = {};
        priv.set(target, {
          archive: [ob],
          actions: []
        });
        var backup = clone(ob);
        if (!priv.has(ob)) priv.set(ob, {
          archive: [backup]
        });
        var archive = priv.get(ob).archive;
        swap(ob);
        var options = {
          target: target,

          get properties() {
            return ob;
          },

          get alternate() {
            var _ref3;

            return _ref3 = {}, (0, _defineProperty2["default"])(_ref3, "{{swap}}", swap), (0, _defineProperty2["default"])(_ref3, "{{rollback}}", rollback), (0, _defineProperty2["default"])(_ref3, "{{archive}}", archive), (0, _defineProperty2["default"])(_ref3, "{{clone}}", klone), _ref3;
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
        var originalGet = options.handler.get;

        options.handler.get = function (obj, prop, prox) {
          var og;

          if (originalGet) {
            og = originalGet(obj, prop, prox);

            if (typeof og !== "undefined") {
              options.actions.push({
                key: prop,
                action: function action() {
                  var object = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : obj;
                  return originalGet(object, prop, prox);
                },
                arguments: Array.prototype.slice.call(arguments),
                method: "get",
                "function": originalGet
              });
              return og;
            }
          }

          var res = Reflect.get.apply(Reflect, arguments);
          var result = typeof res === "function" ? res.bind(obj) : res;
          if (!priv.get(obj)) priv.set(obj, {
            actions: []
          });
          priv.get(obj).actions.push({
            key: prop,
            action: function action() {
              var object = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : obj;
              return Reflect.get(object, prop, prox);
            },
            arguments: Array.prototype.slice.call(arguments),
            method: "get",
            "function": Reflect.get
          });
          return result;
        };

        var returnVal = new _Proxy(options);

        function swap(replace, callback) {
          if (ob !== replace) {
            backup = clone(ob);
            priv.set(backup, {
              original: ob
            });
            priv.get(target).archive.push(replace);
            if (!priv.has(ob)) priv.set(ob, {
              archive: [],
              actions: []
            });
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
          if (!priv.has(backup)) priv.set(backup, {
            original: ob
          });
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

        hand.refresh = function () {
          var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ob;
          var exclude = arguments.length > 1 ? arguments[1] : undefined;
          Reflect.ownKeys(target).filter(function (key) {
            return !exclude.includes(key);
          }).forEach(function (key) {
            delete target[key];
          });
          return merge(target, obj, function (key, desc) {
            return setProp(obj, key, desc);
          });
        };

        return returnVal;
      }
    }]);
    return _Proxy;
  }();

  function reflectTraps(handler) {
    Reflect.ownKeys(Reflect).forEach(function (key) {
      var oldKey = handler[key];
      Object.defineProperty(handler, key, {
        value: function value(ob) {
          for (var _len6 = arguments.length, arg = new Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
            arg[_key6 - 1] = arguments[_key6];
          }

          var pr = priv.get(handler);
          var theTarget = typeof oldKey === "function" ? oldKey : Reflect[key];
          if (pr.clone) ob = clone;
          if (pr.virtualTarget) ob = pr.virtualTarget;

          if (key === "get" || key === "set") {
            var bind = pr.bind || pr.clone;
            arg[2] = bind;
          }

          if (pr.actions) {
            pr.actions.push({
              key: key,
              action: function action() {
                var object = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ob;
                return theTarget.apply(void 0, [object].concat(arg));
              },
              arguments: Array.prototype.slice.call(arguments),
              method: key,
              "function": theTarget
            });
          }

          return theTarget.apply(void 0, [ob].concat(arg));
        }
      });
    });
    return handler;
  }

  (function () {
    var _privateLog = console.log;

    console.log = function (item) {
      if (item && item["{{target}}"]) {
        var _Proxy2 = function _Proxy2(ob) {
          (0, _classCallCheck2["default"])(this, _Proxy2);
          Object.defineProperties(this, Object.getOwnPropertyDescriptors(ob));
          Object.setPrototypeOf(this, Object.getPrototypeOf(ob));
          return this;
        };

        var newTarget = new _Proxy2(item["{{target}}"]);
        arguments[0] = newTarget;
      }

      _privateLog.apply(console, arguments);
    };
  })();

  return _Proxy;
}();

module.exports = _Proxy;
_Proxy["default"] = _Proxy;