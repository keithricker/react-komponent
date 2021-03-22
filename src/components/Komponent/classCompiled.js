"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getKomponentClass = getKomponentClass;
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _redux = require("redux");

var _effects = require("redux-saga/effects");

var _RootComponentCompiled = require("../RootComponentCompiled");

var _privateVariables = _interopRequireDefault(require("./privateVariables"));

var _Connector = _interopRequireDefault(require("./Connector"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

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
    _inherits(Komponent, _Parent);

    var _super = _createSuper(Komponent);

    function Komponent(props) {
      _classCallCheck(this, Komponent);

      return _super.call(this, props);
    }

    _createClass(Komponent, null, [{
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
            sags = [].concat(_toConsumableArray(sags), _toConsumableArray(compSagas));
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
        if (sagas.length) return /*#__PURE__*/regeneratorRuntime.mark(function rootSaga() {
          return regeneratorRuntime.wrap(function rootSaga$(_context) {
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