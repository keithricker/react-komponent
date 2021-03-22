"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof2(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

function _toConsumableArray2(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof2(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var React = require("react");

var path = require("path"); // const Obj = require('./Obj')


var _Proxy = function _Proxy() {
  var Prox = require("./_Proxy")["default"];

  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return !args.length ? Prox : _construct(Prox, args);
};

var proto = {
  get: Object.getPrototypeOf,
  set: Object.setPrototypeOf
};

var _global;

try {
  _global = window;
} catch (_unused) {
  _global = global;
}

function _if(exp, more) {
  if (!more && typeof exp === "function") {
    var cb = function cb(res) {
      return res || undefined;
    };

    try {
      return exp(cb);
    } catch (_unused2) {
      return undefined;
    }
  }

  return exp ? more(exp) : undefined;
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function unCapitalize(word) {
  return word.charAt(0).toLowerCase() + word.slice(1);
}

function isDescriptor(ob) {
  var isDescriptor = true;
  if (!Reflect.ownKeys(ob).length) return false;

  try {
    var copy = Object.getOwnPropertyDescriptor(Object.defineProperty({}, "prop", ob), "prop");
    isDescriptor = Reflect.ownKeys(copy).length === Reflect.ownKeys(ob).length && Reflect.ownKeys(copy).every(function (key) {
      return key in ob && ob[key] === copy[key];
    });
  } catch (_unused3) {
    isDescriptor = false;
  }

  return isDescriptor;
}

function areDescriptors(ob) {
  var areDescriptors = true;
  if (!Reflect.ownKeys(ob).length) return false;

  try {
    var copy = Object.getOwnPropertyDescriptors(Object.defineProperties({}, ob));
    areDescriptors = !!(JSON.stringify(copy) === JSON.stringify(ob) && Reflect.ownKeys(copy).every(function (key) {
      return !!(JSON.stringify(ob[key]) === JSON.stringify(copy[key]) && Reflect.ownKeys(copy[key]).every(function (key) {
        return !!(copy[key][key] === original[key][key]);
      }));
    }));
  } catch (_unused4) {
    areDescriptors = false;
  }

  return areDescriptors;
}

function simpleMixin(trg, src) {
  return proto.set(trg, proto.set(src, proto.get(trg)));
}

function bind() {
  var _Function$prototype$b;

  var target = arguments.length <= 0 ? undefined : arguments[0];
  if (typeof target !== "function" || isClass(target)) return target;
  return (_Function$prototype$b = Function.prototype.bind).call.apply(_Function$prototype$b, arguments);
}

var thiss = module.exports = {
  // const Obj = require("./Obj").Obj
  // const is = require("./Obj").is
  get _typeof() {
    var _typeof = function _typeof(ob, type) {
      var returnVal = unCapitalize({}.toString.call(ob).split("[object ").join("").split("]")[0]);
      var ret = !!(type === returnVal);
      var split = type ? type.split(" ") : [];
      split.forEach(function (key, ind) {
        if (key === "and" || key === "or") return;
        if (split[ind + 1] === "or") ret = !!(returnVal === key || returnVal === ind + 2);
        if (split[ind + 1] === "and") ret = !!(returnVal === key && returnVal === ind + 2);
      });
      return typeof type === "string" ? ret : returnVal;
    };

    _typeof["class"] = function (ob) {
      return _global[capitalize(_typeof(ob))];
    };

    return _typeof;
  },

  entries: function entries(obj) {
    return Reflect.ownKeys(obj).map(function (key) {
      var ent = [key, ""];
      Object.defineProperty(ent, 1, Object.getOwnPropertyDescriptor(obj, key));
      return ent;
    });
  },
  _undef: function _undef(varble) {
    return typeof varble === "undefined";
  },
  isURL: function isURL(url) {
    if (typeof url !== "string") return false;
    if (!thiss.isURL.pattern) thiss.isURL.pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return thiss.isURL.pattern.test(url) ? true : false;
  },
  isJSON: function isJSON(data) {
    if (typeof data !== "string") return false;
    data = data.trim();
    var match = data.match(/\{[^{}]+\}/) || [];
    return match[0] === data;
  },
  randomString: function randomString() {
    var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 32;
    return Math.round(Math.pow(36, length + 1) - Math.random() * Math.pow(36, length)).toString(36).slice(1);
  },
  Problem: /*#__PURE__*/function (_Error) {
    _inherits(Problem, _Error);

    var _super = _createSuper(Problem);

    function Problem() {
      _classCallCheck(this, Problem);

      for (var _len2 = arguments.length, arg = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        arg[_key2] = arguments[_key2];
      }

      return _super.call.apply(_super, [this].concat(arg));
    }

    _createClass(Problem, [{
      key: "log",
      get: function get() {
        var stackTrace;
        var stack = new Error().stack;
        var trace = {};
        stackTrace = stack.split("\n");
        if (stackTrace[0].includes("log")) stackTrace.shift();
        var re = /(\w+)@|at (\w+) \(/g;
        stackTrace.forEach(function (st, ind) {
          if (!st.trim()) return;
          var find = re.exec(st);
          if (find) find = find[1] || find[2];
          if (typeof find !== "string") return;
          trace[find] = st;
          var url = st.match(isURL.pattern);
          trace[find] = url ? url[0] : st;
        });
        return trace;
      }
    }]);

    return Problem;
  }( /*#__PURE__*/_wrapNativeSuper(Error)),
  isClass: function isClass(func) {
    return is["class"](func);
  },
  _last: function _last(arr) {
    return _toConsumableArray2(arr).pop();
  },
  tryCatch: function tryCatch(exp, cb) {
    var res;
    var err;

    try {
      res = exp();
    } catch (error) {
      err = error;
    }

    return cb ? cb(res, err) : err || res;
  },
  suppress: function suppress(exp, deflt) {
    var res = thiss.tryCatch(exp);
    return res instanceof Error ? deflt : res;
  },
  ReflectBind: function () {
    var thiss = this;
    var RB = {
      descriptor: function descriptor(object, property) {
        for (var _len3 = arguments.length, bindArgument = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
          bindArgument[_key3 - 2] = arguments[_key3];
        }

        var _ref = arguments.length === 1 ? arguments[0] : {},
            _ref$object = _ref.object,
            ob = _ref$object === void 0 ? arguments[0] : _ref$object,
            _ref$property = _ref.property,
            prop = _ref$property === void 0 ? arguments[1] : _ref$property,
            _ref$descriptor = _ref.descriptor,
            desc = _ref$descriptor === void 0 ? Object.getOwnPropertyDescriptor(ob, prop) : _ref$descriptor,
            _ref$includeSet = _ref.includeSet,
            includeSet = _ref$includeSet === void 0 ? false : _ref$includeSet,
            _ref$bind = _ref.bind,
            bind = _ref$bind === void 0 ? bindArgument : _ref$bind;

        if (!bind || !bind.length) return desc;
        if (bind && !Array.isArray(bind)) bind = [bind];
        Reflect.ownKeys(desc).filter(function (key) {
          return key === "set" ? includeSet : true;
        }).forEach(function (key) {
          if (typeof desc[key] === "function" && property !== "constructor") {
            var _desc$key;

            var _original = desc[key];
            desc[key] = (_desc$key = desc[key]).bind.apply(_desc$key, _toConsumableArray2(bind));
            Array("bind", "apply", "call").forEach(function (meth) {
              Object.defineProperty(desc[key], meth, {
                value: function value() {
                  for (var _len4 = arguments.length, arg = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                    arg[_key4] = arguments[_key4];
                  }

                  if (arg[0]) {
                    var args = [].concat(arg);
                    var newBind = args[0];
                    if (args.length && !newBind) newBind = this;
                    arg[0] = newBind;
                  }

                  return Function.prototype[meth].bind(_original).apply(void 0, arg);
                },
                configurable: true,
                writable: true,
                enumerable: false
              });
            });
          }
        });
        return desc;
      },
      ownDescriptor: function ownDescriptor(object, property) {
        if (!object.hasOwnProperty(property)) return;

        for (var _len5 = arguments.length, bind = new Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
          bind[_key5 - 2] = arguments[_key5];
        }

        return this.descriptor.apply(this, [object, property].concat(bind));
      },
      get: function get(obj, prop, bind) {
        var desc;
        if (arguments.length === 1 || !obj || Object(obj) !== obj) return obj;
        if (arguments.length === 3 && !bind) return obj ? obj[prop] : undefined;

        if (arguments.lenght === 2) {
          if (!prop) return obj;
          prop = "", bind = prop;
          desc = {
            value: property
          };
        }

        desc = desc || Reflect.getOwnPropertyDescriptor(obj, prop);
        if (!desc) return obj[prop];
        var type = Array("get", "value").find(function (key) {
          return typeof desc[key] === "function";
        });
        if (!type || type === "value" && prop === "constructor") return obj[prop];
        var property = type === "get" ? desc.get.bind(bind)() : desc.value;
        var res = typeof property === "function" && prop !== "constructor" ? property.bind(bind) : res;

        if (typeof res === "function") {
          Array("bind", "apply", "call").forEach(function (key) {
            return res[key] = Function.prototype[key].bind(property);
          });
        }

        return res;
      }
    };

    var ReflectBind = function ReflectBind() {
      for (var _len6 = arguments.length, bind = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        bind[_key6] = arguments[_key6];
      }

      if (!bind.length) return RB;
      Reflect.ownKeys(RB).forEach(function (key) {
        var property = RB[key];

        RB[key] = function () {
          for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
            args[_key7] = arguments[_key7];
          }

          args.splice.apply(args, [2, 0].concat(bind));
          return property.call.apply(property, args);
        };
      });
      return RB;
    };

    Object.defineProperties(ReflectBind, Object.getOwnPropertyDescriptors(RB));
    return ReflectBind;
  }(),
  argsProxy: function argsProxy(args) {
    var newArg = {};
    return new Proxy(newArg, {
      get: function get(ob, prop) {
        if (newArg[prop]) return newArg[prop];
        if (prop === "args") return newArg;
        var position = Object.keys(newArg).length;
        newArg[prop] = args[position];
        return newArg[prop];
      }
    });
  },
  Args: function Args(cb) {
    var newfunc = function newfunc() {
      for (var _len8 = arguments.length, arg = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        arg[_key8] = arguments[_key8];
      }

      return cb(argsProxy(arg));
    };

    return newfunc;
  },
  Funktion: /*#__PURE__*/function (_Function) {
    _inherits(Funktion, _Function);

    var _super2 = _createSuper(Funktion);

    function Funktion(func, props) {
      var _this;

      _classCallCheck(this, Funktion);

      props = arguments[1] || _typeof2(arguments[0]) === "object" && arguments[0];
      func = typeof arguments[0] === "function" ? arguments[0] : props && props["function"] && props["function"];
      if (props) delete props["function"];
      var name = props.hasOwnProperty("name") && props.name || func.name || "funktion";
      delete props.name;

      function funktionCaller(fun, binder) {
        for (var _len9 = arguments.length, ar = new Array(_len9 > 2 ? _len9 - 2 : 0), _key9 = 2; _key9 < _len9; _key9++) {
          ar[_key9 - 2] = arguments[_key9];
        }

        return fun.call.apply(fun, [binder].concat(ar));
      }

      var funktion = _defineProperty({}, name, function () {
        for (var _len10 = arguments.length, ar = new Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
          ar[_key10] = arguments[_key10];
        }

        var ao = argsProxy(ar);
        var binder = new Proxy(this || _global, {
          get: function get(ob, prop) {
            if (prop in ob) return ob[prop];
            if (ao && ao.hasOwnProperty(prop)) return ao[prop];
            if (prop === "arguments") return [].concat(ar);
          }
        });
        return !ao ? funktionCaller.apply(void 0, [func, binder].concat(Array.prototype.slice.call(arguments))) : funktionCaller(func, binder, ao);
      })[name];

      Object.defineProperty(funktion, "name", {
        value: name,
        writable: false,
        enumerable: false,
        configurable: true
      });
      Array("properties", "static").forEach(function (pr) {
        if (pr in props) merge(funktion, props[pr]);
        delete props[pr];
      });
      _this = _super2.call(this);
      if (props && "__proto__" in props) Object.setPrototypeOf(funktion, props["__proto__"]);
      merge(funktion, _assertThisInitialized(_this), ["name"]);
      if (props) merge(funktion, props, ["name", "__proto__"]);
      if (!props["__proto__"]) proto.set(funktion, _this.constructor.prototype);
      funktion.prototype.constructor = funktion;
      return _possibleConstructorReturn(_this, funktion);
    }

    return Funktion;
  }( /*#__PURE__*/_wrapNativeSuper(Function)),

  /*  alternative to the switch statement  */
  swap: function swap(cond, mp) {
    var res = cond();
    var deflt = {};
    var ret = deflt;
    mp.forEach(function (val, key) {
      if (ret !== deflt) return;

      if (key === res) {
        ret = val(res);
      }
    });
    return ret === deflt ? undefined : ret;
  },
  executionTime: function executionTime(script) {
    var start = new Date();
    script();
    return new Date() - start;
  },
  contract: function contract(input, then) {
    if (isPromise(input)) return then ? input.then(function (done) {
      return then(done);
    }) : input;
    return then ? then(input) : input;
  },
  asyncForEach: function asyncForEach(arr, cb, ths) {
    var iteration = -1;

    function iterate(prev) {
      if (iteration === arr.length - 1) return prev;
      iteration++;
      return contract(cb.call(ths, arr[iteration], iteration, prev, arr), function (res) {
        prev = res;
        return iterate(prev);
      });
    }

    return iterate();
  },
  sequence: function sequence() {
    for (var _len11 = arguments.length, funcs = new Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
      funcs[_key11] = arguments[_key11];
    }

    if (funcs.length === 1 && Array.isArray(funcs[0])) funcs = funcs[0];
    if (funcs.constructor && !Array.isArray(funcs)) funcs = Object.values(funcs);
    return asyncForEach(funcs, function (func, ind, res) {
      return func(res);
    });
  },
  mixProx: function mixProx(obj, mix, bound, priority) {
    var prec = priority;
    var handler = {
      get: function get(ob, prop) {
        var trg = prop in prec && prec || prop in obj && obj || prop in mix && mix;
        var bnd = bound;
        if (trg === bound) bnd = undefined;
        return bnd ? thiss.tie(Reflect.get(trg[prop], bnd), bnd) : trg[prop];
      }
    };
    return new Proxy(obj, handler);
  },
  reverseInherit: function reverseInherit() {},
  bindIt: function bindIt(obj, key, bnd) {
    var res, args;

    if (arguments.length < 3) {
      if (!key) return obj;
      if (typeof key === "string" || _typeof2(key) === "symbol") return obj[key];
      bnd = key;
      res = obj;
    }

    args = [obj, key, bnd].filter(Boolean);
    res = res || Reflect.get.apply(Reflect, _toConsumableArray2(args));
    return typeof res === "function" ? res.bind(bnd) : res;
  },
  _mixin: function _mixin(_ref2) {
    var target = _ref2.target,
        source = _ref2.source,
        _ref2$priority = _ref2.priority,
        priority = _ref2$priority === void 0 ? source : _ref2$priority,
        _ref2$bind = _ref2.bind,
        bind = _ref2$bind === void 0 ? target : _ref2$bind;

    function objFunc(trg) {
      var _arguments = arguments;

      var apply = function apply(ob) {
        if (_arguments.length === 1 && typeof ob === "string") return ReflectBind.get(trg, ob, bound());
        return !_arguments.length ? trg : thiss.suppress(function () {
          return ob() === trg;
        }, ob === trg);
      };

      var handler = _Proxy().handlers["default"](trg);

      return new Proxy(apply, handler);
    }

    var obj = objFunc(target);
    var mix = objFunc(source);
    var rank = objFunc(priority);
    var bound = objFunc(bind);

    var type = function type(o1, o2) {
      return !o2 ? Obj(o1).Type()["class"]() : Obj(o1).Type() === Obj(o2).Type();
    };

    var clonedMix = Obj(Obj(mix).descriptors).filter(key, function () {
      if (key in obj && rank(obj())) return false;
      if (key in type(obj).prototype && !(type(mix).prototype instanceof type(obj) || type(obj).prototype instanceof mix()) && type(obj) !== Object && bound(obj)) return false;
    }).map(function (key, val) {
      delete val.value;

      val.get = function () {
        return mix(key);
      };

      return val;
    });
    return simpleMixin(obj, clonedMix);
  },
  mixin: function mixin() {
    for (var _len12 = arguments.length, ar = new Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
      ar[_key12] = arguments[_key12];
    }

    return _mixin(argsProxy(ar));
  },
  captured: function captured() {
    var captured = {
      get: {},
      set: {}
    };

    function capture() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "object";
      var cap = typeof name === "string" ? [] : name;
      if (!cap.applies) cap.applies = [];
      return new Proxy(cap, {
        get: function get(ob, prop) {
          if (typeof name === "string") {
            captured.get[name] = captured.get[name] || [];
            captured.get[name].push(cap);
          }

          cap.push(prop);
          return capture(cap);
        },
        set: function set(ob, prop, val) {
          if (typeof name === "string") {
            captured.set[name] = captured.get[name] || [];
            captured.set[name].push(cap);
          }

          cap.set(prop);
          cap.applies.push(function (target) {
            var dest = target;
            cap.forEach(function (part, ind) {
              if (ind === cap.length) dest[part] = val;else dest = dest[part];
            });
          });
          return true;
        },
        apply: function apply(target, that, args) {
          cap.applies.push();
        }
      });
    }

    return captue;
  },
  mapFunction: function mapFunction() {
    var map = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Map();

    function mapFunc(key, val) {
      if (!map.has(key)) return mapFunc.get.apply(mapFunc, arguments);
      if (!arguments.hasOwnProperty(1)) return map.get(key);
      return map.set.apply(map, arguments);
    }

    simpleMixin(mapFunc, {});
    Reflect.ownKeys(thiss._typeof["class"](map).prototype).forEach(function (key) {
      Object.getPrototypeOf(mapFunc)[key] = typeof thiss._typeof["class"](map).prototype[key] === "function" ? thiss._typeof["class"](map).prototype[key].bind(map) : thiss._typeof["class"](map).prototype[key];
    });

    mapFunc.get = function (obj, properties) {
      var _arguments2 = arguments;

      var props = function props() {
        return _arguments2.hasOwnProperty(1);
      };

      if (!props() && map.has(obj)) return map.get(obj);
      if (!map.has(obj)) mapFunc.set(obj, props());
      return properties;
    };

    return mapFunc;
  },
  WeakerMap: /*#__PURE__*/function (_WeakMap) {
    _inherits(WeakerMap, _WeakMap);

    var _super3 = _createSuper(WeakerMap);

    function WeakerMap() {
      var _this2;

      for (var _len13 = arguments.length, arg = new Array(_len13), _key13 = 0; _key13 < _len13; _key13++) {
        arg[_key13] = arguments[_key13];
      }

      _classCallCheck(this, WeakerMap);

      _this2 = _super3.call.apply(_super3, [this].concat(arg));

      var WM = _assertThisInitialized(_this2);

      var random = randomString();

      var mapFunction = function mapFunction(obj, properties) {
        if (!WM.has(obj)) return mapFunction.get.apply(mapFunction, arguments);
        if (!arguments.hasOwnProperty(1)) return WM.get(obj);
        return WM.set.apply(WM, arguments);
      };

      Reflect.ownKeys(WeakMap.prototype).forEach(function (key) {
        mapFunction[key] = typeof WeakMap.prototype[key] === "function" ? WeakMap.prototype[key].bind(WM) : WeakMap.prototype[key];
      });

      mapFunction.get = function (obj, properties) {
        var _arguments3 = arguments;
        var def = {};

        var props = function props() {
          return _arguments3.hasOwnProperty(1);
        };

        if (!props() && WM.has(obj)) return WM.get(obj);
        if (!WM.has(obj)) mapFunction.set(obj, props() ? properties : def);
        return props() ? properties : def;
      };

      mapFunction.set = function (obj, props) {
        if (!WM.has(obj)) WM.set(obj, new Proxy({}, {
          get: function get(ob, prop) {
            return prop === "randomString" ? random : prop in props ? props[prop] : undefined;
          },
          set: function set(ob, prop, val) {
            return props[prop] = val;
          }
        }));else WM.set(obj, props);
      };

      return _this2;
    }

    return WeakerMap;
  }( /*#__PURE__*/_wrapNativeSuper(WeakMap)),

  /*
  function ObjectMap(obMap={}) {
    let types = new MapFunc(new WeakMap());
    let type = obMap instanceof Map ? "map" : "object";
    let asObject = type === "object" ? obMap : Object.fromEntries(obMap);
    let asMap = type === "object" ? new Map(entries(obMap)) : obMap;
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
  */
  ObjectMap: function (_ObjectMap) {
    function ObjectMap() {
      return _ObjectMap.apply(this, arguments);
    }

    ObjectMap.toString = function () {
      return _ObjectMap.toString();
    };

    return ObjectMap;
  }(function () {
    var obMap = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    vars = require("../Komponent/privateVariables"), vars["default"](ObjectMap, {
      keys: new WeakMap()
    });
    var keys = vars(ObjectMap).keys;
    var origSet = keys.set.bind(keys);

    keys.set = function (arg) {
      if (_typeof2(arg) === "symbol") return origSet(arg, {
        key: arg
      });else return origSet(arg);
    };

    var mapKey = function mapKey(obj, key, text) {
      _classCallCheck(this, mapKey);

      var _mapKey = Symbol(text || "MapKey");

      keys.set(_mapKey, {
        key: key,
        map: vars(obj).map,
        object: vars(map).obj
      });
      return _mapKey;
    };

    function initializeVars(om) {
      vars(om).type = om instanceof Map ? "map" : "object";
      if (!vars(om).map) vars(om).map = vars(om).type === "object" ? new Map(entries(om)) : om;

      if (vars(om).type === "object") {
        vars(om).map = ObjectMap(vars(om).map);
        vars(vars(om).map).obj = om;
      }

      if (!vars(om).obj) vars(om).obj = om;
    }

    if (!vars.has(obMap)) initializeVars(obMap); // if it's an object, then we set the object's prototype to the map itself

    if (vars(obMap).type === "object") {
      proto.set(obMap, vars(obMap).map);
      return obMap;
    }

    var map = function map(ths) {
      return vars(ths).map;
    };

    var obj = function obj(ths) {
      return vars(ths).obj;
    };

    var mpro = function mpro(ths) {
      if (vars(ths).mpro) return vars(ths).mpro;
      vars(ths).mpro = new Proxy(map(ths), {
        get: function get(ob, prop) {
          return map(ths)[prop];
        }
      });
      return vars(ths).mpro;
    };

    var omProto = {
      get: function get(key) {
        if (!(typeof key === "string" || _typeof2(key) === "symbol")) key = this.symbolFromKey(this, key);
        return obj(this)[key];
      },
      set: function set(key, val, alt) {
        mpro(this).set(key);
        var obkey = typeof key === "string" || _typeof2(key) === "symbol" ? key : new mapKey(obj(this), key, alt);
        obj(this)[obkey] = val;
      },
      "delete": function _delete(key) {
        mpro(this)["delete"](key);
        return delete obj(this)[key];
      },
      has: function has(key) {
        if (!(typeof key === "string" || _typeof2(key) === "symbol")) key = this.symbolFromKey(key);
        return !!obj(this)[key];
      },
      clear: function clear() {
        mpro(this).clear();
        return Obj(obj(this)).clear();
      },
      refresh: function refresh() {
        var _this3 = this;

        mpro(this).forEach(function (val, key) {
          if (!obj(_this3).hasOwnProperty(key)) mpro(_this3)["delete"](key);
          mpro(_this3).set(key, ob(_this3)[key]);
        });
        var objEnt = entries(obj(this)).filter(function () {
          var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ent,
              _ref4 = _slicedToArray(_ref3, 2),
              key = _ref4[0],
              val = _ref4[1];

          return !mpro(_this3).has(key);
        });
        objEnt.forEach(function () {
          var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ent,
              _ref6 = _slicedToArray(_ref5, 2),
              key = _ref6[0],
              val = _ref6[1];

          return mpro(_this3).set(key, val);
        });
      },
      symbolFromKey: function symbolFromKey(ob, key) {
        return Reflect.ownKeys(vars(ob).obj).find(function (key) {
          return keys.get(key) === key;
        });
      },
      keyFromSymbol: function keyFromSymbol(ob, sym) {
        return keys.get(sym).key;
      }
    }; // if it's not a map then we have to get creative

    if (!(vars(obMap).type === "map" && vars(obMap).obj !== obMap)) {
      var mixed = mixin(obMap, omProto);
      delete mixed.constructor;
      proto.set(obMap, omProto);
    }

    return obMap;
  }),
  classInherit: function classInherit(komp, Komponent) {
    var comp = proto.set({}, komp);

    while (comp = proto.get(comp)) {
      if (proto.get(comp) === Komponent) break;

      if (proto.get(comp) === React.Component) {
        proto.set(comp, Komponent);
        break;
      }
    }
  },
  objInherit: function objInherit(komp, Komponent) {
    var comp = proto.set({}, komp);

    while (comp = proto.get(comp)) {
      console.log(comp.constructor.name);
      if (proto.get(comp) && proto.get(comp).constructor === Komponent) break;

      if (proto.get(comp) && proto.get(comp).constructor === React.Component) {
        proto.set(comp, Komponent.prototype);
        break;
      }
    }
  },
  tie: function tie() {
    var tie = function tie(func, newBind) {
      if (typeof func !== "function" || func.name.split("bound ")[1]) return func;
      if (!newBind) return func;
      if (func instanceof tie) func = func.originalFunc;

      if (isClass(func)) {
        console.error("Problem with: \"".concat(func.name, ".\" Tie function can't work with classes. Invalid data type. Ignoring."));
        return func;
      }

      var funcName = func.name;

      var newFunc = _defineProperty({}, funcName, function () {
        var _newFunc$originalFunc, _newFunc$originalFunc2;

        for (var _len14 = arguments.length, arg = new Array(_len14), _key14 = 0; _key14 < _len14; _key14++) {
          arg[_key14] = arguments[_key14];
        }

        return newFunc.tie.bind ? (_newFunc$originalFunc = newFunc.originalFunc).call.apply(_newFunc$originalFunc, [newFunc.tie.bind].concat(arg)) : (_newFunc$originalFunc2 = newFunc.originalFunc).call.apply(_newFunc$originalFunc2, arg);
      })[funcName];

      Object.setPrototypeOf(newFunc, func);
      Object.defineProperty(newFunc, "name", {
        value: funcName
      });
      newFunc.originalFunc = func;

      newFunc.tie = newFunc.tie || function (binder) {
        this.tie.bind = binder;
      };

      if (newBind) newFunc.tie.bind = newBind;
      proto.set(newFunc, tie.prototype); // return newFunc

      return newFunc;
    };

    proto.set(tie.prototype, Function.prototype);
    Array("bind", "call", "apply").forEach(function (key) {
      return tie.prototype[key] = function () {
        var _this$originalFunc;

        return (_this$originalFunc = this.originalFunc)[key].apply(_this$originalFunc, arguments);
      };
    });
    return tie;
  },

  /*
  const tie = new Funktion({
     _function: function tie(func, newBind) {
      if (typeof func !== "function" || func.name.split("bound ")[1]) return func;
      if (!newBind) return func;
    
      if (func instanceof tie) func = func.originalFunc;
      if (isClass(func)) {
        console.error(
          `Problem with: "${func.name}." Tie function can't work with classes. Invalid data type. Ignoring.`
        );
        return func;
      }
      let newFunc = new Funktion({
        _function: function (...arg) {
          return newFunc.tie.bind
            ? newFunc.originalFunc.call(newFunc.tie.bind, ...arg)
            : newFunc.originalFunc.call(...arg);
        },
        _properties: merge(merge({},func),{
          originalFunc = func,
          tie : newFunc.tie ||
          function (binder) {
            this.tie.bind = binder;
          }        
        }),
        _prototype:tie.prototype,
      })
      if (newBind) newFunc.tie.bind = newBind;
      return newFunc;
    },
    prototype: {
      constructor: this.originalFunc,
      bind() { 
        return this.originalFunc.bind(...arg);
      },
      call() {
        return this.originalFunc.call(...arg);
      },
      apply() {
        return this.originalFunc.apply(...arg);
      },
      _prototype: Function
    }
  })
  */
  cloneFunc: function (_cloneFunc) {
    function cloneFunc(_x, _x2, _x3) {
      return _cloneFunc.apply(this, arguments);
    }

    cloneFunc.toString = function () {
      return _cloneFunc.toString();
    };

    return cloneFunc;
  }(function (func, cb, binder) {
    var clonedFunctionName = func.name;

    var cloned = _defineProperty({}, clonedFunctionName, function _target() {
      var bnd = binder || this;

      for (var _len15 = arguments.length, props = new Array(_len15), _key15 = 0; _key15 < _len15; _key15++) {
        props[_key15] = arguments[_key15];
      }

      if (this instanceof _target ? this.constructor : void 0) return _construct(func, props);
      return cb.call.apply(cb, [bnd, binder].concat(props));
    })[clonedFunctionName];

    cloned.prototype = func.prototype;

    if (!binder) {
      Object.setPrototypeOf(cloned, func);
      Object.defineProperty(cloned, "name", {
        value: func.name
      });
      return cloned;
    }

    var properties = {}[("call", "bind", "apply")].forEach(function (method) {
      var original = thiss.tie(Function.prototype[method], cloned);

      properties[method] = function () {
        var bin = binder || this;
        binder = arguments.length <= 0 ? undefined : arguments[0];

        if (method === "bind") {
          var newClone = cloneFunc(func, cb, arguments.length <= 0 ? undefined : arguments[0]);
          var newOriginal = thiss.tie(Function.prototype.bind, newClone);
          binder = bin;
          return newOriginal.apply(void 0, arguments);
        }

        try {
          return original.apply(void 0, arguments);
        } finally {
          binder = bin;
        }
      };
    });

    var clonedProto = _Proxy({
      target: func,
      virtualTarget: Object.getPrototypeOf(func),
      properties: properties
    });

    Object.defineProperty(cloned, "name", {
      value: func.name
    });
    proto.set(cloned, clonedProto);
    return cloned;
  }),
  waitFor: function waitFor(conditionFunction) {
    var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;

    var poll = function poll(resolve) {
      if (typeof conditionFunction === "number") {
        setTimeout(function (_) {
          return resolve();
        }, conditionFunction);
      } else {
        if (conditionFunction()) resolve();else setTimeout(function (_) {
          return poll(resolve);
        }, time);
      }
    };

    return new Promise(poll);
  },
  merge: function (_merge) {
    function merge(_x4, _x5, _x6, _x7) {
      return _merge.apply(this, arguments);
    }

    merge.toString = function () {
      return _merge.toString();
    };

    return merge;
  }(function (target, src, exclude, binder) {
    if (typeof target === "undefined" || typeof src === "undefined") throw new Error("Invalid arguments at merge function. Must have a valid target and source.");
    var callback = typeof exclude === "function" ? exclude : undefined;
    if (!Array.isArray(exclude)) exclude = [];
    if (Array.isArray(target) && Array.isArray(src)) return [].concat(_toConsumableArray2(target), _toConsumableArray2(src.filter(function (item) {
      return !exclude.includes(item) && target;
    })));

    if (target[Symbol.iterator] && src[Symbol.iterator]) {
      if (target instanceof HTMLCollection) {
        var _target$parentNode;

        (_target$parentNode = target.parentNode).replaceChildren.apply(_target$parentNode, _toConsumableArray2(target.children).concat(_toConsumableArray2(src)));
      } else if (target.set) _toConsumableArray2(src).forEach(function (item) {
        return target.set.apply(target, _toConsumableArray2(item));
      });else if (target.add) {
        _toConsumableArray2(src).forEach(function (item) {
          return target.add(item);
        });
      }

      return target;
    }

    if (thiss._typeof(target) === 'element' || thiss._typeof(target) === 'htmlElement') {
      if (thiss._typeof(src) === 'element' || thiss._typeof(src) === 'htmlElement') {
        target.replaceChildren.apply(target, _toConsumableArray2(target.children).concat(_toConsumableArray2(src.children)));
        Reflect.ownKeys(src).filter(function (key) {
          return key !== "children" && key !== "childNodes";
        }).forEach(function (key) {
          if (target[key][Symbol.iterator]) {
            try {
              merge(target[key], src[key]);
            } catch (_unused5) {}
          } else try {
            target.setAttribute(key, src[key]);
          } catch (_unused6) {}
        });
      } else if (thiss._typeof(src) === 'hTMLCollection') target.replaceChildren.apply(target, _toConsumableArray(target.children).concat(_toConsumableArray(src)));

      target.replaceChildren.apply(target, _toConsumableArray2(target.children).concat(_toConsumableArray2(src)));
      return target;
    }

    if (src === Object.prototype) throw new Error("Object prototype");
    var descriptors = areDescriptors(src) ? src : Object.getOwnPropertyDescriptors(src);
    Reflect.ownKeys(descriptors).filter(function (key) {
      return !exclude.includes(key);
    }).forEach(function (key) {
      var desc = descriptors[key];
      var type = "value" in desc ? "value" : "get" in desc ? "get" : "set";
      if (binder) desc[type] = key === "constructor" || key === "set" ? desc[type] : thiss.bindIt(desc[type], binder);
      var targetDesc = Object.getOwnPropertyDescriptor(target, key);

      if (targetDesc && targetDesc.configurable === false && targetDesc.writable === false && !callback) {
        delete descriptors[key];
        return;
      }

      if (targetDesc && targetDesc.configurable === false && !callback) {
        var val;

        try {
          val = Reflect.get(targetDesc, type, target);
        } catch (_unused7) {
          val = Reflect.get(targetDesc, type, src);
        }

        if (val && typeof val === "function" && binder) val = val.bind(binder);
        target[key] = val;
        delete descriptors[key];
        return;
      }

      var throwThis;

      try {
        var cbResult;

        if (callback) {
          cbResult = callback(key, desc, target);
          desc = cbResult === true ? desc : cbResult && _typeof2(cbResult) === "object" && !Array.isArray(cbResult) && !cbResult instanceof Error ? cbResult : desc;

          if (cbResult instanceof Error || typeof cbResult === "string") {
            throwThis = cbResult;
            desc = undefined;
          }
        }
      } catch (err) {
        if (err) console.error(err);
        if (throwThis) throw throwThis;
      }
    });
    Object.defineProperties(target, descriptors);
    return target;
  }),
  clone: function clone(obj) {
    var withProto = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var exclude = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var binder = arguments.length > 3 ? arguments[3] : undefined;

    if (typeof obj === "function") {
      var backup;
      if (exclude.length || arguments[1] === false) backup = Object.setPrototypeOf(Object.getOwnPropertyDescriptors(obj), Object.getPrototypeOf(obj));
      obj = this.cloneFunc(obj, function () {
        return obj.apply(void 0, arguments);
      }, binder);
      if (arguments[1] === false) Object.setPrototypeOf(obj, Object.getPrototypeOf(backup));
      if (exclude.length) exclude.forEach(function (ex) {
        return Object.defineProperty(obj, ex, backup[ex]);
      });
    }

    var cb = typeof exclude === "function" ? exclude : undefined;
    var constructorName = capitalize(thiss._typeof(obj));
    var typeConstructor = _global[constructorName];
    var target;
    var arg;

    if (Symbol.iterator in obj) {
      if (Array.isArray(obj)) target = _toConsumableArray2(obj).filter(function (item) {
        return !exclude.includes(item);
      });else if (obj instanceof String) {
        if (Object(obj) !== obj) return obj;
        target = Object.setPrototypeOf(String(Object(obj).toString()), Object.getPrototypeOf(obj));
      } else {
        var argSpread = _toConsumableArray2(obj);

        arg = _toConsumableArray2(argSpread.entries());

        if (arg.every(function (ent) {
          return Array.isArray(ent[1]);
        })) {
          arg = arg.map(function (ent) {
            if (exclude.includes(ent[1][1])) return false;
            return ent[1];
          }).filter(Boolean);
        } else if (arg.every(function (ent, ind) {
          return obj.hasOwnProperty(ind) && ent[1] === obj[ind];
        })) // if it's a numeric key
          arg = arg.filter(function (ent) {
            return !exclude.includes(ent[1]);
          });

        var consTarget = thiss.suppress(function () {
          return new obj.constructor(arg);
        }, false);
        if (consTarget && JSON.stringify(_toConsumableArray2(consTarget)) === JSON.stringify(arg)) target = consTarget;else {
          var typeTarget = new typeConstructor(arg);
          if (typeTarget && JSON.stringify(_toConsumableArray2(typeTarget)) === JSON.stringify(arg)) target = typeTarget;
        }
      }
    }

    target = target || thiss.suppress(function () {
      return new obj.constructor();
    }, new typeConstructor());
    if (withProto) proto.set(target, proto.get(obj));
    var descs = Object.getOwnPropertyDescriptors(obj);
    if (withProto) proto.set(descs, proto.get(obj));

    if (typeof exclude !== "function") {
      if (exclude.length) Reflect.ownKeys(obj).forEach(function (key) {
        if (exclude.includes(key)) delete descs[key];
      });
      return Object.defineProperties(target, descs);
    }

    Object.entries(descs).forEach(function (_ref7) {
      var _ref8 = _slicedToArray(_ref7, 2),
          key = _ref8[0],
          desc = _ref8[1];

      if (cb) descs[key] = cb(key, desc, obj) || descs[key]; // if (binder) descs[key] = boundDescriptor(obj,key,binder);
    });
    return Object.defineProperties(target, descs);
  },
  getClone: function getClone(obj, merge) {
    var thiss = this;
    var cloned = merge || this.clone(obj, true, Reflect.ownKeys(obj));

    function updateProps() {
      Reflect.ownKeys(obj).forEach(function (key) {
        if (!Reflect.has(cloned, key)) {
          var desc = Object.getOwnPropertyDescriptor(obj, key);
          Object.defineProperties(cloned, key, {
            get: function get() {
              return obj[key];
            },
            set: function set(val) {
              return !!(obj[key] = val);
            },
            enumerable: desc.enumerable,
            configurable: true
          });
        }
      });
      Reflect.ownKeys(cloned).forEach(function (key) {
        if (!Reflect.has(obj, key)) try {
          Reflect.deleteProperty(clone, key);
        } catch (_unused8) {}
      });
    }

    Reflect.ownKeys(obj).forEach(function (key) {
      var desc = Object.getOwnPropertyDescriptor(obj, key);
      var cloneDesc = Object.getOwnPropertyDescriptor(cloned, key);
      if (cloneDesc && cloneDesc.configurable === false && cloneDesc.writable === false) return;else if (cloneDesc && cloneDesc.configurable === false) {
        try {
          cloned[key] = obj[key];
        } catch (_unused9) {}

        return;
      }
      Object.defineProperty(cloned, key, {
        get: function get() {
          updateProps();
          if (!Reflect.has(obj, key)) Reflect.deleteProperty(cloned, key);
          return obj[key];
        },
        set: function set(val) {
          Reflect.set(obj, key, val);
          updateProps();
          return true;
        },
        configurable: true,
        enumerable: desc.enumerable
      });
    });
    var getCloneHandler = {};
    Reflect.ownKeys(Reflect).forEach(function (key) {
      return getCloneHandler[key] = function () {
        var _this$defaults;

        updateProps();
        return (_this$defaults = this.defaults)[key].apply(_this$defaults, arguments);
      };
    });
    Object.setPrototypeOf(cloned, _Proxy({
      target: obj,
      virtualTarget: Object.getPrototypeOf(obj),
      handler: getCloneHandler
    }));
    return cloned;
  },
  getLevel: function getLevel(obj, cb) {
    var level = obj;
    var success = false;
    if (typeof level === "undefined") return;

    var loop = function loop() {
      level = proto.set({}, level);

      while (level = proto.get(level)) {
        if (typeof level === "undefined") return;
        var result = cb(level);

        if (result) {
          success = true;
          return level;
        }
      }
    };

    loop();
    return success ? level : undefined;
  },
  getLevels: function getLevels(ob) {
    var levels = new Set();
    this.getLevel(ob, function (lvl) {
      if (!lvl) return true;
      levels.add(lvl.constructor);
    });
    var lvls = Array.from(levels);

    lvls.strings = function () {
      return lvls.map(function (lvl) {
        return lvl.constructor.name;
      });
    };
  },
  getDescriptor: function getDescriptor(obj, prop) {
    var level = this.getLevel(obj, function (lvl) {
      return lvl && lvl.hasOwnProperty(prop);
    });
    return level ? new Descriptor(level, prop) : undefined;
  },
  descriptorValue: function descriptorValue(obj, prop) {
    if (!obj) return;
    var desc;
    if (arguments.length === 1 && ("get" in obj || "value" in obj)) desc = obj;
    desc = desc || Object.getOwnPropertyDescriptor(obj, prop);
    if (!desc) return;
    return desc.hasOwnProperty("get") ? desc.get : desc.value;
  },
  getStackTrace: function getStackTrace() {
    return new Problem().log;
  },

  /*
  function commandLine(command) {
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
  safe: function (_safe) {
    function safe(_x8) {
      return _safe.apply(this, arguments);
    }

    safe.toString = function () {
      return _safe.toString();
    };

    return safe;
  }(function (ob) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "get";
    var props = [];

    var safeProx = _Proxy()(ob, {
      get: function get(ob, prop) {
        if (prop !== "done" && prop !== "setVal") props.push(prop);
        ob = ob["{{target}}"] || ob;

        if (prop === "done" || prop === "setVal") {
          return function (val) {
            if (val) {
              prop = last(props);
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
      set: function set(ob, prop, val) {
        ob[prop] = typeof ob[prop] === "undefined" ? ob[prop] : val;
        return true;
      }
    }); // if (typeof ob !== 'object' && typeof ob !== 'function')
    // return ob


    return safeProx;
  })
};