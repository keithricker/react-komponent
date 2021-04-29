"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _construct2 = _interopRequireDefault(require("@babel/runtime/helpers/construct"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _typeof3 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapNativeSuper"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _indexCompiled = require("./Obj/indexCompiled.js");

var _arguments = arguments;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

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
  var fetched = _arguments.length === 2 ? ob : Reflect.get.apply(Reflect, (0, _toConsumableArray2["default"])([ob, prop].concat((0, _toConsumableArray2["default"])(bnd)).filter(Boolean)));
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
    (0, _classCallCheck2["default"])(this, mapKey);

    var _mapKey = Symbol(text || key.name || key.constructor.name || 'mapKey');

    keys(object).set(key, _mapKey);
    return _mapKey;
  };

  var _Map = /*#__PURE__*/function (_Map2) {
    (0, _inherits2["default"])(_Map, _Map2);

    var _super = _createSuper(_Map);

    function _Map() {
      var _this;

      (0, _classCallCheck2["default"])(this, _Map);
      var entr;
      var obj;

      if (arguments.length) {
        if (arguments.length === 1 && (0, _typeof3["default"])(arguments.length <= 0 ? undefined : arguments[0]) === 'object' && !Array.isArray(arguments.length <= 0 ? undefined : arguments[0])) {
          entr = entries(arguments.length <= 0 ? undefined : arguments[0]);
          obj = arguments.length <= 0 ? undefined : arguments[0];
        } else if ((arguments.length <= 0 ? undefined : arguments[0]) instanceof Map) entr = (0, _toConsumableArray2["default"])(arguments.length <= 0 ? undefined : arguments[0]);else entr = arguments.length <= 0 ? undefined : arguments[0];
      }

      _this = _super.call(this, entr);
      Object.defineProperty((0, _assertThisInitialized2["default"])(_this), '_entries', {
        get: function get() {
          if (!priv((0, _assertThisInitialized2["default"])(_this)).newTarget) {
            entrs = entries(priv((0, _assertThisInitialized2["default"])(_this)).object);
            entrs.forEach(function (_ref) {
              var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
                  key = _ref2[0],
                  val = _ref2[1];

              if (key instanceof mapKey) entr[0] = _this.keyFromSymbol(priv((0, _assertThisInitialized2["default"])(_this)).object, key);
            });
          }

          return entrs;
        }
      });
      var object;
      Object.defineProperty(priv((0, _assertThisInitialized2["default"])(_this)), 'object', {
        get: function get() {
          object = obj && !priv(this).newTarget ? obj : this.asObject();
          priv(object).map = this;
          return object;
        },
        configurable: true
      });
      return _this;
    }

    (0, _createClass2["default"])(_Map, [{
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
          var _ref4 = (0, _slicedToArray2["default"])(_ref3, 2),
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
          key = typeof key === 'string' || (0, _typeof3["default"])(key) === 'symbol' ? key : (0, _construct2["default"])(mapKey, (0, _toConsumableArray2["default"])([priv(this).object, key, typeof alt === 'string' && alt].filter(Boolean)));
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
          if (objConstructor.prototype[Symbol.iterator]) argus = Array.isArray(obj) ? [obj] : [(0, _toConsumableArray2["default"])(obj)];

          if (objConstructor === constructor) {
            obj = (0, _construct2["default"])(constructor, (0, _toConsumableArray2["default"])(argus));
          } else try {
            obj = new constructor();
            if (obj[Symbol.iterator]) Object.defineProperties(obj, Object.getOwnPropertyDescriptors(this._entries));
          } catch (_unused2) {
            obj = (0, _construct2["default"])(objConstructor, (0, _toConsumableArray2["default"])(argus));
          }
        }

        Object.setPrototypeOf(obj, Object.setPrototypeOf((0, _indexCompiled.boundProperties)(Map.prototype, this), prototype));

        if (!obj[Symbol.iterator]) {
          var newDescs = {};

          this._entries.forEach(function (ent) {
            var key = ent[0];
            key = typeof key === 'string' || (0, _typeof3["default"])(key) === 'symbol' ? key : new mapKey(obj, key);
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

        return (0, _toConsumableArray2["default"])(keys(ob)).find(function (_ref5) {
          var _ref6 = (0, _slicedToArray2["default"])(_ref5, 2),
              key = _ref6[0],
              val = _ref6[1];

          return val === sym ? key : undefined;
        });
      }
    }]);
    return _Map;
  }( /*#__PURE__*/(0, _wrapNativeSuper2["default"])(Map));

  var map = _Map;

  _Map = function _target() {
    for (var _len2 = arguments.length, arg = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      arg[_key2] = arguments[_key2];
    }

    var newMap = (0, _construct2["default"])(map, arg);
    priv(newMap).newTarget = this instanceof _target ? this.constructor : void 0;
  };

  Object.defineProperties(_Map, Object.getOwnPropertyDescriptors(map));
  Object.setPrototypeOf(_Map, map);
}();