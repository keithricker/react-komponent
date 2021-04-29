"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = inheritMethods;
exports.callIt = callIt;
exports.gB = gB;
exports.alterProps = alterProps;
exports.protoFromProp = protoFromProp;
exports.alterKompProto = alterKompProto;
exports.getBind = exports.onSets = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _utils = require("../helpers/utils");

var _privateVariables = _interopRequireDefault(require("../Komponent/privateVariables"));

var _redux = require("redux");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var proto = {
  get: Object.getPrototypeOf,
  set: Object.setPrototypeOf
};
var initializations = new _utils.WeakerMap();

function inheritMethods(comp) {
  var thisProto = proto.get(proto.get(comp));
  alterProps(thisProto);
}

var safe = function safe(ob, prop, binder) {
  binder = binder || ob;
  var theProp = (0, _utils.getProp)(ob, prop);
  if (!theProp) return;
  return prop.originalValue ? prop.originalValue(binder) : Reflect.get(ob, prop, binder);
};

function callIt(obj, func, Bind) {
  for (var _len = arguments.length, arg = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    arg[_key - 3] = arguments[_key];
  }

  if (typeof func === 'string') {
    var def = (0, _utils.getDescriptor)(obj, func);
    if (!def) return;
    func = def.get || def.value;
    if (typeof func !== 'function') return;
    func = func.bind(Bind);
  }

  if (arguments[1] === 'componentDidMount') {
    console.log('funcher', func); // throw new Error('finch')
  }

  var trg = Bind;

  var priv = _privateVariables["default"].getSet(trg, {});

  console.log('the error func name', func.name);

  try {
    priv.caller = obj;
  } finally {
    try {
      return func.apply(void 0, arg);
    } finally {
      if (priv.caller === obj) priv.caller = trg;
    }
  }
}

function register(comp) {
  if (!comp.constructor.statefulComponents) {
    console.log('comper womper', comp);
    throw new Error("This component doesn't appear to be a descendant of Komponent class.");
  }

  if (!comp.constructor.statefulComponents[comp.componentName]) comp.constructor.registerComponent(comp);
}

var onSets = {
  initialize: function initialize() {
    var self = this;
    var componentName = safe(this, 'componentName');
    console.log('componentName', componentName);
    var Parent = this.constructor;
    register(this);

    if (!Parent.reducers.hasOwnProperty(componentName)) {
      Parent.RootClass.extension(function (ext) {
        var rootReducer = ext.reducers || null;
        if (rootReducer && !rootReducer.hasOwnProperty(componentName) && !self.initialized) onSets.reducer.call(self);
      });
    }

    if ('sagas' in this && !Parent.sagas[componentName]) Parent.refreshSagas();
  },
  reducer: function reducer() {
    var componentName = safe(this, 'componentName');
    register(this);
    var thiss = this;
    var Parent = this.constructor;
    var allowed = Parent.allowedList.includes(componentName);

    if (!Parent.customReducers || allowed) {
      Parent.reducers[componentName] = safe(this, 'reducer');
      Parent.RootClass.extension(function (ext) {
        Parent.store.replaceReducer((0, _redux.combineReducers)(_objectSpread(_objectSpread({}, ext.reducers), Parent.reducers)));
      });
    }
  },
  sagas: function sagas() {
    register(this);
    this.constructor.refreshSagas();
  }
};
exports.onSets = onSets;

function gB(obj, thiss) {
  return new _utils.Standin(thiss, {
    get: function get(ob, prop) {
      if (prop === 'original') {
        var level = proto.get(obj);
        return new _utils.Standin(level, {
          get: function get(o, p) {
            var levl = (0, _utils.getLevel)(level, function (lvl) {
              return lvl.hasOwnProperty(p);
            }) || level;
            var bindThiss = new _utils.Standin(thiss, {
              get: function get(src, key) {
                if (key === 'original') {
                  return new _utils.Standin(proto.get(levl), {
                    get: function get(thing, name) {
                      var newBnd = new _utils.Standin(thiss, {
                        get: function get(ob, prop) {
                          if (prop === 'original') return bindThiss.original;
                          var retVal = Reflect.get(thiss, prop, newBnd);
                          return typeof retVal === 'function' && name !== 'constructor' ? retVal.bind(newBnd) : retVal;
                        }
                      });
                      var ret = Reflect.get(thing, name, newBnd);
                      return typeof ret === 'function' && name !== 'constructor' ? ret.bind(newBnd) : ret;
                    }
                  });
                }

                var ret = Reflect.get(src, key, bindThiss);
                return typeof ret === 'function' && key !== 'constructor' ? ret.bind(bindThiss) : ret;
              }
            });
            var retVal = Reflect.get(levl, p, bindThiss);
            return typeof retVal === 'function' && p !== 'constructor' ? retVal.bind(bindThiss) : retVal;
          }
        });
      }

      return Reflect.get(ob, prop);
    }
  });
}

var getBind = function getBind(start, thiz) {
  var newProx = new _utils.Standin(thiz, {
    get: function get(o, p) {
      return thiz[p];
    }
  });
  return newProx;
};

exports.getBind = getBind;

function alterProps(obj, cb) {
  Reflect.ownKeys(obj).filter(function (key) {
    return key !== 'constructor' && key !== 'original';
  }).forEach(function (key) {
    var def = Object.getOwnPropertyDescriptor(obj, key);
    def.configurable = true;
    var type = def.hasOwnProperty('get') ? 'get' : 'value';
    var backup = def[type];
    if (backup.defined) return;
    if (typeof backup !== 'function') return;

    if (cb) {
      var defn = cb(Object.defineProperty({}, key, def), key, def);
      type = defn.hasOwnProperty('get') ? 'get' : 'value';
      defn[type].defined = true;
      return Object.defineProperty(obj, key, defn);
    }

    var propName = key + 'Caller';
    def[type] = (0, _defineProperty2["default"])({}, propName, function () {
      obj = protoFromProp(this, key, def[type]);
      var thiss = this['{{target}}'] || this;
      var arg = [arguments].concat();
      console.error('calling ', key);
      console.log('this in ' + key, this); // let Bind = getBind(obj,this)

      var prop = backup.bind(this);
      var propCall = callIt.apply(void 0, [obj, prop, thiss].concat((0, _toConsumableArray2["default"])(arg)));

      if ((key === 'mapStateToProps' || key === 'mapDisPatchToProps' || type === 'get') && typeof propCall === 'function' && arg.length) {
        return callIt.apply(void 0, [obj, propCall, thiss].concat((0, _toConsumableArray2["default"])(arg)));
      }

      return propCall;
    })[propName];
    def[type].defined = true;
    Object.defineProperty(obj, key, def);
  });
}

function protoFromProp(thiss, key, prop) {
  return (0, _utils.getLevel)(thiss, function (lvl) {
    var def = Object.getOwnPropertyDescriptor(lvl, key);
    if (!def) return false;
    var type = def.hasOwnProperty('get') ? 'get' : 'value';
    return def && def[type] === prop;
  });
}

function alterKompProto(object) {
  var callback = function callback(obj, key, def) {
    var type = def.hasOwnProperty('get') ? 'get' : 'value';
    def = {
      configurable: true
    };
    var propName = key + 'Caller';
    def.get = (0, _defineProperty2["default"])({}, propName, function () {
      var thiss = this['{{target}}'] || this;
      console.log('key', key);
      console.log('this in ' + key, thiss);
      var thisMap = initializations.getSet(thiss, new _utils.WeakerMap());
      var propMap = thisMap.get(def.get);

      if (!propMap) {
        thisMap.set(def.get, true);
        if (!thiss.connector) onSets.initialize.call(thiss);
      }

      console.error('calling ', key);
      console.log('this in ' + key, thiss);
      var ob = protoFromProp(thiss, key, def.get);

      if (!ob) {
        console.log('obj', obj);
        console.log('this', thiss);
        throw new Error();
      }

      Object.defineProperty(def.get, 'name', {
        value: ob.constructor.name + '__' + key + '__'
      }); // const Bind = getBind(ob,thiss)

      var prop = Reflect.get(obj, key, thiss);
      if (typeof prop !== 'function') return prop;
      prop = (0, _utils.MirrorTie)(obj, key, thiss);
      return function () {
        for (var _len2 = arguments.length, arg = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          arg[_key2] = arguments[_key2];
        }

        var propCall = callIt.apply(void 0, [ob, prop, thiss].concat(arg));
        if ((key === 'mapStateToProps' || key === 'mapDisPatchToProps') && typeof propCall === 'function') return callIt.apply(void 0, [ob, propCall, thiss].concat(arg));
        return propCall;
      }.bind(thiss);
    })[propName];
    def.get.originalProp = (0, _utils.getProp)(obj, key);

    def.get.originalValue = function (binder) {
      return (0, _utils.tie)(Reflect.get(obj, key, binder), binder);
    };

    def.get.defined = true;
    return def;
  };

  return alterProps(object, callback);
}