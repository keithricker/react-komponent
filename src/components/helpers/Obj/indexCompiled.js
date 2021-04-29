"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _typeof3 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var helpers = _interopRequireWildcard(require("./helpersCompiled"));

var _ProxyCompiled = _interopRequireDefault(require("../_ProxyCompiled"));

var _privateVariablesCompiled = _interopRequireDefault(require("../../Komponent/privateVariablesCompiled"));

var _ModuleCompiled = _interopRequireDefault(require("../ModuleCompiled"));

var theMod = (0, _ModuleCompiled["default"])(module);

var _theMod$import$onDema = theMod["import"].onDemand('../utilsCompiled'),
    clone = _theMod$import$onDema.clone,
    merge = _theMod$import$onDema.merge,
    _typeof = _theMod$import$onDema._typeof,
    _getLevel = _theMod$import$onDema.getLevel,
    ReflectBind = _theMod$import$onDema.ReflectBind;

var privKeys = new WeakMap();

function suppress(cb, def) {
  try {
    return cb();
  } catch (_unused) {
    return def;
  }
}

function utilTypes() {
  return require("util").types;
}

var subj = {};
subj.thiss = subj;
subj.jello = 'fellow';
Object.defineProperties(subj, {
  hello: {
    get: function get() {
      return 'hello';
    },
    set: function set(val) {
      this.jello = 'mellow', Object.defineProperty(this, 'hello', {
        value: val
      });
      return true;
    },
    configurable: true
  }
}); // let object = new (function hello() {})()

var object = {};
object.i = 'have a prop';

var cb = function cb() {
  var _ref;

  return _ref = {}, (0, _defineProperty2["default"])(_ref, prototype, {
    "this": 'is',
    so: 'fun'
  }), (0, _defineProperty2["default"])(_ref, "thiss", this), (0, _defineProperty2["default"])(_ref, "getThis", function getThis() {
    return this;
  }), (0, _defineProperty2["default"])(_ref, "hello", "flagrant hello!"), (0, _defineProperty2["default"])(_ref, "melloww", 'wellow'), (0, _defineProperty2["default"])(_ref, "mister", this.melloww), (0, _defineProperty2["default"])(_ref, name, 'fuckingawesome'), (0, _defineProperty2["default"])(_ref, descriptors, {
    mister: {
      configurable: false,
      writable: false
    }
  }), _ref;
};

var constr = new helpers.Constructor(cb);
console.log('ConstructorCall', constr.call(object));

var is = function () {
  function mod(str) {
    str = str.toLowerCase();
    var spl = str.split("is");
    if (spl[1] && spl[0] === "") return spl[1];
    return str;
  }

  ;
  var is = {};
  var types = ["undefined", "object", "boolean", "number", "bigint", "string", "symbol", "function", "object"];
  var izHandler = {
    get: function get(ob, prop) {
      var _this = this;

      if (prop === "{{handler}}") return this;
      var propMatch = (0, _toConsumableArray2["default"])(new Set([].concat((0, _toConsumableArray2["default"])(Reflect.ownKeys(proto.get(ob))), (0, _toConsumableArray2["default"])(Reflect.ownKeys(ob))))).find(function (key) {
        return mod(prop) === mod(key);
      });
      if (propMatch) return ob[propMatch];
      propMatch = types.includes(mod(prop)) && prop;

      var obType = _typeof(ob).toLowerCase();

      var matchKeys = Reflect.ownKeys(Global).filter(function (key) {
        return !!_this["class"](Global[key]);
      });
      propMatch = matchKeys.find(function (key) {
        return mod(key) === mod(prop);
      }) || propMatch;
      if (propMatch) return !!(mod(propMatch) === _typeof(ob).toLowerCase()) || (0, _typeof3["default"])(ob) === mod(propMatch);
      return prop in ob ? ob[prop] : Function.prototype[prop];
    }
  };
  merge(is, {
    promise: function promise(obj) {
      return utilTypes().isPromise(obj) || (0, _typeof3["default"])(obj) === "object" && obj instanceof Promise;
    },
    json: function json(data) {
      if (utilTypes().isJSON()) return utilTypes().isJSON(data);
      if (typeof data !== "string") return false;
      data = data.trim();
      var match = data.match(/\{[^{}]+\}/) || [];
      return match[0] === data;
    },
    url: function url(_url) {
      if (utilTypes().isURL()) return utilTypes().isURL(_url);
      if (typeof _url !== "string") return false;
      if (!isURL.pattern) isURL.pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
      return isURL.pattern.test(_url) ? true : false;
    },
    defined: function defined(arg) {
      return typeof arg !== "undefined";
    },
    empty: function empty(ob) {
      if (utilTypes().isEmpty()) return utilTypes().isEmpty(ob);
      if (ob[Symbol.iterator]) return !(0, _toConsumableArray2["default"])(ob).length;
      if (this.object(ob) || typeof ob === 'function') return !Reflect.ownKeys(ob).length;
      return !Object(ob).length;
    },
    "class": function _class(func) {
      if (utilTypes().isClass()) return utilTypes().isClass(ob);

      var classText = function classText(str) {
        return str.trim().split(" ")[0] === "class";
      };

      var funcString = func.toString().toLowerCase();
      if (classText(funcString)) return true;
      var call = suppress(function () {
        return func();
      });
      return call && call.message && classText(call.message.toLowerCase()) ? true : false;
    },
    object: function object(ob) {
      return (0, _typeof3["default"])(ob) === 'object' && !this.arrayLikeObject(ob) && Object(ob) === ob;
    },
    array: function array(ob) {
      return Array.isArray(ob);
    },
    arrayLikeObject: function arrayLikeObject(obj) {
      if (!obj[Symbol.iterator]) return false;
      var argSpread = (0, _toConsumableArray2["default"])(obj);
      var arg = (0, _toConsumableArray2["default"])(argSpread.entries());
      return arg.every(function (ent, ind) {
        return obj.hasOwnProperty(ind) && ent[1] === obj[ind];
      });
    },
    instanceOf: function instanceOf(ob) {
      var last = function last(arr) {
        return (0, _toConsumableArray2["default"])(arr)[arr.length - 1];
      };

      for (var _len = arguments.length, arg = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        arg[_key - 1] = arguments[_key];
      }

      if (arg.length > 1) {
        var op = ["all", "some", "and", "or"].includes(last(arg)) ? last(arg) : "all";
        var res = arg.filter(function (ar) {
          return ob instanceof ar;
        });
        if (["all", "and"].includes(op)) return !!(res.length === arg.length);
        if (["some", "or"].includes(op)) return !!res.length;
      }

      return ob instanceof arg[0];
    },
    equivalent: function equivalent(ob1, ob2) {
      ob1 = arguments.length === 1 ? this : ob1;
      ob2 = ob2 || ob1;
      if (ob1 == ob2 && (0, _typeof3["default"])(ob1) === (0, _typeof3["default"])(ob2)) return true;
      if ((0, _typeof3["default"])(ob1) !== (0, _typeof3["default"])(ob2)) return false;
      ob1 = Object(ob1);
      ob2 = Object(ob2);
      if (Reflect.ownKeys(ob1).length !== Reflect.ownKeys(ob2).length) return false;
      if (suppress(function () {
        return ob1.toString() !== ob2.toString();
      }, true)) return false;
      return JSON.stringify(Reflect.ownKeys(ob1)) === JSON.stringify(Reflect.ownKeys(ob2)) && Reflect.ownKeys(ob1).every(function (key) {
        return ob1[key] === ob2[key];
      }) && entries(Object.getOwnPropertyDescriptors(ob1)).every(function (_ref2) {
        var _ref3 = (0, _slicedToArray2["default"])(_ref2, 2),
            key = _ref3[0],
            desc = _ref3[1];

        return JSON.stringify(desc) === JSON.stringify(Object.getOwnPropertyDescriptor(ob2, key));
      });
    },
    descriptor: function descriptor(desc) {
      if (!this.validDescriptor(desc)) return false;
      var def = Object.defineProperty({}, "prop", desc);
      var newDesc = Object.getOwnPropertyDescriptor(def, "prop");
      return this.equivalent(desc, newDesc);
    },
    validDescriptor: function validDescriptor(desc) {
      if ((0, _typeof3["default"])(desc) !== "object") return false;
      return suppress(function () {
        var isDescriptor = true;
        var defined = Object.defineProperty({}, "prop", desc);
        var described = Object.getOwnPropertyDescriptor(defined, "prop");
        if (desc.value) return desc.value === defined.prop;
        if (desc.get) isDescriptor = desc.get === described.get;
        if (desc.set) isDescriptor = desc.set === described.set;
        return isDescriptor;
      }, false);
    },
    descriptors: function descriptors(ob) {
      if (ob.constructor.name === 'Descriptors') return true;
      var keys = Reflect.ownKeys(ob);
      if (!ob.length || !keys.every(function (key) {
        return isNaN(key);
      })) return false;
      var copy = Object.getOwnPropertyDescriptors(Object.defineProperties({}, ob));
      return JSON.stringify(ob) === JSON.stringify(copy);
    },
    numeric: function numeric(num) {
      return !isNaN(num);
    },
    bind: function bind() {
      for (var _len2 = arguments.length, bind = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        bind[_key2] = arguments[_key2];
      }

      var boundIs = {};
      Reflect.ownKeys(is).filter(function (key) {
        return typeof is[key] === 'function';
      }).forEach(function (key) {
        var _is$key;

        boundIs[key] = (_is$key = is[key]).bind.apply(_is$key, [null].concat(bind));
      });
      return new Proxy(boundIs, izHandler);
    },
    proxy: function proxy(prox) {
      var isProx = false;

      try {
        Map.prototype.get(prox, 'property');
      } catch (_unused2) {}
    }
  });
  Object.setPrototypeOf(is, utilTypes());
  iz = new Proxy(is, izHandler);

  function isFunc(ob) {
    return iz.bind(ob);
  }

  Object.setPrototypeOf(isFunc, iz);
  return isFunc;
}();

var proto = {
  get: Object.getPrototypeOf,
  set: Object.setProrotypeOf
};

var _if = function _if(exp, then) {
  exp = exp();
  if (typeof then === "function") return then(exp);
  return exp || then;
};

var Obj = function Obj(obj) {
  obj = Object(obj);
  if ((0, _privateVariablesCompiled["default"])(obj).Obj) return (0, _privateVariablesCompiled["default"])(obj).Obj;
  var iz = is;

  var Obj = function Obj() {
    return {
      get priv() {
        var thisPriv;
        if (!privKeys.has(this)) privKeys.set(this, {
          key: undefined
        });

        if (!_privateVariablesCompiled["default"].has(this)) {
          console.log('they dont have me!');
          thisPriv = (0, _privateVariablesCompiled["default"])(this);
          var rando = thisPriv.randomString;
          privKeys.get(this).key = rando;
        }

        return (0, _privateVariablesCompiled["default"])(this);
      },

      set priv(val) {
        var thisPriv = Object.getOwnPropertyDescriptor(this, 'priv').get.call(this);
        var randoString = privKeys.get(this).key;
        var props = thisPriv['{{target}}'][randoString];
        if (props && val) mergeProps(props, val);
        return true;
      },

      get extends() {
        return Object.getPrototypeOf(this.constructor) === 'Function' ? Object : Object.getPrototypeOf(this.constructor);
      },

      ownProp: function ownProp(prop) {
        return Reflect.ownKeys(this).includes(prop);
      },
      has: function has(prop) {
        return Reflect.has(this, prop);
      },

      get keys() {
        return Reflect.ownKeys(this);
      },

      get type() {
        return Array.isArray(this) ? "array" : (0, _typeof3["default"])(this);
      },

      get _type() {
        var tp = _type.bind(null, this);

        tp["class"] = _type["class"].bind(null, this);
        return tp;
      },

      getLevel: function getLevel() {
        for (var _len3 = arguments.length, arg = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          arg[_key3] = arguments[_key3];
        }

        return _getLevel.apply(void 0, [this].concat(arg));
      },
      tree: function tree() {
        var levels = {};
        this.getLevel.call(this, function (lvl) {
          if (!lvl) return true;
          if (!lvl.constructor) return false;
          levels[lvl.constructor.name] = lvl.constructor;
        });
        Object.setPrototypeOf(levels, {
          get reversed() {
            var reversed = {};
            Object.keys(levels).reverse().forEach(function (key) {
              return reversed[key] = levels[key];
            });
            return reversed;
          }

        });
        return levels;
      },
      descriptor: function descriptor() {
        for (var _len4 = arguments.length, arg = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          arg[_key4] = arguments[_key4];
        }

        return helpers.getDescriptor.apply(helpers, [this].concat(arg));
      },
      descriptors: function descriptors() {
        for (var _len5 = arguments.length, arg = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
          arg[_key5] = arguments[_key5];
        }

        return helpers.getDescriptors.apply(helpers, [this].concat(arg));
      },

      get entries() {
        return helpers.entries.bind(null, this);
      },

      size: function size() {
        var _this2 = this;

        var enumerable = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        var symb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var self = this;
        if ("size" in this && !isNaN(this.size)) return this.size;
        if (typeof this === "string") return this.length;
        if (suppress(function () {
          self = (0, _toConsumableArray2["default"])(_this2);
          return self;
        }), false) return self.length;
        self = Object(self);
        self = suppress(function () {
          var res = Object.fromEntries(self);
          return res || self;
        }, self);
        return enumerable && symb ? Reflect.ownKeys(self).length : enumerable ? Object.getOwnPropertyNames(self).length : Object.keys(self).length;
      },
      clear: function clear() {
        var _this3 = this;

        if (this[Symbol.iterator] && this.clear) {
          this.clear();
          return this;
        }

        Reflect.ownKeys(this).forEach(function (key) {
          try {
            delete _this3[key];
          } catch (err) {
            console.error(err);
          }
        });
      },
      forEach: function forEach(cb) {
        var _Object$getPrototypeO;

        if ('forEach' in Object.getPrototypeOf(this)) return (_Object$getPrototypeO = Object.getPrototypeOf(this)).forEach.apply(_Object$getPrototypeO, arguments);
        var self = this;
        Reflect.ownKeys(this).forEach(function (key, ind) {
          return cb.call(self, key, self[key], ind, self);
        });
      },
      filter: function filter(filtered, cb) {
        var _proto$get;

        if ('filter' in proto.get(this)) return (_proto$get = proto.get(this)).filter.apply(_proto$get, arguments);
        cb = cb || filtered;
        filtered = arguments[1] ? filtered : clone(this, true, Reflect.ownKeys(this));
        Reflect.ownKeys(this).forEach(function (key, ind) {
          var res = cb.call(filtered, key, this[key], ind, filtered);
          if (res === true) filtered[key] = res;
        }.bind(this));
        return filtered;
      },
      map: function map(mapped, cb) {
        cb = cb || mapped;
        var self = this;
        if (proto.get(this).hasOwnProperty("map")) return proto.get(this).map.bind(this);
        mapped = arguments[1] ? mapped : clone(this, true, Reflect.ownKeys(this));
        Reflect.ownKeys(this).forEach(function (key, ind) {
          var res = cb.call(mapped, key, self[key], ind, mapped);
          var desc = iz.descriptor(res) ? res : {
            value: res,
            enumerable: true,
            configurable: true
          };
          helpers.defineProp(mapped, key, desc);
        });
        return mapped;
      },
      asMap: function asMap() {
        return utils.ObjectMap(this);
      },
      defineProp: function defineProp() {
        for (var _len6 = arguments.length, arg = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
          arg[_key6] = arguments[_key6];
        }

        return helpers.defineProp.apply(helpers, [this].concat(arg));
      },
      defineProps: function defineProps() {
        for (var _len7 = arguments.length, arg = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
          arg[_key7] = arguments[_key7];
        }

        return helpers.defineProps.apply(helpers, [this].concat(arg));
      },
      reverseLookup: function reverseLookup(val) {
        var key;
        var lvl = this.getLevel(this, function (lv) {
          if (val.name && Reflect.ownKeys(lvl).includes(val.name) && iz.equivalent(val, lvl[val.name], false)) key = val.name;
          Reflect.ownKeys(lv).some(function (pr) {
            key = iz.equivalent(val, lv[pr]) && pr;
          });
          if (key) return true;
        });
        return key;
      },
      mixin: function mixin(mix, target) {
        return helpers.mixin(this, mix);
      },
      bind: function bind(target) {
        return helpers.boundObject.apply(helpers, [this].concat(Array.prototype.slice.call(arguments)));
      },
      boundProperty: function boundProperty(prop, bind) {
        return ReflectBind.get(this, prop, bind);
      },
      boundDescriptor: function boundDescriptor(desc) {
        return helpers.boundDescriptor(desc, this);
      },
      mirror: function mirror(trg, bnd) {
        var bind = function bind() {
          var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : trg;
          return bnd || target !== bnd && trg;
        };

        trg = trg || clone(this, true, Reflect.ownKeys(this));
        return merge(trg, this, function (key, desc) {
          delete desc.value;
          delete desc.writable;

          desc.get = function () {
            return ReflectBind.get(this, key, bind);
          };

          return desc;
        });
      },

      get backup() {
        var bu = helpers.backup.bind(null, this);
        bu.restore = helpers.resore.bind(null, bu);
      },

      clone: function clone() {
        var _utils;

        for (var _len8 = arguments.length, arg = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
          arg[_key8] = arguments[_key8];
        }

        return (_utils = utils).clone.apply(_utils, [this].concat(arg));
      },
      merge: function merge() {
        var _utils2;

        for (var _len9 = arguments.length, arg = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
          arg[_key9] = arguments[_key9];
        }

        return (_utils2 = utils).merge.apply(_utils2, [this].concat(arg));
      },

      get is() {
        if ((0, _privateVariablesCompiled["default"])(this).is) return (0, _privateVariablesCompiled["default"])(this).is;
        (0, _privateVariablesCompiled["default"])(this).is = iz(this);
        return (0, _privateVariablesCompiled["default"])(this).iz;
      },

      equivalent: function equivalent(obj) {
        return iz.equivalent(obj, this);
      },

      get proto() {
        return Object.getPrototypeOf(this);
      },

      set proto(val) {
        return Object.setPrototypeOf(this, val);
      }

    };
  };

  (0, _privateVariablesCompiled["default"])(obj).Obj = helpers.boundObject(obj, Obj);
  return (0, _privateVariablesCompiled["default"])(obj).Obj;
};

var thingobj = Obj({
  i: 'have props'
});
console.log('thepriv', thingobj.priv);
thingobj.priv.hello = 'jello';
console.log('thingobjprivhello', thingobj.priv.hello);
console.log(Reflect.ownKeys(thingobj.priv));
merge(module.exports, {
  get Obj() {
    return Obj;
  },

  get is() {
    return is;
  },

  get Descriptors() {
    return require('./helpersCompiled').Descriptors;
  }

});
console.log('helo', module.exports);