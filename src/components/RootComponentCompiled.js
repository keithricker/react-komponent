"use strict";

var _react = _interopRequireDefault(require("react"));

var _redux = require("redux");

var _reactRedux = require("react-redux");

var _reduxSaga = _interopRequireWildcard(require("redux-saga"));

var _reactRouterDom = require("react-router-dom");

var _reduxPersist = require("redux-persist");

var _storage = _interopRequireDefault(require("redux-persist/lib/storage"));

var _react2 = require("redux-persist/es/integration/react");

var _reduxThunk = _interopRequireDefault(require("redux-thunk"));

var _effects = require("redux-saga/effects");

var _componentFunctionCompiled = _interopRequireDefault(require("./componentFunctionCompiled"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

console.log('component!', _componentFunctionCompiled.default);
throw new Error();
var persistConfig = {
  key: 'primary',
  storage: _storage.default
};
var originalCreateStore = _redux.createStore;
var originalApplyMiddleware = _redux.applyMiddleware;
var originalCreateSagaMiddleware = _reduxSaga.default;

var RootClass = /*#__PURE__*/function (_React$Component) {
  _inherits(RootClass, _React$Component);

  var _super = _createSuper(RootClass);

  function RootClass(props) {
    var _this;

    _classCallCheck(this, RootClass);

    _this = _super.call(this, props);

    if (_this.constructor.hasOwnProperty('extension')) {
      throw new Error("The " + _this.constructor.name + " class is intended to be a root-level component." + " it is therefore not intended to have more than one instance. Try extending the " + _this.constructor.name + " class (not guaranteed to be stable), or create a new RootComponent if you wish to have multiple instances.");
    }

    RootClass.extension = _this.constructor;

    var thiss = _this.constructor.instance = _assertThisInitialized(_this);

    var proto = Object.getPrototypeOf(_assertThisInitialized(_this));
    Object.keys(props).forEach(function (key) {
      if (!proto[key]) thiss[key] = props[key];
    });
    var combinedProps = [].concat(_toConsumableArray(Reflect.ownKeys(Object.getPrototypeOf(_assertThisInitialized(_this)))), _toConsumableArray(Object.keys(_assertThisInitialized(_this))));
    combinedProps.forEach(function (key) {
      if (!_this.constructor[key]) {
        _this.constructor[key] = Reflect.get(thiss, key, thiss);
      }
    });
    _this.store = _this.store || _this.constructor.createStore(_this.constructor.reducers, _this.persistConfig || persistConfig);
    _this.constructor.store = _this.store;
    if (_this.sagas) _this.constructor.runSaga();
    return _this;
  }

  _createClass(RootClass, [{
    key: "render",
    value: function render() {
      var persistor = this.persistor || (0, _reduxPersist.persistStore)(this.store);
      return /*#__PURE__*/_react.default.createElement(_react.default.StrictMode, null, /*#__PURE__*/_react.default.createElement(_reactRouterDom.BrowserRouter, null, /*#__PURE__*/_react.default.createElement(_reactRedux.Provider, {
        store: this.store
      }, /*#__PURE__*/_react.default.createElement(_react2.PersistGate, {
        persistor: persistor
      }, this.props.children))));
    }
  }], [{
    key: "createStore",
    value: function createStore(reducers, pc) {
      reducers = reducers || this.reducers;
      pc = pc || this.persistConfig || persistConfig;
      this.store = (0, _redux.createStore)(this.configuredReducers, (0, _redux.applyMiddleware)(_reduxThunk.default, this.sagaMiddleware));
      return this.store;
    }
  }, {
    key: "connect",
    value: function connect() {
      return _reactRedux.connect.apply(void 0, arguments);
    }
  }, {
    key: "createStore",
    value: function createStore(red, pc) {
      red = red || this.reducers;
      pc = pc || this.persistConfig || persistConfig;
      var smw = this.sagaMiddleware || (0, _reduxSaga.default)();
      var configuredReducers = (0, _reduxPersist.persistReducer)(pc, red);
      return this.store = originalCreateStore(configuredReducers, (0, _redux.applyMiddleware)(_reduxThunk.default, smw));
    }
  }, {
    key: "createSagaMiddleware",
    value: function createSagaMiddleware() {
      return originalCreateSagaMiddleware.apply(void 0, arguments);
    }
  }, {
    key: "runSaga",
    value: function runSaga(sagas) {
      sagas = sagas || this.sagas || [];
      this.sagas = _componentFunctionCompiled.default.sagas.concat(sagas.map(function (sag) {
        return (0, _effects.call)(sag);
      }));
      sagaMiddleware.run( /*#__PURE__*/regeneratorRuntime.mark(function rootSaga() {
        return regeneratorRuntime.wrap(function rootSaga$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return all(sagas);

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, rootSaga);
      }));
    }
  }, {
    key: "applyMiddleware",
    value: function applyMiddleware() {
      return originalApplyMiddleware.apply(void 0, arguments);
    }
  }, {
    key: "combinedReducers",
    get: function get() {
      return (0, _redux.combineReducers)(this.reducers);
    }
  }, {
    key: "configuredReducers",
    get: function get() {
      return (0, _reduxPersist.persistReducer)(this.persistConfig || persistConfig, this.combinedReducers);
    }
  }, {
    key: "reducers",
    get: function get() {
      var pr = this.instance && this.instance.reducers ? this.instance.reducers : {};
      var cr = _componentFunctionCompiled.default.reducers || {};
      return _objectSpread(_objectSpread({}, pr), cr);
    }
  }]);

  return RootClass;
}(_react.default.Component);

function RootComponent(props) {
  var Root = /*#__PURE__*/function (_RootClass) {
    _inherits(Root, _RootClass);

    var _super2 = _createSuper(Root);

    function Root(props) {
      _classCallCheck(this, Root);

      return _super2.call(this, props);
    }

    return Root;
  }(RootClass);

  return /*#__PURE__*/_react.default.createElement(Root, props, props.children);
}

module.exports = {
  RootComponent: RootComponent,
  RootClass: RootClass
};