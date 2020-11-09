"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = Component;
exports.RootComponent = exports.store = void 0;

var _react = _interopRequireDefault(require("react"));

var _index = require("../reducers/index");

var _redux = require("redux");

var _reselect = require("reselect");

var _reactRedux = require("react-redux");

var _fetchingOverlayCompiled = _interopRequireDefault(require("./fetchingOverlayCompiled"));

require("../index.css");

var _reduxSaga = _interopRequireDefault(require("redux-saga"));

var _effects = require("redux-saga/effects");

var _reducers = _interopRequireDefault(require("../reducers"));

var _reactRouterDom = require("react-router-dom");

var _reduxPersist = require("redux-persist");

var _storage = _interopRequireDefault(require("redux-persist/lib/storage"));

var _react2 = require("redux-persist/es/integration/react");

var _reduxThunk = _interopRequireDefault(require("redux-thunk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var persistConfig = {
  key: 'primary',
  storage: _storage.default
};
var configuredReducers = (0, _reduxPersist.persistReducer)(persistConfig, _reducers.default);
var sagaMiddleware = (0, _reduxSaga.default)();
var store = (0, _redux.createStore)(configuredReducers, (0, _redux.applyMiddleware)(_reduxThunk.default, sagaMiddleware));
exports.store = store;
var persistor = (0, _reduxPersist.persistStore)(store);
var combined = _index.combined;

function lowerFirst(word) {
  console.log('word!', word);
  return word.charAt(0).toLowerCase() + word.slice(1);
}

function toHash(obj) {
  if (!obj) return 0;
  var string = JSON.stringify(obj);
  var hash = 0;
  var char;
  var i;
  if (string.length == 0) return hash;

  for (i = 0; i < string.length; i++) {
    char = string.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return hash;
}

var classInherit = function classInherit(komp) {
  var comp = Object.setPrototypeOf({}, komp);

  while (comp = Object.getPrototypeOf(comp)) {
    if (Object.getPrototypeOf(comp) === Component) break;

    if (Object.getPrototypeOf(comp) === _react.default.Component) {
      Object.setPrototypeOf(comp, Component);
      break;
    }
  }
};

var objInherit = function objInherit(komp) {
  var comp = Object.setPrototypeOf({}, komp);

  while (comp = Object.getPrototypeOf(comp)) {
    console.log(comp.constructor.name);
    if (Object.getPrototypeOf(comp) && Object.getPrototypeOf(comp).constructor === Component) break;

    if (Object.getPrototypeOf(comp) && Object.getPrototypeOf(comp).constructor === _react.default.Component) {
      Object.setPrototypeOf(comp, Component.prototype);
      break;
    }
  }
};

var previous = [];

function Component(props) {
  var _this = this;

  var newProto = {};
  var thiss = this;
  Object.setPrototypeOf(newProto, Object.getPrototypeOf(this));
  Reflect.ownKeys(Component.prototype).forEach(function (prop) {
    var desc = Object.getOwnPropertyDescriptor(Component.prototype, prop);

    if ('get' in desc) {
      var newDesc = _objectSpread(_objectSpread({}, desc), {}, {
        get: desc.get.bind(thiss)
      });

      Object.defineProperty(newProto, prop, newDesc);
    } else if (prop !== 'constructor' && typeof Component.prototype[prop] === 'function') newProto[prop] = Component.prototype[prop].bind(_this);
  });
  Object.setPrototypeOf(this, newProto);
  var component = props.component;
  this.originalRender = this.render;
  this.originalSetState = this.setState.bind(this);

  if (!props.passThrough && this.constructor !== Component) {
    var Cons = this.constructor;
    var Connected = Komponent(Cons, true);

    thiss.render = function () {
      var renderedComp = /*#__PURE__*/_react.default.createElement(Cons, _extends({
        passThrough: true
      }, props));

      var renderThis = function renderThis() {
        return !renderedComp._self || !renderedComp._self.state ? renderedComp : /*#__PURE__*/_react.default.createElement(Connected, _extends({
          passThrough: true
        }, props));
      };

      var returnThis = renderThis();
      return returnThis;
      return /*#__PURE__*/_react.default.createElement(_fetchingOverlayCompiled.default, {
        component: renderThis
      });
    };

    Object.setPrototypeOf(thiss, _react.default.Component.prototype);
    return thiss;
  }

  if (component) {
    if (!component.registerReducers) {
      classInherit(component);
      objInherit(component.prototype);
    }

    component = new component(props);
    Reflect.ownKeys(component).forEach(function (key) {
      if (key === 'state') thiss.state = _objectSpread({}, component.state);else if ('key' === 'setState') {} else try {
        thiss[key] = component[key];
      } catch (_unused) {}
    });
    Object.setPrototypeOf(thiss, Object.getPrototypeOf(component));
  }

  console.log("in the constructor!!!!!!!!!!!!!!", thiss.constructor.name);
  var reducers = combined;
  var componentName = component ? component.constructor.name : thiss.constructor.name;
  thiss.componentName = thiss.componentName || lowerFirst(componentName);

  thiss.originalComponentWillUnmount = thiss.componentWillUnmount || function () {};

  thiss.initialized = false;
  thiss.originalComponentDidMount = thiss.componentDidMount;
  var stateFromStorage = Component.stateFromStorage;

  var getState = function getState() {
    return props.selectors || props.mapState || store.getState();
  };

  thiss.actions = thiss.actions || {
    setState: function setState(payload) {
      var comp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : thiss.componentName;
      var type = comp.toUpperCase() + '_STATE_CHANGE';
      return {
        type: type,
        payload: payload
      };
    },
    fetchData: function fetchData(endpoint) {
      var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'fetchedData';
      var callback = arguments.length > 2 ? arguments[2] : undefined;
      var comp = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : thiss.componentName;
      return /*#__PURE__*/function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(dispatch) {
          var json;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  dispatch(thiss.actions.fetchDataStart(comp));
                  console.log('endpoint', endpoint);

                  if (!window.__PRELOADED_STATE__[name]) {
                    _context.next = 8;
                    break;
                  }

                  json = window.__PRELOADED_STATE__[name];
                  console.error('we have preloaded state!');
                  throw new Error();

                case 8:
                  _context.next = 10;
                  return fetch(endpoint);

                case 10:
                  json = _context.sent;
                  _context.next = 13;
                  return json.json();

                case 13:
                  json = _context.sent;

                case 14:
                  console.log('JSON:', json);
                  setTimeout(function () {
                    var res = dispatch(thiss.actions.fetchDataComplete(json, callback, name));
                    if (typeof callback === 'function') callback(res);
                  }, 5000);

                case 16:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }();
    },
    fetchDataStart: function fetchDataStart() {
      var comp = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : thiss.componentName;
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var name = comp;
      return {
        type: comp.toUpperCase() + '_FETCH_DATA_START',
        callback: callback,
        name: name
      };
    },
    fetchDataComplete: function fetchDataComplete(data) {
      var _payload;

      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'fetchedData';
      var comp = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : thiss.componentName;
      console.log('in the fetch complete');
      return {
        type: comp.toUpperCase() + '_FETCH_DATA_COMPLETE',
        payload: (_payload = {}, _defineProperty(_payload, name, data), _defineProperty(_payload, "callback", callback), _payload)
      };
    }
  };
  if (!Component.customReducers) Component.reducers[thiss.componentName] = thiss.reducer;

  if (!Component.statefulComponents[thiss.componentName]) {
    Component.statefulComponents[thiss.componentName] = thiss;

    if (thiss.sagas) {
      sagaMiddleware.run(Component.rootSaga);
    }
  }

  var fromLocal = stateFromStorage();
  var fromStore = getState();
  var untracked = {};
  var replenish = {};
  Object.keys(fromLocal).forEach(function (key) {
    if (!fromStore[key]) replenish[key] = fromLocal[key];

    if (!fromStore[key] && !Component.reducers[key]) {
      console.log('got one', key, fromLocal[key]);

      untracked[key] = function () {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var action = arguments.length > 1 ? arguments[1] : undefined;

        switch (action.type) {
          case key.toUpperCase() + '_STATE_CHANGE':
            return action.payload;

          default:
            return state;
        }
      };
    }
  });

  if (Object.keys(untracked).length > 1) {
    console.log('untracked!', untracked);
    combined = _objectSpread(_objectSpread({}, combined), untracked);
    store.replaceReducer((0, _redux.combineReducers)(_objectSpread(_objectSpread({}, combined), Component.reducers)));
    console.log('store from untracked:', store.getState());
  }

  Object.keys(replenish).forEach(function (key) {
    thiss.useDispatch(thiss.actions.setState(stateFromStorage()[key], key));
  });

  thiss.setState = function () {
    var _arguments = arguments;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var cb = function cb() {};

    if (arguments.length === 2 && typeof arguments[1] === 'function') {
      cb = args.pop();
    } // console.log('before',getState())


    thiss.originalSetState(arguments[0], function (st) {
      cb(st);
      thiss.suppressSetState = false;
      console.log('setting state from originalsetstate', _arguments[0]);
      thiss.useDispatch(thiss.actions.setState(_arguments[0])); // console.log('New State from setState',getState())

      console.log('New State from setState', thiss.state);
    });
  };

  thiss.componentWillUnmount = function () {
    thiss.originalComponentWillUnmount();
    var subs = thiss.useSelector.subscriptions;
    if (!subs) return;
    var unsubs = subs.get(thiss) || [];
    unsubs.forEach(function (unsub) {
      return unsub();
    });
  };

  thiss.componentDidMount = function () {
    console.log('------------- component DID mount!!!! -------------');
    console.log('getstat', thiss);
    console.log('thiss component in Component Did Mount', thiss);
    console.log('component', Object.create(Component));

    if (!thiss.initialized && thiss.state && Object.keys(thiss.state).length > 1) {
      var storeState = props.selectors || props.mapState || getState()[thiss.componentName] || {};
      var fetchedState = Object.keys(storeState).length < 1 ? thiss.state : storeState;

      if (JSON.stringify(thiss.state) !== JSON.stringify(storeState)) {
        thiss.setState(fetchedState, function () {
          return console.log('things!!!!!!!!!!');
        });
      }
    }

    thiss.initialized = true;
    if (thiss.originalComponentDidMount) thiss.originalComponentDidMount.apply(thiss, arguments);
  };

  thiss.render = function () {
    var Rendered = thiss.originalRender.bind(thiss);
    return /*#__PURE__*/_react.default.createElement(_fetchingOverlayCompiled.default, {
      component: Rendered,
      fetching: thiss.state && thiss.state.fetching ? true : false
    });
  };

  if (!reducers[thiss.componentName] && Component.reducers[thiss.componentName]) Component.registerReducers();
}

Component.prototype.getState = function () {
  var thiss = this;
  return thiss.props.selectors || thiss.props.mapState || store.getState();
};

Component.prototype.useState = function (initial) {
  var nextKey = 0;

  if (this.state) {
    Object.keys(this.state).forEach(function (key) {
      if (typeof key === 'number') nextKey = key + 1;
    });
  }

  var stateMirror = {
    nextKey: initial
  };
  setTheState(initial);

  function setTheState(newState) {
    var thisState = this.state ? _objectSpread({}, this.state) : {};
    stateMirror[nextKey] = newState;
    this.setState.apply(this, _toConsumableArray(thisState).concat(_toConsumableArray(stateMirror)));
  }

  return [stateMirror[nextKey], setTheState];
};

Component.prototype.useSelector = function () {
  var thiss = this;
  var theState = thiss.props.selectors || thiss.props.mapState || store.getState();

  for (var _len2 = arguments.length, cb = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    cb[_key2] = arguments[_key2];
  }

  var select = cb[0];

  var selector = _reselect.createSelector.apply(void 0, cb.concat([function (things) {
    return things;
  }]));

  return selector(theState);
  var us = this.useSelector;
  var theSelected = select(theState);
  if (!us.subscriptions) us.subscriptions = new WeakMap();
  if (us.subscriptions.has(select)) return theSelected;
  if (theState === theSelected || theSelected === theState[this.componentName]) return theSelected; // return theState

  var unsub = store.subscribe(function (state) {
    var newStore = thiss.props.mapState || store.getState();
    var newSelected = select(newStore); // console.log('NEWSTORE FROM SUBSCRIBE',newStore)

    var oldState = newSelected;
    if (us.subscriptions.has(select)) oldState = us.subscriptions.get(select); // console.log("NEW STATE from Subscribe",newSelected); console.log("OLD STATE from Subscribe",oldState)

    if (toHash(newSelected) !== oldState) {
      console.log('HolA!!!!!'); // Subscriber actions here == Update state!!

      thiss.setState(_objectSpread({}, thiss.state));
      us.subscriptions.set(select, toHash(newSelected));
    }
  });
  var unsubs = us.subscriptions.get(thiss) || [];
  us.subscriptions.set(thiss, [].concat(_toConsumableArray(unsubs), [unsub]));
  us.subscriptions.set(select, toHash(theSelected));
  return theSelected;
};

Component.prototype.useDispatch = function () {
  for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  var thiss = this.component || this;
  var reactComponentMethods = ['componentDidMount', 'componentWillMount', 'componentWillUnmount', 'render', 'constructClassInstance'];
  var st = thiss.getStackTrace();
  var instance = st[0];
  var prevInstance = args[1] || st[1];
  var reactMethod;
  st.some(function (s) {
    return reactComponentMethods.some(function (cm) {
      if (s.includes('.' + cm)) {
        reactMethod = cm;
        return true;
      }
    });
  });
  previous.forEach(function (prev, ind) {
    return previous[ind] = _objectSpread({}, prev);
  });
  var inLoop = thiss.inLoop();
  console.log('in loop', inLoop);
  console.log(instance);
  var inPrevious = previous.some(function (prev) {
    return prev.arg === args[0].toString() && prev.instance === instance && prevInstance === prev.prevInstance && reactMethod === prev.reactMethod;
  });
  console.log('STATE', thiss.props);
  console.log('THIS', thiss);

  try {
    console.log('STORE', store.getState());
  } catch (_unused2) {}

  if (inLoop || inPrevious) {
    console.log('stuck in a loop - getting out ...');
    throw new Error();
    console.log(previous);
    return;
  }

  previous.push({
    arg: args[0].toString(),
    instance: instance,
    prevInstance: prevInstance,
    reactMethod: reactMethod
  });
  console.log(inLoop);
  thiss.suppressSetState = false;

  if (thiss.dispatches && thiss.dispatches.key === args[0]) {
    console.log('already dispatching this -- bailing ...');
    return;
  }

  thiss.wrapped = thiss.wrapped || [];

  if (thiss.suppressDispatch === args[0]) {
    console.log('suppressing dispatch ...');
    thiss.suppressDispatch = false;
    return;
  }

  var dispatch = thiss.props.dispatch || store.dispatch;
  console.log(args[0]);

  try {
    dispatch(args[0]);
  } catch (err) {
    console.log(err);
    console.log(this.getStackTrace());
  }

  thiss.dispatches = {};
  thiss.suppressSetState = true; // this.dispatching.splice(this.dispatching.indexOf(arguments[0]))
};

Component.prototype.fetchData = function (name, endpoint, callback) {
  var thiss = this;
  console.log('----------fetchData!!!--------------');
  thiss.useDispatch(thiss.actions.fetchData(endpoint, name, callback));
};

Component.prototype.selector = function () {
  for (var _len4 = arguments.length, selectorFuncs = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    selectorFuncs[_key4] = arguments[_key4];
  }

  var thiss = this;
  var state;
  var props = this.props;
  if (_typeof(arguments[0]) === 'object') state = selectorFuncs.shift();
  if (_typeof(arguments[0]) === 'object') props = selectorFuncs.shift();
  selectorFuncs = selectorFuncs && selectorFuncs.length > 0 ? selectorFuncs : [function (items) {
    return items;
  }];

  var defaultSelector = function defaultSelector(defState) {
    return defState[thiss.componentName];
  };

  var selector = _reselect.createSelector.apply(void 0, [defaultSelector].concat(_toConsumableArray(selectorFuncs)));

  return state ? selector(state, props) : selector;
};

Object.defineProperty(Component.prototype, 'reducer', {
  get: function get() {
    var thiss = this;
    var dispatches;
    var suppressSetState = thiss.suppressSetState;

    var reducerFunction = function reducerFunction() {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : thiss.state;
      var action = arguments.length > 1 ? arguments[1] : undefined;
      thiss.reducing = true;

      if (thiss.dispatches) {
        thiss.dispatches.value = action;
        dispatches = thiss.dispatches;
      }

      console.log('in the reducer !!!!!!!');
      console.log('constructor: ', thiss.constructor.name);
      console.log('ACTION TYPE: ', action.type);
      if (action.type === thiss.componentName.toUpperCase() + '_STATE_CHANGE') return _objectSpread(_objectSpread({}, state), action.payload);else if (action.type === thiss.componentName.toUpperCase() + '_FETCH_DATA_START') return _objectSpread(_objectSpread({}, state), {}, {
        fetching: true
      });else if (action.type === thiss.componentName.toUpperCase() + '_FETCH_DATA_COMPLETE') {
        console.log('here we are!');
        delete action.payload.callback;

        var newState = _objectSpread(_objectSpread({}, state), {}, {
          fetching: false
        }, action.payload);

        console.log('setting state from FETCH_DATA_COMPLETE', newState);
        return newState;
      } else if (thiss.customReducer) return thiss.customReducer(state, action);
      return state || Component.stateFromStorage(thiss.componentName) || null;
    };

    return function () {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : thiss.state;
      var action = arguments.length > 1 ? arguments[1] : undefined;

      if (thiss.dispatching) {
        console.log('dispatching thing', thiss.dispatching);
        console.log('dispatches things', thiss.dispatches.key);
        console.log('--------------------------------');
      }

      console.log('REDUCER FUNCTION START!!!!');
      console.log('original state');
      var newState = reducerFunction(state, action);
      console.log("REDUCER FUNCTION COMPLETE!!!!!", newState);
      console.log("EQUAL", thiss.state === newState);
      console.log('state', thiss.state, 'new', newState);
      suppressSetState = newState === thiss.state || action.type.includes('@@') ? true : false;

      if (dispatches) {
        console.log('supress dispatch:');
        thiss.suppressDispatch = dispatches.key;
      }

      if (!suppressSetState) {
        console.log('NO SUPPRESS SETSTATE -- ORIGINAL SET STATE');
        console.log('before', thiss.state);
        console.log('newState', newState);
        thiss.originalSetState.call(thiss, newState, function () {
          console.log('after', thiss.state);
        });
      } else {
        console.log('New = Old', newState === thiss.state);
        console.log('action type', action.type);
        console.log('SETTING STATE SUPPRESSED!!!!!!');
      } // thiss.originalSetState(newState,() => { throw new Error })


      return newState;
    };
  },
  set: function set(newReducer) {
    this.customReducer = newReducer;
  }
});
Component.prototype.saga = {};
Component.prototype.saga.takeLatest = _effects.takeLatest;
Component.prototype.saga.takeEvery = _effects.takeEvery;
Component.prototype.saga.takeLeading = _effects.takeLeading;
Component.prototype.saga.call = _effects.call;
Component.prototype.saga.put = _effects.put;

Component.prototype.getStackTrace = function () {
  var thiss = this;
  var stackTrace;
  var stack;
  stack = new Error().stack;
  stackTrace = stack.split("\n");
  stackTrace.forEach(function (st, ind) {
    var returnVal = st.split('@')[0];
    if (returnVal.includes(' (')) returnVal = returnVal.split(' (')[0];
    if (returnVal.includes('    at ')) returnVal = returnVal.split('    at ')[1];
    stackTrace[ind] = returnVal;
  });
  stackTrace.shift();
  stackTrace.pop();
  if (stackTrace[0].includes('getStackTrace')) stackTrace.shift();
  return stackTrace.filter(function (ti) {
    return ti !== "";
  });
};

Component.prototype.inLoop = function () {
  var thiss = this;
  console.log('thisssssssssss', thiss);
  var st = thiss.getStackTrace();
  return st.filter(function (s, i) {
    return i !== 0;
  }).includes(st[0]);
};

Component.stateFromStorage = function (component) {
  var storageState = localStorage.getItem('persist:root');

  try {
    storageState = storageState ? JSON.parse(storageState) : null;
  } catch (_unused3) {
    return {};
  }

  if (!storageState) return {};
  var returnState = {};
  Object.keys(storageState).forEach(function (item) {
    try {
      returnState[item] = JSON.parse(storageState[item]);
    } catch (_unused4) {
      returnState[item] = {};
    }
  });
  if (component) return returnState[component];
  return returnState;
};

Component.statefulComponents = {};
Component.reducers = {};
Object.defineProperty(Component, 'reducer', {
  get: function get() {
    var thiss = this;
    var key = lowerFirst(thiss.name);
    return function () {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var action = arguments.length > 1 ? arguments[1] : undefined;

      switch (action.type) {
        case key.toUpperCase() + '_STATE_CHANGE':
          return action.payload;

        default:
          return state;
      }
    };
  }
});
Object.defineProperty(Component, 'mapStateToProps', {
  get: function get() {
    var mapStates = [];
    var comp;
    Object.keys(Component.statefulComponents).forEach(function (key) {
      comp = Component.statefulComponents[key];
      if (comp.mapStateToProps) mapStates = comp.mapStateToProps.concat(mapStates);
    });
    if (mapStates.length > 0) return mapStates;
  }
});
Object.defineProperty(Component, 'rootSaga', {
  get: function get() {
    var sagas = [];
    var comp;
    console.log('hey!!!', Component.statefulComponents);
    Object.keys(Component.statefulComponents).forEach(function (key) {
      comp = Component.statefulComponents[key];
      if (comp.sagas) comp.sagas().forEach(function (sag) {
        return sagas.push((0, _effects.call)(sag));
      });
    });
    if (sagas.length > 0) return /*#__PURE__*/regeneratorRuntime.mark(function rootSaga() {
      return regeneratorRuntime.wrap(function rootSaga$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return (0, _effects.all)(sagas);

            case 2:
            case "end":
              return _context2.stop();
          }
        }
      }, rootSaga);
    });
  }
});

Component.addReducers = function (red) {
  var comb = _objectSpread(_objectSpread({}, combined), red);

  store.replaceReducer((0, _redux.combineReducers)(_objectSpread({}, comb)));
};

Component.refreshReducers = function () {
  store.replaceReducer((0, _redux.combineReducers)(_objectSpread(_objectSpread({}, combined), Component.reducers)));
};

Component.registerReducers = function (red) {
  if (red) {
    Component.reducers = red;
    Component.customReducers = true;
  } else {
    Component.customReducers = false;
  }

  try {
    Object.keys(Component.reducers).some(function (redu) {
      if (!store.getState()[redu]) Component.refreshReducers();
    });
  } catch (_unused5) {}
};

Object.setPrototypeOf(Component.prototype, _react.default.Component.prototype);
Object.setPrototypeOf(Component, _react.default.Component);

function Komponent(Com) {
  var bypassInherit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var thiss = Com;

  if (!bypassInherit) {
    classInherit(Com);
    objInherit(Com.prototype);
  }

  var msp = function msp(state, prps) {
    var ms = {
      mapState: {},
      selectors: {}
    };
    Object.keys(state).forEach(function (st) {
      ms.mapState[st] = state[st];
      ms.selectors[st] = (0, _reselect.createSelector)(function (sta) {
        return sta[st];
      }, function (s) {
        return s;
      })(state);
    });

    if (thiss.mapStateToProps) {
      Reflect.ownKeys(thiss.mapStateToProps).forEach(function (key) {
        ms.mapState[key] = (0, _reselect.createSelector)(thiss.mapStateToProps[key], function (items) {
          return items;
        })(state, prps);
      });
    }

    return ms;
  };

  var mdp = thiss.mapDispatchToProps || null;
  var Connected = mdp ? (0, _reactRedux.connect)(msp, mdp)(Com) : (0, _reactRedux.connect)(msp)(Com);
  Object.defineProperty(Connected, 'name', {
    value: Com.name,
    writable: false
  });
  return Connected;
}

var RootComponent = function RootComponent(props) {
  return /*#__PURE__*/_react.default.createElement(_react.default.StrictMode, null, /*#__PURE__*/_react.default.createElement(_reactRouterDom.BrowserRouter, null, /*#__PURE__*/_react.default.createElement(_reactRedux.Provider, {
    store: store
  }, /*#__PURE__*/_react.default.createElement(_react2.PersistGate, {
    persistor: persistor
  }, props.children))));
};

exports.RootComponent = RootComponent;