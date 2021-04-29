"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _construct2 = _interopRequireDefault(require("@babel/runtime/helpers/construct"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _privateVariables = _interopRequireDefault(require("../Komponent/privateVariables"));

var _utils = require("./utils");

var _arguments = arguments;

var objToDescs = function objToDescs(trg) {
  var descs = Object.getOwnPropertyDescriptors(trg);
  return Object.setPrototypeOf(descs, Object.getPrototypeOf(trg));
};

var descsToObj = function descsToObj(desc) {
  return Object.setPrototypeOf(Object.defineProperties({}, desc), Object.getPrototypeOf(desc));
};

function klass(func) {
  var argus = Array.prototype.slice.call(arguments);
  var temp = argus.find(function (ar) {
    return (0, _typeof2["default"])(ar) === 'object';
  }) || {};
  func = argus.find(function (ar) {
    return typeof ar === 'function';
  }) || temp.constructor;
  var name = argus.find(function (ar) {
    return typeof ar === 'string';
  }) || temp.name || func.name;
  var instance, newFunc;
  temp.constructor = temp.constructor || func;
  temp.defaults = {
    name: name,
    constructor: func,

    get extends() {
      if (temp.prototype.constructor === Object || Object.getPrototypeOf(temp.prototype.constructor) === Function) return Object;
      return Object.getPrototypeOf(temp.prototype.constructor);
    },

    set extends(val) {
      Object.defineProperty(temp, 'extends', {
        value: val,
        configurable: true,
        writable: true
      });
    },

    get prototype() {
      if (this["static"] && func.prototype.constructor !== this["static"]) func.prototype.constructor = this["static"];
      return func.prototype;
    },

    set prototype(val) {
      Object.defineProperty(temp, 'prototype', {
        value: val,
        configurable: true,
        writable: true
      });
      return true;
    },

    template: temp
  };

  function props() {
    for (var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++) {
      arg[_key] = arguments[_key];
    }

    var props = (0, _defineProperty2["default"])({
      get _extends() {
        return obj.constructor === Object.getPrototypeOf(obj.constructor) === Function ? Object : Object.getPrototypeOf(obj.constructor);
      },

      set _extends(val) {
        if (obj instanceof val) {
          props._template["extends"] = val;
          return true;
        }

        if (val !== Object) {
          Object.setPrototypeOf(this.constructor, val);
          Object.setPrototypeOf(this.constructor.prototype, val.prototype);
        }

        this._target = (0, _construct2["default"])(val, arg);
        return throwIt(this, this._target, "extends");
      },

      get _name() {
        return props._static.name;
      },

      set _name(val) {
        Object.defineProperty(props._static, 'name', {
          value: val,
          enumerable: true,
          writable: false,
          configurable: true
        });
        return true;
      },

      get priv() {
        return _privateVariables["default"].get(obj);
      },

      set priv(val) {
        var pr = _privateVariables["default"].get(obj) || {};
        obj.mergeIt(pr, val);

        _privateVariables["default"].set(obj, pr);
      },

      set _properties(val) {
        if (props.sets.properties) {
          Reflect.ownKeys(props._template.properties).forEach(function (key) {
            delete obj[key];
          });
        }

        props._template.properties = val;

        var descs = props._descriptors(val, {
          configurable: true
        }, props._template.bind);

        return !!Object.defineProperties(obj, descs);
      },

      get _properties() {
        return obj;
      },

      get _prototype() {
        return Object.getPrototypeOf(obj);
      },

      set _prototype(val) {
        if (props.sets.prototype) val = props._template.prototype;
        props._template.prototype = val;
        return !!props._mergeIt(props._prototype, val);
      },

      get _static() {
        return obj.constructor;
      },

      set _static(val) {
        if (val !== obj.constructor) props._mergeIt(obj.constructor, val);
        props._template["static"] = val;
        return true;
      },

      sets: {},
      _super: function _super() {
        var ext = props._extends;

        for (var _len2 = arguments.length, arg = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          arg[_key2] = arguments[_key2];
        }

        if (arg.length === 0) {
          obj._target = this["{{target}}"] || this;
          return this;
        }

        if (_privateVariables["default"].get(this).newTarget === false) return (0, _construct2["default"])(ext, arg);
        obj._target = (0, _construct2["default"])(ext, arg);

        var superFunc = function superFunc() {
          return obj._target;
        };

        var superTarget = (0, _construct2["default"])(ext, arg);

        var descs = props._descriptors(superTarget, {
          writable: false,
          configurable: false
        }, superTarget);

        props._mergeIt(superFunc, descs);

        Object.setPrototypeOf(superFunc, Object.getPrototypeOf(superTarget));
        throwIt(obj, obj._target, "super");
      },
      _template: new Proxy(obj.constructor._template, {
        get: function get(ob, prop) {
          if (['prototype', 'properties', 'static'].includes(prop)) return descsToObj(ob[prop]);
          return Reflect.set.apply(Reflect, arguments);
        },
        set: function set(ob, prop, val) {
          if (['prototype', 'properties', 'static'].includes(prop)) {
            if (prop === 'sets') return true;
            props.sets[prop] = true;
            return !!(ob[prop] = objToDescs(val));
          }

          return Reflect.set.apply(Reflect, arguments);
        }
      }),
      _descriptors: _utils.descriptors.bind(obj),
      _mergeIt: function _mergeIt(thing1, thing2) {
        var def = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        if (arguments.length === 1) thing1 = obj;

        var descs = props._descriptors(thing2, def);

        return Object.defineProperties(thing1, descs);
      },
      _setIt: function _setIt() {
        for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        if (args.length < 3) args.unshift(obj);
        return Reflect.set.apply(Reflect, args);
      }
    }, '{{klass}}', true);
    Object.defineProperties(props, props._descriptors(props, {
      enumerable: false
    }));
    return props;
  }

  function proxIt(obj) {
    if (!_privateVariables["default"].has(obj)) _privateVariables["default"].set(obj, {});

    for (var _len4 = arguments.length, arg = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
      arg[_key4 - 1] = arguments[_key4];
    }

    var theProps = props.apply(void 0, [obj].concat(arg));
    if (!obj['{{klass}}']) Object.setPrototypeOf(theProps, Object.getPrototypeOf(obj));
    Object.setPrototypeOf(obj, theProps);
    return obj;
  }

  function revertIt(ob) {
    console.log('friffy');
    _privateVariables["default"].get(ob).newTarget = false;
    ob = ob["{{target}}"] || ob;
    delete ob._extends;
    delete ob._target;
    delete ob._super;
    delete ob._template;
    if (ob['{{klass}}']) Object.setPrototypeOf(ob, Object.getPrototypeOf(Object.getPrototypeOf(ob)));
    if (ob['{{klass}}']) Object.setPrototypeOf(ob, Object.getPrototypeOf(Object.getPrototypeOf(ob)));
    return ob;
  }

  function throwIt(obj, newTarget, type) {
    Object.setPrototypeOf(newTarget, obj.constructor.prototype);
    if (obj["{{swap}}"]) obj["{{swap}}"](newTarget);

    _privateVariables["default"].set(newTarget, {
      newTarget: _privateVariables["default"].get(obj).newTarget
    });

    throw {
      swap: newTarget,
      type: type
    };
  }

  function catchIt(instance, received) {
    if (received.swap) {
      if (received.type === "extends") {
        console.log('wild');
        Object.defineProperty(received.swap, "_extends", {
          get: function get() {
            return instance._template["extends"];
          },
          set: function set() {
            return true;
          }
        });
      }

      return received.swap;
    }
  }

  if (argus.length === 1 && (0, _typeof2["default"])(argus[0]) === "object") {
    newFunc = (0, _defineProperty2["default"])({}, temp.name, function _target() {
      var instance = this; // Object.defineProperties(this,Object.getOwnPropertyDescriptors(this.constructor._template.properties))

      if (!_privateVariables["default"].get(this)) _privateVariables["default"].set(this, {});

      if ((this instanceof _target ? this.constructor : void 0) || this !== global) {
        _privateVariables["default"].get(this).newTarget = true;
      }

      var thisProps = props(instance);
      Object.defineProperty(instance, "_super", {
        value: thisProps._super,
        enumerable: false,
        writable: true,
        configurable: true
      });
      thisProps._properties = this.constructor._template.properties;

      try {
        var _func;

        for (var _len5 = arguments.length, arg = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
          arg[_key5] = arguments[_key5];
        }

        (_func = func).call.apply(_func, [instance].concat(arg));
      } catch (caught) {
        if (!caught || caught.type !== "super") throw caught;
        instance = catchIt(instance, caught);
      }

      _privateVariables["default"].get(instance).newTarget = false;
      revertIt(instance);
      var instProps = props(instance);
      instProps._properties = instProps._template.properties;
      return instance;
    })[temp.name];
    newFunc._template = temp;
    temp.defaults["static"] = newFunc;
    temp.defaults.prototype = newFunc.prototype;
    Object.setPrototypeOf(temp, temp.defaults);
    if (temp["extends"]) temp.prototype = Object.setPrototypeOf(temp.prototype, temp["extends"].prototype);

    if (temp.prototype.constructor === Object) {
      Object.defineProperties(newFunc.prototype, Object.getOwnPropertyDescriptors(temp.prototype));
      temp.prototype = newFunc.prototype;
    }

    newFunc.prototype = temp.prototype;
    Object.setPrototypeOf(newFunc, temp["extends"]);
    instance = proxIt(Object.setPrototypeOf(new temp["extends"](), newFunc.prototype));
    temp.defaults.properties = instance;
    Array.apply(void 0, (0, _toConsumableArray2["default"])(new Set(['static', 'extends'].concat((0, _toConsumableArray2["default"])(Reflect.ownKeys(temp.defaults).filter(function (key) {
      return key !== 'properties';
    })))))).forEach(function (key) {
      console.log('key', key);
      instance['_' + key] = temp[key];
    });
    return newFunc;
  } else newFunc = (0, _defineProperty2["default"])({}, name, function () {
    _privateVariables["default"].set(this, {
      newTarget: true
    });

    for (var _len6 = arguments.length, arg = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      arg[_key6] = arguments[_key6];
    }

    var instance = proxIt.apply(void 0, [this].concat(arg));

    try {
      var _func2;

      (_func2 = func).call.apply(_func2, [instance].concat(arg));
    } catch (caught) {
      var _func4;

      instance = catchIt(instance, caught);
      instance = proxIt.apply(void 0, [instance].concat(arg));

      if (caught.type === "extends") {
        try {
          var _func3;

          (_func3 = func).call.apply(_func3, [instance].concat(arg));
        } catch (caught2) {
          caught = caught2;

          if (caught) {
            instance = catchIt(instance, caught2);
          }
        }
      } else (_func4 = func).call.apply(_func4, [instance].concat(arg));

      instance = revertIt(instance);
      this.constructor._initialized = true;
      return instance;
    }

    instance = revertIt(instance);
    instance.constructor._initialized = true;
    return instance;
  })[name];

  newFunc._template = newFunc._template || temp;
  temp = newFunc._template;
  temp.constructor = newFunc;
  temp.prototype = Object.setPrototypeOf(Object.getOwnPropertyDescriptors(temp.prototype), Object.getPrototypeOf(temp.prototype));
  if (temp._properties) temp.properties = Object.setPrototypeOf(Object.getOwnPropertyDescriptors(temp.properties), Object.getPrototypeOf(temp.properties));
  if (temp["static"]) temp["static"] = Object.setPrototypeOf(Object.getOwnPropertyDescriptors(temp["static"]), Object.getPrototypeOf(temp["static"]));

  _privateVariables["default"].set(newFunc, {});

  return newFunc;
}

var bindIt = function bindIt(ob, prop, bnd) {
  bnd = _arguments.length === 2 ? prop : bnd;
  var fetched = _arguments.length === 2 ? ob : Reflect.get.apply(Reflect, (0, _toConsumableArray2["default"])([ob, prop].concat((0, _toConsumableArray2["default"])(bnd)).filter(Boolean)));
  return typeof fetched === 'function' ? typeof bnd !== 'undefined' ? fetched.bind(bnd) : fetched : fetched;
};