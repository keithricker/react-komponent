"use strict";

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const RootClass = _class.default.RootClass;
let RCExtension;
RootClass.extension(ext => RCExtension = ext);
const DOM = _class.default.DOM;
const {
  connect
} = RootClass;
const connectFunc = connect;
let previous = [];
var calls = 0;
const rand = _privateVariables.default.randomString;
const proto = {
  set: Object.setPrototypeOf,
  get: Object.getPrototypeOf
};

class Render extends Object {
  constructor(obj) {
    super(obj);
    return proto.set(obj, proto.set((0, _utils.clone)(Render.prototype), proto.get(obj)));
  }

  has(prop) {
    return this.hasOwnProperty(prop);
  }

}

class Renders extends Array {
  get last() {
    return this[this.length - 1];
  }

  get isComplete() {
    return this.last.completed;
  }

  complete() {
    this.last.completed = true;
  }

  push(...rends) {
    return rends.forEach(rend => Array.prototype.push.call(this, new Render(rend)));
  }

  add(...arg) {
    return this.push(...arg);
  }

}

class SessionsMap extends _utils.WeakerMap {
  set(...arg) {
    let setted = _utils.WeakerMap.prototype.set.call(this, ...arg).get(arg[0]);

    setted.renders = new Renders(...(setted.renders || []));
    proto.set(setted, proto.set({
      get hasRendered() {
        return this.renders.some(ren => ren.completed === true);
      }

    }, proto.get(setted)));
  }

}

let sessions = new SessionsMap();
let handlers = new _utils.WeakerMap();
let cPHandler = {};

const Komponent = function (comp) {
  let extension = (0, _extend.default)(comp, function (props) {
    let thiss = props[rand] || props.component || this;
    handlers.set(thiss['{{target}}'], thiss);
    sessions(thiss, {});
    return thiss;
  }, (0, _utils.isClass)(comp) ? function (props) {
    let instance = proto.set(new _react.default.Component(props), extension.prototype);

    if (extension.prototype.mapStateToProps) {
      Object.defineProperty(instance, 'mapStateToProps', {
        value: undefined,
        writable: true,
        configurable: true
      });
      let mapState = extension.prototype.mapStateToProps;
      let mapDis = extension.prototype.mapDispatchToProps;
      let mapped;
      let dis;

      try {
        mapped = mapState.call(instance);
      } catch {}

      try {
        dis = mapDis.call(instance);
      } catch {}

      if (typeof mapped === 'function') mapState = mapped.bind(instance);
      if (typeof mapDis === 'function') mapDis = dis.bind(instance);
      let connector = (0, _Connector.default)(mapState, mapDis)(extension);
      props = { ...connector.connectedProps(props),
        passThrough: true
      };
    }

    let instanceProx = getCompProxy(instance);
    Object.keys(cPHandler.set).filter(key => {
      return key in comp.prototype && key !== 'mapStateToProps';
    }).forEach(key => {
      let instanceProp = Object.getOwnPropertyDescriptor(key, instance) || undefined;
      let lvl = (0, _utils.getLevel)(comp.prototype, lvl => lvl.hasOwnProperty(key));
      let def = Object.getOwnPropertyDescriptor(lvl, key);
      let type = def.get ? 'get' : 'value';
      if (typeof def[type] === 'function') def[type] = def[type].bind(instanceProx);
      let gotten = Reflect.get(instanceProp ? instance : comp.prototype, key, instanceProx);
      instanceProx[key] = typeof gotten === 'function' ? gotten.bind(instanceProx) : gotten;
      if (!instanceProp) delete instanceProx[key];else Object.defineProperty(instanceProx, key, instanceProp);
    });
    return { ...props,
      [rand]: instanceProx
    };
  } : undefined);
  return extension;

  function getCompProxy(thiss, props, bindr) {
    props = props || thiss.props;

    const safe = (ob, prop, binder) => {
      const useTarget = !(ob instanceof _utils.Prox && cPHandler.get.hasOwnProperty(prop));
      let theProp = !useTarget ? ob[prop] : (0, _utils.getDefinition)(ob, prop);
      if (!theProp) return;
      let def = useTarget ? theProp : undefined;
      if (def) theProp = def.get || def.value;
      let returnVal;
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

    let cloned = (0, _utils.cloneProxy)(thiss, cPHandler);
    let cP = bindr || cloned;

    const renders = () => sessions(cP, {}).renders;

    function register(ob) {
      if (!ob.constructor.statefulComponents) throw new Error(`This component doesn't appear to be a descendant of Komponent class.`);
      ob.constructor.registerComponent(ob);
      RCExtension.register(ob.constructor);
    }

    function deregister(ob) {
      return ob.constructor.deregisterComponent(ob);
    }

    cPHandler.get = {
      domNode(ob) {
        return DOM(ob);
      },

      createEvent(ob) {
        return function (name) {
          return cP.domNode.createEvent(name);
        };
      },

      dispatchEvent(ob) {
        return function (event) {
          return cP.domNode.dispatchEvent(event);
        };
      },

      originalSetState(thiss) {
        return function setState(...args) {
          return (0, _inheritMethods.callIt)(thiss, 'setState', cP, ...args);
        };
      },

      setState(thiss) {
        return function setState(...args) {
          let cb = () => {};

          if (arguments.length === 2 && typeof arguments[1] === 'function') {
            cb = args.pop();
          }

          console.log('gaga before original setState');
          console.log('gaga new state from original setState', args[0]);
          (0, _inheritMethods.callIt)(thiss, 'setState', cP, arguments[0], st => {
            cb(st);
            thiss.suppressSetState = false;
            console.log('setting state from original setState', arguments[0]);
            cP.useDispatch(cP.actions.setState(arguments[0]));
          });
        };
      },

      componentWillUnmount(ob) {
        return function componentWillUnmount() {
          cP.dispatchEvent(ob.componentName + 'componentWillUnmount');
          if (ob.componentWillUnmount) (0, _inheritMethods.callIt)(ob, 'componentWillUnmount', cP);
          const subs = ob.constructor.subscriptions;
          const unsubs = subs.get(ob) || [];
          unsubs.forEach(unsub => unsub());
        };
      },

      componentDidMount(ob) {
        thiss = cP;
        return function componentDidMount() {
          thiss.dispatchEvent(ob.componentName + 'DidMount');
          console.log('------------- component DID mount!!!! -------------');

          if (!thiss.initialized && thiss.state && Object.keys(thiss.state).length > 1) {
            const storeState = thiss.props.mappedState || thiss.constructor.store.getState()[thiss.componentName] || {};
            const fetchedState = Object.keys(storeState).length < 1 ? thiss.state : storeState;

            if (JSON.stringify(thiss.state) !== JSON.stringify(storeState)) {
              cP.originalSetState(fetchedState);
            }
          }

          thiss.initialized = true;
          thiss.constructor.allowedList.splice(thiss.constructor.allowedList.indexOf(thiss.componentName), 1);
          if (ob.componentDidMount) (0, _inheritMethods.callIt)(ob, 'componentDidMount', cP);
        };
      },

      render(ob, key) {
        let thiss = cP;
        let res;
        let rendered;
        let props = thiss.props;
        thiss.dispatchEvent(thiss.componentName + 'Render');

        const renderFetchingPage = com => {
          console.log('props in render fetching', props);

          let Rendered = function () {
            let renderee = (0, _utils.isClass)(comp) ? com.render : com.render || com;
            return renderee.call(thiss, props);
          };

          console.log('readying to render <FetchingPage>');
          return /*#__PURE__*/_react.default.createElement(_fetchingOverlayCompiled.default, {
            overlay: thiss.props.overlay,
            component: Rendered,
            fetching: thiss.state && thiss.state.fetching ? true : false
          });
        };

        if ((0, _utils.isClass)(comp)) return function () {
          return renderFetchingPage(ob);
        };
        return function render() {
          const renders = sessions(thiss, {}).renders = sessions(thiss).renders || [];
          let newRender = {
            completed: false
          };
          let newerRender = {
            completed: false
          };
          renders.add(newRender);
          let callee = thiss.connector || comp;

          if (thiss.connector && !props[rand]) {
            console.log('first', { ...thiss.state
            });
            props = { ...props,
              [rand]: thiss
            };

            try {
              renders.push(newerRender);
              rendered = renderFetchingPage(thiss.connector);
            } catch (err) {
              console.log('error', err);
            } finally {
              console.log('second', { ...thiss.state
              });
              newerRender.completed = true;
            }
          }

          if (thiss.connector) props = { ...props,
            [rand]: thiss
          };
          if (!sessions(thiss).hasRendered) try {
            return renderFetchingPage(callee);
          } catch (err) {
            console.log('there was an error', err);
          } finally {
            newRender.completed = true;
            console.log('third', { ...thiss.state
            });
          }

          try {
            rendered = renderFetchingPage(callee);
          } catch (err) {
            console.log('errorz', err);
          } finally {
            console.log('fifth', { ...thiss.state
            }, 'ft', { ...thiss
            });
            newerRender.completed = true;
            return rendered;
          }

          return res;
        };
      },

      getState(thiss) {
        return function getState() {
          return cP.constructor.store.getState();
        };
      },

      useState(thiss) {
        thiss = cP;
        return function useState(initial) {
          initial = typeof initial === 'function' ? initial({ ...thiss.state
          }) : initial;
          cP.originalSetState(initial);

          function setTheState(state) {
            return cP.originalSetState(typeof state === 'function' ? state({ ...thiss.state
            }) : state);
          }

          if (!thiss.useState.subscriptions) thiss.useState.subscriptions = new WeakMap();
          if (!thiss.useState.subscriptions.get(thiss)) thiss.useState.subscriptions.set(thiss, setTheState);
          return [{ ...initial
          }, setTheState];
        };
      },

      konstructor() {
        return 'Komponent';
      },

      useSelector(thiss) {
        thiss = cP;
        let selectors = thiss.constructor.selectors;
        const useSelectors = thiss.constructor.useSelectors;
        const subscriptions = thiss.constructor.subscriptions;
        return function useSelector(...cb) {
          const theState = thiss.constructor.store.getState();
          let selector;
          let selectorFunc;
          useSelectors.set(thiss, useSelectors.get(thiss) || []);

          if (arguments.length === 1) {
            selectorFunc = arguments[0];
            selector = selectors.get(selectorFunc) || (0, _reselect.createSelector)(...cb, things => things);
            selectors.set(selectorFunc, selectors.get(selectorFunc) || selector);
            if (!subscriptions.get(selectorFunc)) _subscriber.subscribeToStore.call(thiss, thiss.constructor.store, selectorFunc, selector, 'useSelector');
            return selector.call(thiss, theState, thiss.props);
          }

          selector = subscriptions.get(useSelector) || (0, _reselect.createSelector)(...cb, things => things);
          useSelectors.set(thiss, useSelectors.get(thiss) || []);
          selectors = useSelectors.get(thiss);
          if (!selectors.includes(selector)) selectors.push(useSelector);
          const theSelected = selector.call(thiss, theState);
          if (theState === theSelected || theSelected === theState[thiss.componentName]) return theSelected;

          _subscriber.subscribeToStore.call(thiss, thiss.constructor.store, useSelector, selector, 'useSelector end');

          return theSelected;
        };
      },

      useDispatch(thiss) {
        thiss = cP;
        return function useDispatch(...args) {
          const reactComponentMethods = ['componentDidMount', 'componentWillMount', 'componentWillUnmount', 'render', 'constructClassInstance', 'componentDidUpdate'];
          const st = thiss.getStackTrace();
          const instance = st[0];
          const prevInstance = args[1] || st[1];
          let reactMethod;
          st.some(s => {
            return reactComponentMethods.some(cm => {
              if (s.includes('.' + cm)) {
                reactMethod = cm;
                return true;
              }
            });
          });
          previous.forEach((prev, ind) => previous[ind] = { ...prev
          });
          const inPrevious = previous.some(prev => prev.arg === args[0].toString() && prev.instance === instance && prevInstance === prev.prevInstance && reactMethod === prev.reactMethod);

          if (thiss.inLoop || inPrevious) {
            console.error('stuck in a loop - getting out ...');
            console.log('previous', thiss.getStackTrace()); // return
          }

          previous.push({
            arg: args[0].toString(),
            instance,
            prevInstance,
            reactMethod
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

          let dispatch = thiss.props && thiss.props.dispatch ? thiss.props.dispatch : thiss.constructor.store.dispatch;
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

      defaultMapState(thiss) {
        thiss = cP;
        return function defaultMapState(state) {
          return {
            mappedState: state[thiss.componentName || (0, _utils.lowerFirst)(thiss.name || thiss.constructor.name)]
          };
        };
      },

      connect() {
        return connectFunc;
      },

      actions(thiss) {
        if (thiss.actions) return (0, _inheritMethods.callIt)(thiss, 'actions', cP);
        return _actions.default.call(cP);
      },

      fetchData(thiss) {
        thiss = cP;
        return function fetchData(name, endpoint, callback) {
          console.log('----------fetchData!!!--------------');
          thiss.useDispatch(thiss.actions.fetchData(endpoint, name, callback));
        };
      },

      selector() {
        return _reselect.createSelector;
      },

      deregister(ob) {
        return function () {
          return deregister(ob);
        };
      },

      reducer(ob) {
        let thiss = cP;
        return function reducer(state, action) {
          let dispatches;
          console.error('registered reducers', this.constructor.reducers);

          function reducerFunction(state = null, action) {
            thiss.reducing = true;

            if (thiss.dispatches) {
              thiss.dispatches.value = action;
              dispatches = thiss.dispatches;
            }

            const preloadedState = RootClass.preloadedState || {};
            const thisState = state || preloadedState[thiss.componentName] || {};
            console.error('in the reducer', thiss);
            console.error('ACTION TYPE: ', action.type);
            if (action.type === thiss.componentName.toUpperCase() + '_STATE_CHANGE') return { ...thisState,
              ...action.payload
            };

            if (action.type === thiss.componentName.toUpperCase() + '_FETCH_DATA_START') {
              console.error('fetching data from ', action.type);
              return { ...thisState,
                fetching: true
              };
            }

            if (action.type === thiss.componentName.toUpperCase() + '_FETCH_DATA_COMPLETE') {
              delete action.payload.callback;
              const newState = { ...thisState,
                fetching: false,
                ...action.payload
              };
              console.error('setting state from ' + action.type);
              return newState;
            } else if (ob.reducer) return (0, _inheritMethods.callIt)(ob, 'reducer', cP, state, action);

            let storageState = thiss.constructor.stateFromStorage(thiss.componentName) || {};
            storageState = (0, _utils.Obj)(storageState).length ? storageState : null;
            return state || storageState || null;
          }

          if (thiss.dispatching) {
            console.log('dispatching:', thiss.dispatching);
            console.log('--------------------------------');
          }

          console.log('REDUCER FUNCTION START!!!!');
          const newState = reducerFunction(state, action);
          console.log("REDUCER FUNCTION COMPLETE!!!!!");
          thiss.suppressSetState = newState === thiss.state || action.type.includes('@@') ? true : false;
          console.log('suppressing?', thiss.suppressSetState);
          if (dispatches) thiss.suppressDispatch = dispatches.key;

          if (!thiss.suppressSetState) {
            console.log('NO SUPPRESS SETSTATE -- ORIGINAL SET STATE');
            cP.originalSetState(newState, () => {
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

      saga() {
        return {
          takeLatest: _effects.takeLatest,
          takeEvery: _effects.takeEvery,
          takeLeading: _effects.takeLeading,
          call: _effects.call,
          put: _effects.put
        };
      },

      getStackTrace() {
        let gst = _utils.getStackTrace;
        return function getStackTrace() {
          return gst();
        };
      },

      inLoop(thiss) {
        thiss = cP;
        const st = thiss.getStackTrace();
        return st.filter((s, i) => i !== 0).includes(st[0]) ? st : false;
      },

      original(thiss) {
        return new _utils.Prox(thiss, {
          get: function (ob, prop) {
            let privs = _privateVariables.default.get(ob);

            let caller = privs.caller;
            console.log('original caller', caller);
            if (caller.hasOwnProperty('constructor') && caller.constructor.name !== 'Komponent') console.log('gst caller no-komp');
            let level = caller ? proto.get(privs.caller) : proto.get(ob);
            level = (0, _utils.getLevel)(level, lvl => lvl.hasOwnProperty(prop)) || level;
            let returnVal;

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

      constructor(ob) {
        return ob.constructor;
      },

      ['{{handler}}']() {
        return cPHandler;
      },

      handler(ob) {
        return ob.handler || cPHandler;
      },

      variant() {
        return 'getCompProxy';
      },

      socket(ob) {
        return ob.constructor.socket;
      },

      default(ob, key) {
        if (key in Object.prototype) return;
        ob = ob['{{target}}'] || ob;
        let original;
        let result;
        let obj;

        if (!cPHandler.get.hasOwnProperty(key)) {
          obj = (0, _utils.getLevel)(ob, lvl => lvl.hasOwnProperty(key));
          if (!obj) return;
          if (obj === Object.prototype || obj === _react.default.Component.prototype) return typeof ob[key] === 'function' ? ob[key].bind(cP) : ob[key];
          let def = Object.getOwnPropertyDescriptor(obj, key);
          let type = def.hasOwnProperty('get') ? 'get' : 'value';
          original = def[type];

          if (typeof original === 'function' && key !== 'constructor' && !original.defined) {
            def[type] = (0, _utils.cloneFunc)(original, function () {
              let arg = [...arguments];
              console.error('calling ', key);
              let prop = original.bind(cP);
              let propCall = (0, _inheritMethods.callIt)(obj, prop, cP, ...arg);

              if ((key === 'mapStateToProps' || key === 'mapDisPatchToProps') && typeof propCall === 'function') {
                return (0, _inheritMethods.callIt)(obj, propCall, cP, ...arg);
              }

              return propCall;
            }, cP);

            def[type].originalValue = binder => {
              (0, _utils.ReflecTie)(Object.defineProperty({}, key, { ...def,
                [type]: original
              }), key, binder);
            };

            Object.defineProperty(def[type], 'originalProp', {
              get: function () {
                return original;
              }
            });
            def[type].defined = true;
            return type === 'get' ? def.get.call(cP) : def[type];
          }

          result = type === 'get' ? def.get.call(cP) : def[type];
        }

        const thisMap = sessions(cP, {});
        if (!thisMap.inits) thisMap.inits = {};

        if (!thisMap.inits.hasOwnProperty(key) || !thisMap.inits[key].hasOwnProperty('get')) {
          thisMap.inits[key] = thisMap.inits[key] || {};
          thisMap.inits[key].get = true;
          if (!thisMap.hasRendered) initialize(cP);
        }

        return result;
      }

    };
    cPHandler.set = {
      state(ob, prop, val) {
        if (!(0, _utils.isClass)(comp)) {
          let thisMap = sessions(cP, {});
          if (!thisMap.inits) thisMap.inits = {};
          thisMap.inits.state = thisMap.inits.state || {};

          if (!thisMap.inits.state.set && typeof val !== 'undefined' && val !== null) {
            thisMap.inits.state.set = val;
            ob.state = val;
          }

          let init = thisMap.inits.state.set;
          let thisString = thiss.state ? JSON.stringify(thiss.state) : undefined;
          let valString = val ? JSON.stringify(val) : undefined;
          let initString = init ? JSON.stringify(init) : undefined;
          if (initString && initString === valString && thiss.state) return true;
          if (ob.supressSetState) return true;
          let stateMatch = initString && initString === thisString;
          if (stateMatch && val) ob.state = val;
          if (!thiss.hasOwnProperty('state') || thiss.state === undefined || thiss.state === null) ob.state = val;
          if (!ob.suppressSetState) ob.state = val;
        }

        if ((0, _utils.isClass)(comp)) ob.state = val;
        let parent = ob.constructor;
        let fromLocal = parent.stateFromStorage();
        let fromStore = parent.store.getState();
        let untracked = {};
        let replenish = {};
        Object.keys(fromLocal).forEach(key => {
          if (fromStore[key] || parent.reducers[key]) return;

          if (parent.reducers[key] || key === thiss.componentName) {
            replenish[key] = fromLocal[key];
            return;
          }

          untracked[key] = (state = fromLocal[key], action) => {
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

      mapStateToProps(ob, key, val) {
        let thiss = cP;
        if (ob.connector || proto.get(thiss).mapStateToProps || props.passThrough || ob.hasOwnProperty('mapStateToProps') && ob.mapStateToProps === undefined) return true;
        const parent = (0, _utils.isClass)(comp) ? thiss.constructor : comp;
        let mapState;
        let mapDis;
        if (typeof val.call(thiss) === 'function') mapState = val.call(thiss);
        mapState = mapState.bind(thiss);
        if (ob.mapDispatchToProps) mapDis = ob.mapDispatchToProps.bind(thiss);
        Object.defineProperty(ob, 'mapStateToProps', {
          value: undefined,
          writable: true,
          configurable: true
        });
        ob.connector = (0, _Connector.default)(mapState, mapDis)(parent);
        return true;
      },

      reducer(ob) {
        const componentName = safe(ob, 'componentName', ob);
        ob = cP;
        register(cP);
        const Parent = ob.constructor;
        let allowed = Parent.allowedList.includes(componentName);

        if (!Parent.customReducers || allowed) {
          Parent.reducers[componentName] = safe(cP, 'reducer', cP);
          Parent.store.replaceReducer((0, _redux.combineReducers)({ ...RCExtension.reducers,
            ...Parent.reducers
          }));
        }
      },

      sagas(ob) {
        ob = cP;
        console.log('registering sagas');
        register(ob);
        ob.constructor.refreshSagas();
      },

      default(ob, key, val) {
        let thisProto = (0, _utils.getLevel)(ob, lvl => lvl.hasOwnProperty('constructor') && lvl.constructor === ob.constructor && lvl !== ob);
        if (typeof val === 'function' && !thisProto.hasOwnProperty(key)) setVal(thisProto, key, val.bind(cP));else if (typeof val !== 'function') setVal(ob, key, val);
        initialize(cP);
        return true;
      }

    };
    return cloned;

    function initialize(ob) {
      ob = ob || this;
      let onSets = cPHandler.set;
      calls++;
      if (calls === 500) throw new Error('fweesh');
      const componentName = safe(ob, 'componentName', ob); // console.log('componentName',componentName)

      const Parent = ob.constructor;
      register(ob);

      if (!Parent.reducers.hasOwnProperty(componentName)) {
        const rootReducer = RCExtension ? RCExtension.reducers : null;
        if (rootReducer && !rootReducer.hasOwnProperty(componentName) && !ob.initialized) onSets.reducer(ob);
      }

      if ('sagas' in ob && !Parent.sagas[componentName]) Parent.refreshSagas();
    }
  }
};

proto.set(Komponent, _class.default);
module.exports = Komponent;