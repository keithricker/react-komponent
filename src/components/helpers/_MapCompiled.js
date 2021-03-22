"use strict";

var _Obj = require("./Obj");

var _arguments = arguments;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof2(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof2(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var or = function or(thing) {
  for (var _len = arguments.length, conditions = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    conditions[_key - 1] = arguments[_key];
  }

  return conditions.some(function (cond) {
    return thing === cond;
  });
};

function entries(obj) {
  return Reflect.ownKeys(obj).map(function (key) {
    var ent = [key, ''];
    Object.defineProperty(ent, 1, Object.getOwnPropertyDescriptor(obj, key));
    return ent;
  });
}

var bindIt = function bindIt(ob, prop, bnd) {
  bnd = _arguments.length === 2 ? prop : bnd;
  var fetched = _arguments.length === 2 ? ob : Reflect.get.apply(Reflect, _toConsumableArray([ob, prop].concat(_toConsumableArray(bnd)).filter(Boolean)));
  return typeof fetched === 'function' ? typeof bnd !== 'undefined' ? fetched.bind(bnd) : fetched : fetched;
};

var _typeof = function _typeof(ob) {
  return {}.toString.call(ob).split('[object ')[1].split("]")[0];
};

_typeof["class"] = function (ob) {
  return _global[_typeof(ob)];
};

var _Map = function () {
  var keyz = vars(_Map).keys = new WeakMap();

  function keys(ob) {
    if (!keyz.has(ob)) {
      var def = new Map();
      keyz.set(ob, def);
      return def;
    }

    return keys.get(ob);
  }

  var mapKey = function mapKey(object, key, text) {
    _classCallCheck(this, mapKey);

    var _mapKey = Symbol(text || key.name || key.constructor.name || 'mapKey');

    keys(object).set(key, _mapKey);
    return _mapKey;
  };

  var _Map = /*#__PURE__*/function (_Map2) {
    _inherits(_Map, _Map2);

    var _super = _createSuper(_Map);

    function _Map() {
      var _this;

      _classCallCheck(this, _Map);

      var entr;
      var obj;

      if (arguments.length) {
        if (arguments.length === 1 && _typeof2(arguments.length <= 0 ? undefined : arguments[0]) === 'object' && !Array.isArray(arguments.length <= 0 ? undefined : arguments[0])) {
          entr = entries(arguments.length <= 0 ? undefined : arguments[0]);
          obj = arguments.length <= 0 ? undefined : arguments[0];
        } else if ((arguments.length <= 0 ? undefined : arguments[0]) instanceof Map) entr = _toConsumableArray(arguments.length <= 0 ? undefined : arguments[0]);else entr = arguments.length <= 0 ? undefined : arguments[0];
      }

      _this = _super.call(this, entr);
      Object.defineProperty(_assertThisInitialized(_this), '_entries', {
        get: function get() {
          if (!priv(_assertThisInitialized(_this)).newTarget) {
            entrs = entries(priv(_assertThisInitialized(_this)).object);
            entrs.forEach(function (_ref) {
              var _ref2 = _slicedToArray(_ref, 2),
                  key = _ref2[0],
                  val = _ref2[1];

              if (key instanceof mapKey) entr[0] = _this.keyFromSymbol(priv(_assertThisInitialized(_this)).object, key);
            });
          }

          return entrs;
        }
      });
      var object;
      Object.defineProperty(priv(_assertThisInitialized(_this)), 'object', {
        get: function get() {
          object = obj && !priv(this).newTarget ? obj : this.asObject();
          priv(object).map = this;
          return object;
        },
        configurable: true
      });
      return _this;
    }

    _createClass(_Map, [{
      key: "clear",
      value: function clear() {
        var _this2 = this;

        Map.prototype.clear.call(this);
        this._entries = [];
        if (!this.newTarget) Reflect.ownKeys(priv(this).object).forEach(function (key) {
          return delete priv(_this2).object[key];
        });
      }
    }, {
      key: "delete",
      value: function _delete(key) {
        if (key instanceof mapKey) key = this.keyFromSymbol(key);
        Map.prototype["delete"].call(this, key);
        this.entries.splice(this._entries.findIndex(function (item) {
          return item[0] === key;
        }), 1);
        if (!this.newTarget) delete priv(this).object[key];
      }
    }, {
      key: "forEach",
      value: function forEach(cb, ths) {
        var newCb = function newCb(_ref3) {
          var _ref4 = _slicedToArray(_ref3, 2),
              key = _ref4[0],
              val = _ref4[1];

          return cb(val, key);
        };

        return this._entries.forEach(newCb, ths);
      }
    }, {
      key: "get",
      value: function get(key) {
        if (key instanceof mapKey) key = this.keyFromSymbol(key);
        if (!this._entries) return Map.prototype.get.call(this);
        return this._entries.find(function (item) {
          return item[0] === key;
        });
      }
    }, {
      key: "set",
      value: function set(key, val, alt) {
        var _Map$prototype$set;

        if (key instanceof mapKey) key = this.keyFromSymbol(key);

        var mapSet = (_Map$prototype$set = Map.prototype.set).call.apply(_Map$prototype$set, [this].concat(Array.prototype.slice.call(arguments)));

        if (!this._entries) return mapSet;
        var entry = this.get(key);
        if (entry) this["delete"](key);
        var newEntry = arguments.length === 1 && Array.isArray(arguments[1]) ? arguments[1] : arguments.length === 3 && typeof key === 'string' ? Object.defineProperty([key, ''], 1, Object.getOwnPropertyDescriptor(arguments[1], arguments[2])) : [key, val];

        this._entries.push(newEntry);

        if (!this.newTarget) {
          key = typeof key === 'string' || _typeof2(key) === 'symbol' ? key : _construct(mapKey, _toConsumableArray([priv(this).object, key, typeof alt === 'string' && alt].filter(Boolean)));
          Object.defineProperty(priv(this).object, key, Object.getOwnPropertyDescriptor(newEntry, 1));
        }

        return Map.prototype.set(key, val);
      }
    }, {
      key: "has",
      value: function has(key) {
        if (key instanceof mapKey) key = this.keyFromSymbol(key);
        return Map.prototype.has.call(this, key);
      }
    }, {
      key: "keys",
      value: function keys() {
        return this._entries.map(function (ent) {
          return ent[0];
        });
      }
    }, {
      key: "values",
      value: function values() {
        var vals = [];

        this._entries.forEach(function (ent, ind) {
          Object.defineProperty(vals, ind, Object.getOwnPropertyDescriptor(ent, 1));
        });

        return vals;
      }
    }, {
      key: "entries",
      value: function entries() {
        var thiss = this._entries;
        var iterator = {
          current: 0,
          last: thiss.length - 1,
          // 3. next() is called on each iteration by the for..of loop
          next: function next() {
            // 4. it should return the value as an object {done:.., value :...}
            if (iterator.current <= iterator.last) {
              return {
                done: false,
                value: thiss[iterator.current++]
              };
            } else {
              return {
                done: true
              };
            }
          }
        };
        return iterator;
      }
    }, {
      key: Symbol.iterator,
      get: function get() {
        return this.entries;
      }
    }, {
      key: "asObject",
      value: function asObject() {
        var prototype = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Object.prototype;
        if (!priv(this).newTarget) return priv(this).object;
        var constructor = prototype.constructor;
        var obj = constructor === Object ? {} : undefined;

        if (!obj) {
          var pro = Object.create(constructor.prototype);
          var curr = pro;

          while (curr = Object.getPrototypeOf(curr)) {
            if (!obj) try {
              obj = new curr.constructor();
            } catch (_unused) {} else return;
          }

          var objConstructor = _typeof(obj);

          var argus = [];
          if (objConstructor.prototype[Symbol.iterator]) argus = Array.isArray(obj) ? [obj] : [_toConsumableArray(obj)];

          if (objConstructor === constructor) {
            obj = _construct(constructor, _toConsumableArray(argus));
          } else try {
            obj = new constructor();
            if (obj[Symbol.iterator]) Object.defineProperties(obj, Object.getOwnPropertyDescriptors(this._entries));
          } catch (_unused2) {
            obj = _construct(objConstructor, _toConsumableArray(argus));
          }
        }

        Object.setPrototypeOf(obj, Object.setPrototypeOf((0, _Obj.boundProperties)(Map.prototype, this), prototype));

        if (!obj[Symbol.iterator]) {
          var newDescs = {};

          this._entries.forEach(function (ent) {
            var key = ent[0];
            key = typeof key === 'string' || _typeof2(key) === 'symbol' ? key : new mapKey(obj, key);
            newDescs[key] = Object.getOwnPropertyDescriptor(ent, 1);
          });

          Object.defineProperties(obj, newDescs);
        }

        priv(obj).map = this;
        return obj;
      }
    }, {
      key: "symbolFromKey",
      value: function symbolFromKey(ob, key) {
        if (arguments.length === 1) {
          key = ob;
          ob = priv(this).object;
        }

        return keys(ob).get(key);
      }
    }, {
      key: "keyFromSymbol",
      value: function keyFromSymbol(ob, sym) {
        if (arguments.length === 1) {
          sym = ob;
          ob = priv(this).object;
        }

        return _toConsumableArray(keys(ob)).find(function (_ref5) {
          var _ref6 = _slicedToArray(_ref5, 2),
              key = _ref6[0],
              val = _ref6[1];

          return val === sym ? key : undefined;
        });
      }
    }]);

    return _Map;
  }( /*#__PURE__*/_wrapNativeSuper(Map));

  var map = _Map;

  _Map = function _target() {
    for (var _len2 = arguments.length, arg = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      arg[_key2] = arguments[_key2];
    }

    var newMap = _construct(map, arg);

    priv(newMap).newTarget = this instanceof _target ? this.constructor : void 0;
  };

  Object.defineProperties(_Map, Object.getOwnPropertyDescriptors(map));
  Object.setPrototypeOf(_Map, map);
}();