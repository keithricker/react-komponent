"use strict";

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import Component from './componentFunctionCompiled'
let url = window.location.href.slice(0, -1);
const persistConfig = {
  key: 'primary',
  storage: _storage.default
};
const originalCreateStore = _redux.createStore;
const originalApplyMiddleware = _redux.applyMiddleware;
const originalCreateSagaMiddleware = _reduxSaga.default;
let socketio;
let socketEvents = [];
let domEvents = {
  appDidMount: new Event('appDidMount', {
    bubbles: true
  }),
  appRender: new Event('appRender', {
    bubbles: true
  })
};

class RootClass extends _react.default.Component {
  constructor(props) {
    super(props);

    if (this.constructor.hasOwnProperty('extension')) {
      throw new Error("The " + this.constructor.name + " class is intended to be a root-level component." + " it is therefore not intended to have more than one instance. Try extending the " + this.constructor.name + " class (not guaranteed to be stable), or create a new RootComponent if you wish to have multiple instances.");
    }

    const rcVars = (0, _privateVariables.default)(RootClass);

    rcVars.extension = cb => cb(this.constructor);

    const classVars = (0, _privateVariables.default)(this.constructor);
    const thisVars = (0, _privateVariables.default)(this);
    if (rcVars.extensionCallbacks.length) (0, _utilsCompiled.sequence)(rcVars.extensionCallbacks.map(cb => {
      return () => cb(this.constructor);
    }));
    classVars.instances = classVars.instances || [];
    classVars.instances.push(this);
    const thiss = this;
    const proto = Object.getPrototypeOf(this);
    Object.keys(props).forEach(key => {
      if (!proto[key]) thiss[key] = props[key];
    });
    this.sagaMiddleware = this.sagaMiddleware || (0, _reduxSaga.default)();
    this.sagas = this.sagas || [];
    let combinedProps = [...Reflect.ownKeys(Object.getPrototypeOf(this)), ...Object.keys(this)];
    combinedProps.forEach(key => {
      if (!this.constructor[key]) {
        this.constructor[key] = Reflect.get(thiss, key, thiss);
      }
    });
    this.store = this.store || this.constructor.createStore();
    let originalGetState = this.store.getState.bind(this.store);

    this.store.getState = function getState(...arg) {
      try {
        return originalGetState(...arg);
      } catch {
        return RootClass.snapShot || {};
      }
    };

    RootClass.snapShot = this.store.getState() || RootClass.snapShot;
    const unsubscribe = this.store.subscribe(() => {
      RootClass.snapShot = this.store.getState() || RootClass.snapShot;
    });
    if (this.sagas.length) this.constructor.runSaga();
  }

  register(komp) {
    let kompClasses = (0, _privateVariables.default)(this).KomponentClasses = (0, _privateVariables.default)(this).KomponentClasses || {};
    if (!kompClasses[komp.name]) kompClasses[komp.name] = [];
    kompClasses[komp.name].push(komp);
  }

  get komponents() {
    return { ...(0, _privateVariables.default)(this).Komponents
    };
  }

  get domNode() {
    console.log('SEEEEEEEE', this.constructor.DOM);
    return this.constructor.DOM(this);
  }

  createEvent(name) {
    domEvents[name] = new Event(name, {
      bubbles: true
    });
    return domEvents[name];
  }

  dispatchEvent(event) {
    return this.domNode.dispatchEvent(event);
  }

  componentDidMount() {
    dispatchEvent('appDidMount');
  }

  componentWillUnMount() {
    dispatchEvent('componentWillUnmount');
  }

  render() {
    let persistor = this.persistor || (0, _reduxPersist.persistStore)(this.store);
    this.dispatchEvent('appRender');
    return /*#__PURE__*/_react.default.createElement(_react.default.StrictMode, null, /*#__PURE__*/_react.default.createElement(_reactRouterDom.BrowserRouter, null, /*#__PURE__*/_react.default.createElement(_reactRedux.Provider, {
      store: this.store
    }, /*#__PURE__*/_react.default.createElement(_react2.PersistGate, {
      persistor: persistor
    }, this.props.children))));
  }

  static get extension() {
    return (0, _privateVariables.default)(this).extension;
  }

  static get instances() {
    return (0, _privateVariables.default)(this).instances;
  }

  static get combinedReducers() {
    return (0, _redux.combineReducers)(this.reducers);
  }

  static get configuredReducers() {
    return (0, _reduxPersist.persistReducer)(this.persistConfig || persistConfig, this.combinedReducers);
  }

  static get reducers() {
    let instances = (0, _privateVariables.default)(this).instances || [];
    let theReducers = {};
    instances.forEach(inst => Object.assign(theReducers, inst.reducers));
    return theReducers;
  }

  static connect(...arg) {
    return (0, _reactRedux.connect)(...arg);
  }

  static createStore(red, pc) {
    red = red || this.reducers;

    if (typeof red !== 'function') {
      red = (0, _redux.combineReducers)(red);
    }

    pc = pc || this.persistConfig || persistConfig;
    const smw = arguments[0] ? (0, _reduxSaga.default)() : this.sagaMiddleware;
    const configuredReducers = (0, _reduxPersist.persistReducer)(pc, red);
    const appliedMiddleware = (0, _redux.applyMiddleware)(_reduxThunk.default, smw);
    let str = originalCreateStore(configuredReducers, appliedMiddleware);
    if (!arguments[0]) this.store = str;
    return str;
  }

  static createSagaMiddleware(...arg) {
    return originalCreateSagaMiddleware(...arg);
  }

  static runSaga(sagas = []) {
    const thiss = this;
    if (typeof this.sagas === 'function') this.sagas = this.sagas();
    if (typeof sagas === 'function') sagas = sagas();
    sagas = this.sagas.concat(sagas);
    sagas = sagas.map(sag => (0, _effects.call)(sag));
    this.sagaMiddleware.run(function* rootSaga() {
      yield (0, _effects.all)(sagas);
    });
  }

  static applyMiddleware(...arg) {
    return originalApplyMiddleware(...arg);
  }

  static get server() {
    return window.reactSSR;
  }

  static get socket() {
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
      get: function (sock, prop) {
        if (!socketio || typeof sock[prop] === 'function') {
          return function (...arg) {
            sock = socketio || sock;

            if (!sock.connected) {
              console.error('no socket connection');
              socketEvents.push(() => {
                if (typeof sock[prop] === 'function') sock[prop](...arg);
              });
              return;
            } else {
              console.log(`socket ${prop}'ing .............`, prop);
              return sock[prop](...arg);
            }
          };
        }

        return sock[prop];
      }
    });
  }

  static get DOM() {
    let theHtml = (0, _privateVariables.default)(this).htmlDom;
    if (!theHtml) theHtml = (0, _privateVariables.default)(this).htmlDom = document.getElementsByTagName('html')[0];
    let handler = {
      get(ob, prop) {
        if (prop === 'events') return { ...domEvents
        };
        return theHtml[prop] || _reactDom.default[prop];
      }

    };
    let theDOM = (0, _privateVariables.default)(this).DOM;
    if (!theDOM) (0, _privateVariables.default)(this).DOM = new Proxy(function DOM() {
      return 'hello';
      let comp = args[0];
      if ((0, _privateVariables.default)(comp).domNode) return (0, _privateVariables.default)(comp).domNode;
      (0, _privateVariables.default)(comp).domNode = ReactDOM.findDOMNode(comp);
      let dE = (0, _privateVariables.default)(comp).domNode.dispatchEvent;
      proto.set(proto.get());

      (0, _privateVariables.default)(comp).domNode.dispatchEvent = function (event) {
        event = typeof event === 'string' ? domEvents[event] : event;
        return dE.call(comp, event);
      };

      (0, _privateVariables.default)(comp).domNode.createEvent = function createEvent(name) {
        domEvents[name] = new Event(name, {
          bubbles: true
        });
      };

      return (0, _privateVariables.default)(comp).domNode;
    }, handler);
    console.log((0, _privateVariables.default)(this).DOM());
    throw new Error();
    return theDOM;
  }

}

exports.RootClass = RootClass;
RootClass.snapShot = {};
RootClass.preloadedState = _modules.default.preloadedData || window.__PRELOADED_STATE__ || {};
(0, _privateVariables.default)(RootClass).extensionCallbacks = [];

(0, _privateVariables.default)(RootClass).extension = function (cb) {
  let cbs = (0, _privateVariables.default)(RootClass).extensionCallbacks;
  cbs.push(cb);
};

function RootComponent(props) {
  class Root extends RootClass {
    constructor(props) {
      super(props);
    }

  }

  return /*#__PURE__*/_react.default.createElement(Root, props, props.children, " ");
}