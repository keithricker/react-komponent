"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _construct2 = _interopRequireDefault(require("@babel/runtime/helpers/construct"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapNativeSuper"));

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _class = _interopRequireDefault(require("./class"));

var _utils = require("../helpers/utils");

var _inheritMethods = require("../helpers/inheritMethods");

var _Connector = _interopRequireDefault(require("./Connector"));

var _extend = _interopRequireDefault(require("./extend"));

var _privateVariables = _interopRequireDefault(require("./privateVariables"));

var _redux = require("redux");

var _subscriber = require("../helpers/subscriber");

var _reselect = require("reselect");

var _effects = require("redux-saga/effects");

var _fetchingOverlayCompiled = _interopRequireDefault(require("../fetchingOverlayCompiled"));

var _actions = _interopRequireDefault(require("../defaults/actions"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var RootClass = _class["default"].RootClass;
var RCExtension;
RootClass.extension(function (ext) {
  return RCExtension = ext;
});
var DOM = _class["default"].DOM;
var connect = RootClass.connect;
var connectFunc = connect;
var previous = [];
var calls = 0;
var rand = _privateVariables["default"].randomString;
var proto = {
  set: Object.setPrototypeOf,
  get: Object.getPrototypeOf
};

var Render = /*#__PURE__*/function (_Object) {
  (0, _inherits2["default"])(Render, _Object);

  var _super = _createSuper(Render);

  function Render(obj) {
    var _this;

    (0, _classCallCheck2["default"])(this, Render);
    _this = _super.call(this, obj);
    return (0, _possibleConstructorReturn2["default"])(_this, proto.set(obj, proto.set((0, _utils.clone)(Render.prototype), proto.get(obj))));
  }

  (0, _createClass2["default"])(Render, [{
    key: "has",
    value: function has(prop) {
      return this.hasOwnProperty(prop);
    }
  }]);
  return Render;
}( /*#__PURE__*/(0, _wrapNativeSuper2["default"])(Object));

var Renders = /*#__PURE__*/function (_Array) {
  (0, _inherits2["default"])(Renders, _Array);

  var _super2 = _createSuper(Renders);

  function Renders() {
    (0, _classCallCheck2["default"])(this, Renders);
    return _super2.apply(this, arguments);
  }

  (0, _createClass2["default"])(Renders, [{
    key: "last",
    get: function get() {
      return this[this.length - 1];
    }
  }, {
    key: "isComplete",
    get: function get() {
      return this.last.completed;
    }
  }, {
    key: "complete",
    value: function complete() {
      this.last.completed = true;
    }
  }, {
    key: "push",
    value: function push() {
      var _this2 = this;

      for (var _len = arguments.length, rends = new Array(_len), _key = 0; _key < _len; _key++) {
        rends[_key] = arguments[_key];
      }

      return rends.forEach(function (rend) {
        return Array.prototype.push.call(_this2, new Render(rend));
      });
    }
  }, {
    key: "add",
    value: function add() {
      return this.push.apply(this, arguments);
    }
  }]);
  return Renders;
}( /*#__PURE__*/(0, _wrapNativeSuper2["default"])(Array));

var SessionsMap = /*#__PURE__*/function (_WeakerMap) {
  (0, _inherits2["default"])(SessionsMap, _WeakerMap);

  var _super3 = _createSuper(SessionsMap);

  function SessionsMap() {
    (0, _classCallCheck2["default"])(this, SessionsMap);
    return _super3.apply(this, arguments);
  }

  (0, _createClass2["default"])(SessionsMap, [{
    key: "set",
    value: function set() {
      var _WeakerMap$prototype$;

      for (var _len2 = arguments.length, arg = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        arg[_key2] = arguments[_key2];
      }

      var setted = (_WeakerMap$prototype$ = _utils.WeakerMap.prototype.set).call.apply(_WeakerMap$prototype$, [this].concat(arg)).get(arg[0]);

      setted.renders = (0, _construct2["default"])(Renders, (0, _toConsumableArray2["default"])(setted.renders || []));
      proto.set(setted, proto.set({
        get hasRendered() {
          return this.renders.some(function (ren) {
            return ren.completed === true;
          });
        }

      }, proto.get(setted)));
    }
  }]);
  return SessionsMap;
}(_utils.WeakerMap);

var sessions = new SessionsMap();
var handlers = new _utils.WeakerMap();
var cPHandler = {};

var Komponent = function Komponent(comp) {
  var extension = (0, _extend["default"])(comp, function (props) {
    var thiss = props[rand] || props.component || this;
    handlers.set(thiss['{{target}}'], thiss);
    sessions(thiss, {});
    return thiss;
  }, (0, _utils.isClass)(comp) ? function (props) {
    var instance = proto.set(new _react["default"].Component(props), extension.prototype);

    if (extension.prototype.mapStateToProps) {
      Object.defineProperty(instance, 'mapStateToProps', {
        value: undefined,
        writable: true,
        configurable: true
      });
      var mapState = extension.prototype.mapStateToProps;
      var mapDis = extension.prototype.mapDispatchToProps;
      var mapped;
      var dis;

      try {
        mapped = mapState.call(instance);
      } catch (_unused) {}

      try {
        dis = mapDis.call(instance);
      } catch (_unused2) {}

      if (typeof mapped === 'function') mapState = mapped.bind(instance);
      if (typeof mapDis === 'function') mapDis = dis.bind(instance);
      var connector = (0, _Connector["default"])(mapState, mapDis)(extension);
      props = _objectSpread(_objectSpread({}, connector.connectedProps(props)), {}, {
        passThrough: true
      });
    }

    var instanceProx = getCompProxy(instance);
    Object.keys(cPHandler.set).filter(function (key) {
      return key in comp.prototype && key !== 'mapStateToProps';
    }).forEach(function (key) {
      var instanceProp = Object.getOwnPropertyDescriptor(key, instance) || undefined;
      var lvl = (0, _utils.getLevel)(comp.prototype, function (lvl) {
        return lvl.hasOwnProperty(key);
      });
      var def = Object.getOwnPropertyDescriptor(lvl, key);
      var type = def.get ? 'get' : 'value';
      if (typeof def[type] === 'function') def[type] = def[type].bind(instanceProx);
      var gotten = Reflect.get(instanceProp ? instance : comp.prototype, key, instanceProx);
      instanceProx[key] = typeof gotten === 'function' ? gotten.bind(instanceProx) : gotten;
      if (!instanceProp) delete instanceProx[key];else Object.defineProperty(instanceProx, key, instanceProp);
    });
    return _objectSpread(_objectSpread({}, props), {}, (0, _defineProperty2["default"])({}, rand, instanceProx));
  } : undefined);
  return extension;

  function getCompProxy(thiss, props, bindr) {
    var _cPHandler$get;

    props = props || thiss.props;

    var safe = function safe(ob, prop, binder) {
      var useTarget = !(ob instanceof Prox && cPHandler.get.hasOwnProperty(prop));
      var theProp = !useTarget ? ob[prop] : (0, _utils.getDescriptor)(ob, prop);
      if (!theProp) return;
      var def = useTarget ? theProp : undefined;
      if (def) theProp = def.get || def.value;
      var returnVal;
      if (theProp.originalValue) returnVal = prop.originalValue(binder);else {
        returnVal = useTarget ? def.get ? def.get.call(binder) : theProp : theProp;
      }
      return typeof returnVal === 'function' ? returnVal.bind(binder) : returnVal;
    };

    function setVal(ob, key, val) {
      Object.defineProperty(ob, key, {
        value: val,
        configurable: true,
        writable: true,
        enumerable: true
      });
      return true;
    }

    var cloned = (0, _utils.cloneProxy)(thiss, cPHandler);
    var cP = bindr || cloned;

    var renders = function renders() {
      return sessions(cP, {}).renders;
    };

    function register(ob) {
      if (!ob.constructor.statefulComponents) throw new Error("This component doesn't appear to be a descendant of Komponent class.");
      ob.constructor.registerComponent(ob);
      RCExtension.register(ob.constructor);
    }

    function _deregister(ob) {
      return ob.constructor.deregisterComponent(ob);
    }

    cPHandler.get = (_cPHandler$get = {
      domNode: function domNode(ob) {
        return DOM(ob);
      },
      createEvent: function createEvent(ob) {
        return function (name) {
          return cP.domNode.createEvent(name);
        };
      },
      dispatchEvent: function dispatchEvent(ob) {
        return function (event) {
          return cP.domNode.dispatchEvent(event);
        };
      },
      originalSetState: function originalSetState(thiss) {
        return function setState() {
          for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
          }

          return _inheritMethods.callIt.apply(void 0, [thiss, 'setState', cP].concat(args));
        };
      },
      setState: function setState(thiss) {
        return function setState() {
          var _arguments = arguments;

          for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            args[_key4] = arguments[_key4];
          }

          var cb = function cb() {};

          if (arguments.length === 2 && typeof arguments[1] === 'function') {
            cb = args.pop();
          }

          console.log('gaga before original setState');
          console.log('gaga new state from original setState', args[0]);
          (0, _inheritMethods.callIt)(thiss, 'setState', cP, arguments[0], function (st) {
            cb(st);
            thiss.suppressSetState = false;
            console.log('setting state from original setState', _arguments[0]);
            cP.useDispatch(cP.actions.setState(_arguments[0]));
          });
        };
      },
      componentWillUnmount: function componentWillUnmount(ob) {
        return function componentWillUnmount() {
          cP.dispatchEvent(ob.componentName + 'componentWillUnmount');
          if (ob.componentWillUnmount) (0, _inheritMethods.callIt)(ob, 'componentWillUnmount', cP);
          var subs = ob.constructor.subscriptions;
          var unsubs = subs.get(ob) || [];
          unsubs.forEach(function (unsub) {
            return unsub();
          });
        };
      },
      componentDidMount: function componentDidMount(ob) {
        thiss = cP;
        return function componentDidMount() {
          thiss.dispatchEvent(ob.componentName + 'DidMount');
          console.log('------------- component DID mount!!!! -------------');

          if (!thiss.initialized && thiss.state && Object.keys(thiss.state).length > 1) {
            var storeState = thiss.props.mappedState || thiss.constructor.store.getState()[thiss.componentName] || {};
            var fetchedState = Object.keys(storeState).length < 1 ? thiss.state : storeState;

            if (JSON.stringify(thiss.state) !== JSON.stringify(storeState)) {
              cP.originalSetState(fetchedState);
            }
          }

          thiss.initialized = true;
          thiss.constructor.allowedList.splice(thiss.constructor.allowedList.indexOf(thiss.componentName), 1);
          if (ob.componentDidMount) (0, _inheritMethods.callIt)(ob, 'componentDidMount', cP);
        };
      },
      render: function render(ob, key) {
        var thiss = cP;
        var res;
        var rendered;
        var props = thiss.props;
        thiss.dispatchEvent(thiss.componentName + 'Render');

        var renderFetchingPage = function renderFetchingPage(com) {
          console.log('props in render fetching', props);

          var Rendered = function Rendered() {
            var renderee = (0, _utils.isClass)(comp) ? com.render : com.render || com;
            return renderee.call(thiss, props);
          };

          console.log('readying to render <FetchingPage>');
          return /*#__PURE__*/_react["default"].createElement(_fetchingOverlayCompiled["default"], {
            overlay: thiss.props.overlay,
            component: Rendered,
            fetching: thiss.state && thiss.state.fetching ? true : false
          });
        };

        if ((0, _utils.isClass)(comp)) return function () {
          return renderFetchingPage(ob);
        };
        return function render() {
          var renders = sessions(thiss, {}).renders = sessions(thiss).renders || [];
          var newRender = {
            completed: false
          };
          var newerRender = {
            completed: false
          };
          renders.add(newRender);
          var callee = thiss.connector || comp;

          if (thiss.connector && !props[rand]) {
            console.log('first', _objectSpread({}, thiss.state));
            props = _objectSpread(_objectSpread({}, props), {}, (0, _defineProperty2["default"])({}, rand, thiss));

            try {
              renders.push(newerRender);
              rendered = renderFetchingPage(thiss.connector);
            } catch (err) {
              console.log('error', err);
            } finally {
              console.log('second', _objectSpread({}, thiss.state));
              newerRender.completed = true;
            }
          }

          if (thiss.connector) props = _objectSpread(_objectSpread({}, props), {}, (0, _defineProperty2["default"])({}, rand, thiss));
          if (!sessions(thiss).hasRendered) try {
            return renderFetchingPage(callee);
          } catch (err) {
            console.log('there was an error', err);
          } finally {
            newRender.completed = true;
            console.log('third', _objectSpread({}, thiss.state));
          }

          try {
            rendered = renderFetchingPage(callee);
          } catch (err) {
            console.log('errorz', err);
          } finally {
            console.log('fifth', _objectSpread({}, thiss.state), 'ft', _objectSpread({}, thiss));
            newerRender.completed = true;
            return rendered;
          }

          return res;
        };
      },
      getState: function getState(thiss) {
        return function getState() {
          return cP.constructor.store.getState();
        };
      },
      useState: function useState(thiss) {
        thiss = cP;
        return function useState(initial) {
          initial = typeof initial === 'function' ? initial(_objectSpread({}, thiss.state)) : initial;
          cP.originalSetState(initial);

          function setTheState(state) {
            return cP.originalSetState(typeof state === 'function' ? state(_objectSpread({}, thiss.state)) : state);
          }

          if (!thiss.useState.subscriptions) thiss.useState.subscriptions = new WeakMap();
          if (!thiss.useState.subscriptions.get(thiss)) thiss.useState.subscriptions.set(thiss, setTheState);
          return [_objectSpread({}, initial), setTheState];
        };
      },
      konstructor: function konstructor() {
        return 'Komponent';
      },
      useSelector: function useSelector(thiss) {
        thiss = cP;
        var selectors = thiss.constructor.selectors;
        var useSelectors = thiss.constructor.useSelectors;
        var subscriptions = thiss.constructor.subscriptions;
        return function useSelector() {
          for (var _len5 = arguments.length, cb = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
            cb[_key5] = arguments[_key5];
          }

          var theState = thiss.constructor.store.getState();
          var selector;
          var selectorFunc;
          useSelectors.set(thiss, useSelectors.get(thiss) || []);

          if (arguments.length === 1) {
            selectorFunc = arguments[0];
            selector = selectors.get(selectorFunc) || _reselect.createSelector.apply(void 0, cb.concat([function (things) {
              return things;
            }]));
            selectors.set(selectorFunc, selectors.get(selectorFunc) || selector);
            if (!subscriptions.get(selectorFunc)) _subscriber.subscribeToStore.call(thiss, thiss.constructor.store, selectorFunc, selector, 'useSelector');
            return selector.call(thiss, theState, thiss.props);
          }

          selector = subscriptions.get(useSelector) || _reselect.createSelector.apply(void 0, cb.concat([function (things) {
            return things;
          }]));
          useSelectors.set(thiss, useSelectors.get(thiss) || []);
          selectors = useSelectors.get(thiss);
          if (!selectors.includes(selector)) selectors.push(useSelector);
          var theSelected = selector.call(thiss, theState);
          if (theState === theSelected || theSelected === theState[thiss.componentName]) return theSelected;

          _subscriber.subscribeToStore.call(thiss, thiss.constructor.store, useSelector, selector, 'useSelector end');

          return theSelected;
        };
      },
      useDispatch: function useDispatch(thiss) {
        thiss = cP;
        return function useDispatch() {
          for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
            args[_key6] = arguments[_key6];
          }

          var reactComponentMethods = ['componentDidMount', 'componentWillMount', 'componentWillUnmount', 'render', 'constructClassInstance', 'componentDidUpdate'];
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
          var inPrevious = previous.some(function (prev) {
            return prev.arg === args[0].toString() && prev.instance === instance && prevInstance === prev.prevInstance && reactMethod === prev.reactMethod;
          });

          if (thiss.inLoop || inPrevious) {
            console.error('stuck in a loop - getting out ...');
            console.log('previous', thiss.getStackTrace()); // return
          }

          previous.push({
            arg: args[0].toString(),
            instance: instance,
            prevInstance: prevInstance,
            reactMethod: reactMethod
          });
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

          var dispatch = thiss.props && thiss.props.dispatch ? thiss.props.dispatch : thiss.constructor.store.dispatch;
          console.log('dispatching from useDispatch:', args[0]);

          try {
            dispatch(args[0]);
          } catch (err) {
            console.log('the error', err);
            console.log(thiss.getStackTrace());
            throw new Error();
          }

          thiss.dispatches = {};
          console.log('strings this obj suppressing?', true);
          thiss.suppressSetState = true;
        };
      },
      defaultMapState: function defaultMapState(thiss) {
        thiss = cP;
        return function defaultMapState(state) {
          return {
            mappedState: state[thiss.componentName || (0, _utils.lowerFirst)(thiss.name || thiss.constructor.name)]
          };
        };
      },
      connect: function connect() {
        return connectFunc;
      },
      actions: function actions(thiss) {
        if (thiss.actions) return (0, _inheritMethods.callIt)(thiss, 'actions', cP);
        return _actions["default"].call(cP);
      },
      fetchData: function fetchData(thiss) {
        thiss = cP;
        return function fetchData(name, endpoint, callback) {
          console.log('----------fetchData!!!--------------');
          thiss.useDispatch(thiss.actions.fetchData(endpoint, name, callback));
        };
      },
      selector: function selector() {
        return _reselect.createSelector;
      },
      deregister: function deregister(ob) {
        return function () {
          return _deregister(ob);
        };
      },
      reducer: function reducer(ob) {
        var thiss = cP;
        return function reducer(state, action) {
          var dispatches;
          console.error('registered reducers', this.constructor.reducers);

          function reducerFunction() {
            var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
            var action = arguments.length > 1 ? arguments[1] : undefined;
            thiss.reducing = true;

            if (thiss.dispatches) {
              thiss.dispatches.value = action;
              dispatches = thiss.dispatches;
            }

            var preloadedState = RootClass.preloadedState || {};
            var thisState = state || preloadedState[thiss.componentName] || {};
            console.error('in the reducer', thiss);
            console.error('ACTION TYPE: ', action.type);
            if (action.type === thiss.componentName.toUpperCase() + '_STATE_CHANGE') return _objectSpread(_objectSpread({}, thisState), action.payload);

            if (action.type === thiss.componentName.toUpperCase() + '_FETCH_DATA_START') {
              console.error('fetching data from ', action.type);
              return _objectSpread(_objectSpread({}, thisState), {}, {
                fetching: true
              });
            }

            if (action.type === thiss.componentName.toUpperCase() + '_FETCH_DATA_COMPLETE') {
              delete action.payload.callback;

              var _newState = _objectSpread(_objectSpread({}, thisState), {}, {
                fetching: false
              }, action.payload);

              console.error('setting state from ' + action.type);
              return _newState;
            } else if (ob.reducer) return (0, _inheritMethods.callIt)(ob, 'reducer', cP, state, action);

            var storageState = thiss.constructor.stateFromStorage(thiss.componentName) || {};
            storageState = (0, _utils.Obj)(storageState).length ? storageState : null;
            return state || storageState || null;
          }

          if (thiss.dispatching) {
            console.log('dispatching:', thiss.dispatching);
            console.log('--------------------------------');
          }

          console.log('REDUCER FUNCTION START!!!!');
          var newState = reducerFunction(state, action);
          console.log("REDUCER FUNCTION COMPLETE!!!!!");
          thiss.suppressSetState = newState === thiss.state || action.type.includes('@@') ? true : false;
          console.log('suppressing?', thiss.suppressSetState);
          if (dispatches) thiss.suppressDispatch = dispatches.key;

          if (!thiss.suppressSetState) {
            console.log('NO SUPPRESS SETSTATE -- ORIGINAL SET STATE');
            cP.originalSetState(newState, function () {
              console.log('after original setState');
            });
          } else {
            console.log('action type', action.type);
            console.log('SETTING STATE SUPPRESSED!!!!!!');
          }

          thiss.socket.emit("reducer", {
            state: newState,
            component: thiss.componentName,
            action: action
          });
          return newState;
        };
      },
      saga: function saga() {
        return {
          takeLatest: _effects.takeLatest,
          takeEvery: _effects.takeEvery,
          takeLeading: _effects.takeLeading,
          call: _effects.call,
          put: _effects.put
        };
      },
      getStackTrace: function getStackTrace() {
        var gst = _utils.getStackTrace;
        return function getStackTrace() {
          return gst();
        };
      },
      inLoop: function inLoop(thiss) {
        thiss = cP;
        var st = thiss.getStackTrace();
        return st.filter(function (s, i) {
          return i !== 0;
        }).includes(st[0]) ? st : false;
      },
      original: function original(thiss) {
        return new _utils.Standin(thiss, {
          get: function get(ob, prop) {
            var privs = _privateVariables["default"].get(ob);

            var caller = privs.caller;
            console.log('original caller', caller);
            if (caller.hasOwnProperty('constructor') && caller.constructor.name !== 'Komponent') console.log('gst caller no-komp');
            var level = caller ? proto.get(privs.caller) : proto.get(ob);
            level = (0, _utils.getLevel)(level, function (lvl) {
              return lvl.hasOwnProperty(prop);
            }) || level;
            var returnVal;

            if (prop === 'original') {
              privs.caller = level;

              try {
                returnVal = Reflect.get(ob, prop, ob);
              } catch (err) {
                console.log('error', err);
              } finally {
                if (privs.caller === level) privs.caller = ob;
              }
            }

            returnVal = returnVal || Reflect.get(level, prop, ob);

            if (prop === 'setState') {
              console.log('before original.setState', ob.state);
              return returnVal.bind(ob);
            }

            return typeof returnVal === 'function' ? returnVal.bind(ob) : returnVal;
          }
        });
      },
      constructor: function constructor(ob) {
        return ob.constructor;
      }
    }, (0, _defineProperty2["default"])(_cPHandler$get, '{{handler}}', function handler() {
      return cPHandler;
    }), (0, _defineProperty2["default"])(_cPHandler$get, "handler", function handler(ob) {
      return ob.handler || cPHandler;
    }), (0, _defineProperty2["default"])(_cPHandler$get, "variant", function variant() {
      return 'getCompProxy';
    }), (0, _defineProperty2["default"])(_cPHandler$get, "socket", function socket(ob) {
      return ob.constructor.socket;
    }), (0, _defineProperty2["default"])(_cPHandler$get, "default", function _default(ob, key) {
      if (key in Object.prototype) return;
      ob = ob['{{target}}'] || ob;
      var original;
      var result;
      var obj;

      if (!cPHandler.get.hasOwnProperty(key)) {
        obj = (0, _utils.getLevel)(ob, function (lvl) {
          return lvl.hasOwnProperty(key);
        });
        if (!obj) return;
        if (obj === Object.prototype || obj === _react["default"].Component.prototype) return typeof ob[key] === 'function' ? ob[key].bind(cP) : ob[key];
        var def = Object.getOwnPropertyDescriptor(obj, key);
        var type = def.hasOwnProperty('get') ? 'get' : 'value';
        original = def[type];

        if (typeof original === 'function' && key !== 'constructor' && !original.defined) {
          def[type] = (0, _utils.cloneFunc)(original, function () {
            var arg = Array.prototype.slice.call(arguments);
            var prop = original.bind(cP);

            var propCall = _inheritMethods.callIt.apply(void 0, [obj, prop, cP].concat((0, _toConsumableArray2["default"])(arg)));

            if ((key === 'mapStateToProps' || key === 'mapDisPatchToProps') && typeof propCall === 'function') {
              return _inheritMethods.callIt.apply(void 0, [obj, propCall, cP].concat((0, _toConsumableArray2["default"])(arg)));
            }

            return propCall;
          }, cP);

          def[type].originalValue = function (binder) {
            (0, _utils.ReflecTie)(Object.defineProperty({}, key, _objectSpread(_objectSpread({}, def), {}, (0, _defineProperty2["default"])({}, type, original))), key, binder);
          };

          Object.defineProperty(def[type], 'originalProp', {
            get: function get() {
              return original;
            }
          });
          def[type].defined = true;
          return type === 'get' ? def.get.call(cP) : def[type];
        }

        result = type === 'get' ? def.get.call(cP) : def[type];
      }

      var thisMap = sessions(cP, {});
      if (!thisMap.inits) thisMap.inits = {};

      if (!thisMap.inits.hasOwnProperty(key) || !thisMap.inits[key].hasOwnProperty('get')) {
        thisMap.inits[key] = thisMap.inits[key] || {};
        thisMap.inits[key].get = true;
        if (!thisMap.hasRendered) initialize(cP);
      }

      return result;
    }), _cPHandler$get);
    cPHandler.set = {
      state: function state(ob, prop, val) {
        if (!(0, _utils.isClass)(comp)) {
          var thisMap = sessions(cP, {});
          if (!thisMap.inits) thisMap.inits = {};
          thisMap.inits.state = thisMap.inits.state || {};

          if (!thisMap.inits.state.set && typeof val !== 'undefined' && val !== null) {
            thisMap.inits.state.set = val;
            ob.state = val;
          }

          var init = thisMap.inits.state.set;
          var thisString = thiss.state ? JSON.stringify(thiss.state) : undefined;
          var valString = val ? JSON.stringify(val) : undefined;
          var initString = init ? JSON.stringify(init) : undefined;
          if (initString && initString === valString && thiss.state) return true;
          if (ob.supressSetState) return true;
          var stateMatch = initString && initString === thisString;
          if (stateMatch && val) ob.state = val;
          if (!thiss.hasOwnProperty('state') || thiss.state === undefined || thiss.state === null) ob.state = val;
          if (!ob.suppressSetState) ob.state = val;
        }

        if ((0, _utils.isClass)(comp)) ob.state = val;
        var parent = ob.constructor;
        var fromLocal = parent.stateFromStorage();
        var fromStore = parent.store.getState();
        var untracked = {};
        var replenish = {};
        Object.keys(fromLocal).forEach(function (key) {
          if (fromStore[key] || parent.reducers[key]) return;

          if (parent.reducers[key] || key === thiss.componentName) {
            replenish[key] = fromLocal[key];
            return;
          }

          untracked[key] = function () {
            var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : fromLocal[key];
            var action = arguments.length > 1 ? arguments[1] : undefined;

            switch (action.type) {
              case key.toUpperCase() + '_STATE_CHANGE':
                return action.payload;

              default:
                return state;
            }
          };
        });
        if (Object.keys(untracked).length > 1) parent.addReducers(untracked);
        if ((0, _utils.isClass)(comp)) ob.state = val;
        return true;
      },
      mapStateToProps: function mapStateToProps(ob, key, val) {
        var thiss = cP;
        if (ob.connector || proto.get(thiss).mapStateToProps || props.passThrough || ob.hasOwnProperty('mapStateToProps') && ob.mapStateToProps === undefined) return true;
        var parent = (0, _utils.isClass)(comp) ? thiss.constructor : comp;
        var mapState;
        var mapDis;
        if (typeof val.call(thiss) === 'function') mapState = val.call(thiss);
        mapState = mapState.bind(thiss);
        if (ob.mapDispatchToProps) mapDis = ob.mapDispatchToProps.bind(thiss);
        Object.defineProperty(ob, 'mapStateToProps', {
          value: undefined,
          writable: true,
          configurable: true
        });
        ob.connector = (0, _Connector["default"])(mapState, mapDis)(parent);
        return true;
      },
      reducer: function reducer(ob) {
        var componentName = safe(ob, 'componentName', ob);
        ob = cP;
        register(cP);
        var Parent = ob.constructor;
        var allowed = Parent.allowedList.includes(componentName);

        if (!Parent.customReducers || allowed) {
          Parent.reducers[componentName] = safe(cP, 'reducer', cP);
          Parent.store.replaceReducer((0, _redux.combineReducers)(_objectSpread(_objectSpread({}, RCExtension.reducers), Parent.reducers)));
        }
      },
      sagas: function sagas(ob) {
        ob = cP;
        console.log('registering sagas');
        register(ob);
        ob.constructor.refreshSagas();
      },
      "default": function _default(ob, key, val) {
        var thisProto = (0, _utils.getLevel)(ob, function (lvl) {
          return lvl.hasOwnProperty('constructor') && lvl.constructor === ob.constructor && lvl !== ob;
        });
        if (typeof val === 'function' && !thisProto.hasOwnProperty(key)) setVal(thisProto, key, val.bind(cP));else if (typeof val !== 'function') setVal(ob, key, val);
        initialize(cP);
        return true;
      }
    };
    return cloned;

    function initialize(ob) {
      ob = ob || this;
      var onSets = cPHandler.set;
      calls++;
      if (calls === 500) throw new Error('fweesh');
      var componentName = safe(ob, 'componentName', ob); // console.log('componentName',componentName)

      var Parent = ob.constructor;
      register(ob);

      if (!Parent.reducers.hasOwnProperty(componentName)) {
        var rootReducer = RCExtension ? RCExtension.reducers : null;
        if (rootReducer && !rootReducer.hasOwnProperty(componentName) && !ob.initialized) onSets.reducer(ob);
      }

      if ('sagas' in ob && !Parent.sagas[componentName]) Parent.refreshSagas();
    }
  }
};

proto.set(Komponent, _class["default"]);
module.exports = Komponent;