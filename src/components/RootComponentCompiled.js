"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RootComponent = RootComponent;
exports.RootClass = void 0;

var _react = _interopRequireDefault(require("react"));

var _modules = _interopRequireDefault(require("../../server/modules"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _server = _interopRequireDefault(require("react-dom/server"));

var _redux = require("redux");

var _reactRedux = require("react-redux");

var _reduxSaga = _interopRequireDefault(require("redux-saga"));

var _reactRouterDom = require("react-router-dom");

var _reduxPersist = require("redux-persist");

var _storage = _interopRequireDefault(require("redux-persist/lib/storage"));

var _react2 = require("redux-persist/es/integration/react");

var _reduxThunk = _interopRequireDefault(require("redux-thunk"));

var _effects = require("redux-saga/effects");

var _utilsCompiled = require("./helpers/utilsCompiled");

var _privateVariables = _interopRequireDefault(require("./Komponent/privateVariables"));

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

// import Component from './componentFunctionCompiled'
var url = window.location.href.slice(0, -1);
var persistConfig = {
  key: 'primary',
  storage: _storage["default"]
};
var originalCreateStore = _redux.createStore;
var originalApplyMiddleware = _redux.applyMiddleware;
var originalCreateSagaMiddleware = _reduxSaga["default"];
var socketio;
var socketEvents = [];
var domEvents = {
  appDidMount: new Event('appDidMount', {
    bubbles: true
  }),
  appRender: new Event('appRender', {
    bubbles: true
  })
};

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

    var rcVars = (0, _privateVariables["default"])(RootClass);

    rcVars.extension = function (cb) {
      return cb(_this.constructor);
    };

    var classVars = (0, _privateVariables["default"])(_this.constructor);
    var thisVars = (0, _privateVariables["default"])(_assertThisInitialized(_this));
    if (rcVars.extensionCallbacks.length) (0, _utilsCompiled.sequence)(rcVars.extensionCallbacks.map(function (cb) {
      return function () {
        return cb(_this.constructor);
      };
    }));
    classVars.instances = classVars.instances || [];
    classVars.instances.push(_assertThisInitialized(_this));

    var thiss = _assertThisInitialized(_this);

    var proto = Object.getPrototypeOf(_assertThisInitialized(_this));
    Object.keys(props).forEach(function (key) {
      if (!proto[key]) thiss[key] = props[key];
    });
    _this.sagaMiddleware = _this.sagaMiddleware || (0, _reduxSaga["default"])();
    _this.sagas = _this.sagas || [];
    var combinedProps = [].concat(_toConsumableArray(Reflect.ownKeys(Object.getPrototypeOf(_assertThisInitialized(_this)))), _toConsumableArray(Object.keys(_assertThisInitialized(_this))));
    combinedProps.forEach(function (key) {
      if (!_this.constructor[key]) {
        _this.constructor[key] = Reflect.get(thiss, key, thiss);
      }
    });
    _this.store = _this.store || _this.constructor.createStore();

    var originalGetState = _this.store.getState.bind(_this.store);

    _this.store.getState = function getState() {
      try {
        return originalGetState.apply(void 0, arguments);
      } catch (_unused) {
        return RootClass.snapShot || {};
      }
    };

    RootClass.snapShot = _this.store.getState() || RootClass.snapShot;

    var unsubscribe = _this.store.subscribe(function () {
      RootClass.snapShot = _this.store.getState() || RootClass.snapShot;
    });

    if (_this.sagas.length) _this.constructor.runSaga();
    return _this;
  }

  _createClass(RootClass, [{
    key: "register",
    value: function register(komp) {
      var kompClasses = (0, _privateVariables["default"])(this).KomponentClasses = (0, _privateVariables["default"])(this).KomponentClasses || {};
      if (!kompClasses[komp.name]) kompClasses[komp.name] = [];
      kompClasses[komp.name].push(komp);
    }
  }, {
    key: "komponents",
    get: function get() {
      return _objectSpread({}, (0, _privateVariables["default"])(this).Komponents);
    }
  }, {
    key: "domNode",
    get: function get() {
      console.log('SEEEEEEEE', this.constructor.DOM);
      return this.constructor.DOM(this);
    }
  }, {
    key: "createEvent",
    value: function createEvent(name) {
      domEvents[name] = new Event(name, {
        bubbles: true
      });
      return domEvents[name];
    }
  }, {
    key: "dispatchEvent",
    value: function dispatchEvent(event) {
      return this.domNode.dispatchEvent(event);
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      dispatchEvent('appDidMount');
    }
  }, {
    key: "componentWillUnMount",
    value: function componentWillUnMount() {
      dispatchEvent('componentWillUnmount');
    }
  }, {
    key: "render",
    value: function render() {
      var persistor = this.persistor || (0, _reduxPersist.persistStore)(this.store);
      this.dispatchEvent('appRender');
      return /*#__PURE__*/_react["default"].createElement(_react["default"].StrictMode, null, /*#__PURE__*/_react["default"].createElement(_reactRouterDom.BrowserRouter, null, /*#__PURE__*/_react["default"].createElement(_reactRedux.Provider, {
        store: this.store
      }, /*#__PURE__*/_react["default"].createElement(_react2.PersistGate, {
        persistor: persistor
      }, this.props.children))));
    }
  }], [{
    key: "extension",
    get: function get() {
      return (0, _privateVariables["default"])(this).extension;
    }
  }, {
    key: "instances",
    get: function get() {
      return (0, _privateVariables["default"])(this).instances;
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
      var instances = (0, _privateVariables["default"])(this).instances || [];
      var theReducers = {};
      instances.forEach(function (inst) {
        return Object.assign(theReducers, inst.reducers);
      });
      return theReducers;
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

      if (typeof red !== 'function') {
        red = (0, _redux.combineReducers)(red);
      }

      pc = pc || this.persistConfig || persistConfig;
      var smw = arguments[0] ? (0, _reduxSaga["default"])() : this.sagaMiddleware;
      var configuredReducers = (0, _reduxPersist.persistReducer)(pc, red);
      var appliedMiddleware = (0, _redux.applyMiddleware)(_reduxThunk["default"], smw);
      var str = originalCreateStore(configuredReducers, appliedMiddleware);
      if (!arguments[0]) this.store = str;
      return str;
    }
  }, {
    key: "createSagaMiddleware",
    value: function createSagaMiddleware() {
      return originalCreateSagaMiddleware.apply(void 0, arguments);
    }
  }, {
    key: "runSaga",
    value: function runSaga() {
      var sagas = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var thiss = this;
      if (typeof this.sagas === 'function') this.sagas = this.sagas();
      if (typeof sagas === 'function') sagas = sagas();
      sagas = this.sagas.concat(sagas);
      sagas = sagas.map(function (sag) {
        return (0, _effects.call)(sag);
      });
      this.sagaMiddleware.run( /*#__PURE__*/regeneratorRuntime.mark(function rootSaga() {
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
      }));
    }
  }, {
    key: "applyMiddleware",
    value: function applyMiddleware() {
      return originalApplyMiddleware.apply(void 0, arguments);
    }
  }, {
    key: "server",
    get: function get() {
      return window.reactSSR;
    }
  }, {
    key: "socket",
    get: function get() {
      /*
      if (!socketio) dynamicImport('socket.io-client',(module) => {
         socketio = module.io(url)
         socketio.on('connect',() => {
            Array(...socketEvents).forEach(callback => callback())
            socketEvents = []
         })
      })
      */
      if (socketio && socketio.connected) return socketio;
      return new Proxy(socketio || {}, {
        get: function get(sock, prop) {
          if (!socketio || typeof sock[prop] === 'function') {
            return function () {
              for (var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++) {
                arg[_key] = arguments[_key];
              }

              sock = socketio || sock;

              if (!sock.connected) {
                console.error('no socket connection');
                socketEvents.push(function () {
                  var _sock;

                  if (typeof sock[prop] === 'function') (_sock = sock)[prop].apply(_sock, arg);
                });
                return;
              } else {
                var _sock2;

                console.log("socket ".concat(prop, "'ing ............."), prop);
                return (_sock2 = sock)[prop].apply(_sock2, arg);
              }
            };
          }

          return sock[prop];
        }
      });
    }
  }, {
    key: "DOM",
    get: function get() {
      var theHtml = (0, _privateVariables["default"])(this).htmlDom;
      if (!theHtml) theHtml = (0, _privateVariables["default"])(this).htmlDom = document.getElementsByTagName('html')[0];
      var handler = {
        get: function get(ob, prop) {
          if (prop === 'events') return _objectSpread({}, domEvents);
          return theHtml[prop] || _reactDom["default"][prop];
        },
        set: function set(ob, prop, val) {
          theHtml[prop] = val;
          return true;
        }
      };
      var theDOM = (0, _privateVariables["default"])(this).DOM;
      if (!theDOM) (0, _privateVariables["default"])(this).DOM = new Proxy(function DOM() {
        var comp = args[0];
        if ((0, _privateVariables["default"])(comp).domNode) return (0, _privateVariables["default"])(comp).domNode;
        (0, _privateVariables["default"])(comp).domNode = ReactDOM.findDOMNode(comp);
        var dE = (0, _privateVariables["default"])(comp).domNode.dispatchEvent;
        proto.set(proto.get());

        (0, _privateVariables["default"])(comp).domNode.dispatchEvent = function (event) {
          event = typeof event === 'string' ? domEvents[event] : event;
          return dE.call(comp, event);
        };

        (0, _privateVariables["default"])(comp).domNode.createEvent = function createEvent(name) {
          domEvents[name] = new Event(name, {
            bubbles: true
          });
        };

        return (0, _privateVariables["default"])(comp).domNode;
      }, handler);
      console.log((0, _privateVariables["default"])(this).DOM());
      throw new Error();
      return theDOM;
    }
  }]);

  return RootClass;
}(_react["default"].Component);

exports.RootClass = RootClass;
RootClass.snapShot = {};
RootClass.preloadedState = _modules["default"].preloadedData || window.__PRELOADED_STATE__ || {};
(0, _privateVariables["default"])(RootClass).extensionCallbacks = [];

(0, _privateVariables["default"])(RootClass).extension = function (cb) {
  var cbs = (0, _privateVariables["default"])(RootClass).extensionCallbacks;
  cbs.push(cb);
};

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

  return /*#__PURE__*/_react["default"].createElement(Root, props, props.children, " ");
}