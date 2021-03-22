"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var priv = require("../Komponent/privateVariables");

var clone = function clone() {
  var _require;

  return (_require = require("./utils")).clone.apply(_require, arguments);
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
    } else if (prop && typeof prop !== "string" && _typeof(prop) !== "symbol") {
      bind = prop;
      desc = {
        value: ob
      };
      ob = undefined;
      prop === undefined;
    }
  }

  if (prop && ob && !(prop in ob)) return ob[prop];

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

      _classCallCheck(this, _Proxy);

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
          var getResult = opt.handler && opt.handler.get ? (_opt$handler = opt.handler).get.apply(_opt$handler, args) : Reflect.get(ob, prop, prox);
          if (properties && prop in properties) results.push([properties, prop, prox]);
          if (properties && properties["default"]) results.push([properties["default"].apply(properties, args)]);
          results.push([getResult]);
          if (alternate) results.push([alternate, prop, prox]);
          results.some(function (res) {
            result = self.getProp.apply(self, _toConsumableArray(res));
            if (typeof result !== "undefined") return true;
          });
          result = typeof result !== "undefined" ? result : prop in Object.getPrototypeOf(this) ? this[prop] : undefined;
          return result;
        },

        get properties() {
          var opt = priv.get(this);
          var result;
          if (_typeof(opt.properties) !== "object" && typeof opt.properties !== "function") return {};
          return function (ob, prop, bind) {
            ob = ob !== opt.target ? ob : opt.clone || opt.virtualTarget || ob;
            bind = bind !== newProx ? bind : opt.bind || opt.clone;
            if (_typeof(opt.properties) === "object") return bindIt(Reflect.get(opt.properties, prop, ob), bind);else return bindIt(opt.properties.call(opt, ob, prop, bind), bind);
          };
        },

        set: function set(ob, prop, val) {
          var opt = priv.get(self);
          if (!Reflect.isExtensible(opt.target)) return true;

          if (Reflect.hasOwnProperty(opt.target, prop)) {
            var _desc = Object.getOwnPropertyDescriptor(opt.target, prop);

            if (_desc.configurable === false && _desc.writable === false) return true;
          }

          if (opt.virtualTarget) ob = opt.virtualTarget;
          var desc = Object.getOwnPropertyDescriptor(this.properties, prop);
          if (desc && desc.set === "function") return this.properties[prop] === val;
          return opt.handler.set ? !!opt.handler.set(ob, prop, val) : !!(ob[prop] = val);
        },
        has: function has(ob, prop) {
          var opt = priv.get(self);
          var vTarget = opt.virtualTarget;
          if (!Reflect.isExtensible(opt.target)) return Reflect.has(opt.target);
          if (vTarget) ob = vTarget;else return Reflect.has(ob, prop);
          var desc = Object.getOwnPropertyDescriptor(ob, prop);
          if (desc && desc.configurable === false) return true;
          return Reflect.has(vTarget, prop);
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
            var _ref2 = _slicedToArray(_ref, 2),
                key = _ref2[0],
                ent = _ref2[1];

            if (ent.configurable === false || !Reflect.isExtensible(opt.target)) vKeys.add(key);
          });
          return _toConsumableArray(vKeys);
        },
        getOwnPropertyDescriptor: function getOwnPropertyDescriptor(ob, prop) {
          var getDesc = Object.getOwnPropertyDescriptor;
          var opt = priv.get(self);
          if (!Reflect.isExtensible(opt.target)) return Object.getOwnPropertyDescriptor(opt.target, prop);
          var obDesc = getDesc(ob, prop);
          if (!opt || !opt.VirtualTarget) return obDesc;
          var vTarget = opt.virtualTarget;
          if (!vTarget) return obDesc;
          var vDesc = getDesc(vTarget, prop);
          if (!vDesc && (obDesc && obDesc.configurable === false || obDesc && !Reflect.isExtensible(ob))) return obDesc;
          vDesc.configurable = obDesc ? obDesc.configurable : true;
          if (obDesc && obDesc.configurable === false && obDesc.writable === false) return obDesc;
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

    _createClass(_Proxy, [{
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

            return _ref3 = {}, _defineProperty(_ref3, "{{swap}}", swap), _defineProperty(_ref3, "{{rollback}}", rollback), _defineProperty(_ref3, "{{archive}}", archive), _defineProperty(_ref3, "{{clone}}", klone), _ref3;
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

          var pr = priv.get(this);
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
          _classCallCheck(this, _Proxy2);

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