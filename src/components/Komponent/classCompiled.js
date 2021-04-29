"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getKomponentClass = getKomponentClass;
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _react = _interopRequireDefault(require("react"));

var _redux = require("redux");

var _effects = require("redux-saga/effects");

var _RootComponentCompiled = require("../RootComponentCompiled");

var _privateVariables = _interopRequireDefault(require("./privateVariables"));

var _Connector = _interopRequireDefault(require("./Connector"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var RCExtension;

_RootComponentCompiled.RootClass.extension(function (ext) {
  return RCExtension = ext;
});

var proto = {
  get: Object.getPrototypeOf,
  set: Object.setPrototypeOf
};

var allReducers = function allReducers() {
  return RCExtension.reducers;
};

var equivalent = function equivalent(one, other) {
  if (one === other) return true;
  if (!Array.isArray(one) || !Array.isArray(other)) return false;
  return one.every(function (item, ind) {
    return item === other[ind];
  });
};

function getKomponentClass() {
  var Parent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _react["default"].Component;

  var Komponent = /*#__PURE__*/function (_Parent) {
    (0, _inherits2["default"])(Komponent, _Parent);

    var _super = _createSuper(Komponent);

    function Komponent(props) {
      (0, _classCallCheck2["default"])(this, Komponent);
      return _super.call(this, props);
    }

    (0, _createClass2["default"])(Komponent, null, [{
      key: "store",
      get: function get() {
        return this.RCExtension.store;
      }
    }, {
      key: "stateFromStorage",
      value: function stateFromStorage() {
        for (var _len = arguments.length, property = new Array(_len), _key = 0; _key < _len; _key++) {
          property[_key] = arguments[_key];
        }

        property.push('persist:root');
        var storage = JSON.parse(JSON.stringify(localStorage));
        property.forEach(function (prop) {
          storage = storage ? storage[prop] : storage;
        });
        return storage || {};
      }
    }, {
      key: "reducer",
      get: function get() {
        var Komp = this;
        var key = Komp.name.toUpperCase() + '_STATE_CHANGE';
        return function () {
          var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
          var action = arguments.length > 1 ? arguments[1] : undefined;

          switch (action.type) {
            case key:
              return action.payload;

            default:
              return state;
          }
        };
      }
    }, {
      key: "sagas",
      get: function get() {
        var Komp = this;

        var privs = _privateVariables["default"].getSet(Komp, {});

        if (!privs.sagas) this.refreshSagas();
        privs.sagas = privs.sagas || {};
        return privs.sagas;
      }
    }, {
      key: "refreshSagas",
      value: function refreshSagas() {
        var _this = this;

        console.log('refreshing sagas');
        var Komp = this;
        var sags = [];

        var privs = _privateVariables["default"].getSet(Komp, {});

        if (!privs.sagas) privs.sagas = {};
        var comp;
        var compSagas;
        Object.keys(Komp.statefulComponents).forEach(function (key) {
          comp = Komp.statefulComponents[key];
          compSagas = typeof comp.sagas === 'function' ? comp.sagas() : comp.sagas;

          if (compSagas) {
            sags = [].concat((0, _toConsumableArray2["default"])(sags), (0, _toConsumableArray2["default"])(compSagas));
            var thisSag = privs.sagas[comp.componentName];

            if (!equivalent(thisSag, compSagas)) {
              console.log('running the saga', compSagas);

              _this.runSaga(compSagas);
            }

            privs.sagas[comp.componentName] = compSagas;
          }
        });
        return sags;
      }
    }, {
      key: "runSaga",
      value: function runSaga(sagas) {
        this.RCExtension.runSaga(sagas);
      }
    }, {
      key: "rootSaga",
      get: function get() {
        var sagas = this.sagas.map(function (sag) {
          return (0, _effects.call)(sag);
        });
        if (sagas.length) return /*#__PURE__*/_regenerator["default"].mark(function rootSaga() {
          return _regenerator["default"].wrap(function rootSaga$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return (0, _effects.all)(sagas);

                case 2:
                case "end":
                  return _context.stop();
              }
            }
          }, rootSaga);
        });
      }
    }, {
      key: "addReducers",
      value: function addReducers(red) {
        var Komp = this;

        var comb = _objectSpread(_objectSpread(_objectSpread({}, allReducers()), Komp.reducers), red);

        Komp.store.replaceReducer((0, _redux.combineReducers)(_objectSpread({}, comb)));
      }
    }, {
      key: "refreshReducers",
      value: function refreshReducers() {
        var Komp = this;
        Komp.store.replaceReducer((0, _redux.combineReducers)(this.allReducers));
      }
    }, {
      key: "registerComponent",
      value: function registerComponent(comp) {
        return (0, _privateVariables["default"])(Komponent).stateFulComponents[comp.componentName] = comp;
      }
    }, {
      key: "deregisterComponent",
      value: function deregisterComponent(comp) {
        return delete (0, _privateVariables["default"])(Komponent).stateFulComponents[comp.componentName];
      }
    }, {
      key: "statefulComponents",
      get: function get() {
        var sc = (0, _privateVariables["default"])(Komponent).statefulComponents;
        return Object.keys(sc).length < 1 ? undefined : _objectSpread({}, sc);
      } // By default, reducers are collected by rounding up all of the reducer fields on each
      // instance of Komponent. The registerReducers function allows you to bypass this and
      // do it by specifying a list of reducers, the way redux normally does it.

    }, {
      key: "registerReducers",
      value: function registerReducers(red) {
        var Komp = this;

        if (red) {
          // When manually specifying a list of reducers, if you just want redux to use what is provided
          // in the component's reducer field, then just put 'defeault.' This will put the component's reducer
          // on the white list (a map of reducers you want redux to use)
          Object.keys(red).forEach(function (key) {
            if (red[key] === 'default') {
              console.error('code red!');
              delete red[key];
              Komp.allowedList.push(key);
            }
          });
          Komp.reducers = red;
          Komp.customReducers = true;
        } else {
          Komp.customReducers = false;
        }

        if (RCExtension) {
          Object.keys(Komp.reducers).some(function (redu) {
            if (!(redu in Komp.store.getState())) {
              console.error('refreshing! ' + redu);
              Komp.refreshReducers();
              return true;
            }
          });
        }
      }
    }, {
      key: "socket",
      get: function get() {
        return this.RootClass.socket;
      }
    }]);
    return Komponent;
  }(Parent);

  Komponent.customReducers = false;
  Komponent.RootClass = _RootComponentCompiled.RootClass;
  Komponent.allowedList = [];
  Komponent.selectors = new WeakMap();
  Komponent.useSelectors = new WeakMap();
  Komponent.subscriptions = new WeakMap();
  Komponent.reducers = {};
  Komponent.customConnect = _Connector["default"];
  (0, _privateVariables["default"])(Komponent).statefulComponents = {};
  return Komponent;
}

var kompClass = getKomponentClass();
var _default = kompClass;
exports["default"] = _default;