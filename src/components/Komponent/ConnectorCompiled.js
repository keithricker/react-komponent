"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = customConnect;

var _react = _interopRequireDefault(require("react"));

var _subscriber = require("../helpers/subscriber");

var _utils = require("../helpers/utils");

var _reselect = require("reselect");

var _class = _interopRequireDefault(require("./class"));

var _privateVariables = _interopRequireDefault(require("./privateVariables"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var rand = _privateVariables["default"].randomString;
var proto = {
  get: Object.getPrototypeOf,
  set: Object.setPrototypeOf
};

var isClass = function isClass(ob) {
  return ob.prototype instanceof _react["default"].Component;
};

function customConnect(msp, mdp) {
  return function (Comp) {
    var Komponent = (0, _utils.getLevel)(Comp, function (lvl) {
      return lvl.name === 'Komponent';
    }) || _class["default"];

    var store = function store() {
      return Komponent.store;
    };

    var selectors = Komponent.selectors;

    var defaultMdp = function defaultMdp(dispatch) {
      return {
        dispatch: dispatch
      };
    };

    mdp = mdp || defaultMdp;
    selectors.set(msp, selectors.get(msp) || msp);
    var selector = (0, _reselect.createSelector)(selectors.get(msp), function (items) {
      return items;
    });
    var clonedComp;
    if (!isClass(Comp)) clonedComp = (0, _utils.cloneFunc)(Comp, function (props) {
      props = clonedComp.connectedProps(props);
      var thiss = props[rand] || props.component || this;
      console.log('propsrand', thiss);

      if (!thiss || thiss === Window) {
        thiss = new _react["default"].Component(props);
        if (Comp.prototype instanceof _react["default"].Component) proto.set(thiss, Comp.prototype);else proto.set(thiss, proto.set((0, _utils.clone)(Comp.prototype), _react["default"].Component.prototype));
      }

      _subscriber.subscribeToStore.call(thiss, store(), selector, selector, 'customConnect');

      return Comp.call(thiss, props);
    });
    /*
          if (!isClass(Comp)) clonedComp = cloneFunc(Comp,function(props) {
             let thiss = props[rand] || props.component || this
             props = connectedProps(props)
             if (!thiss || thiss === Window) {
                thiss = new React.Component(props)
                if (Comp.prototye instanceof React.Component) 
                   proto.set(thiss,proto.get(this))
             }
             subscribeToStore.call(thiss,store(),selector,selector)
             return Comp.call(thiss,props)
          }) */
    else clonedComp = (0, _utils.cloneFunc)(Comp, function (props) {
        props = clonedComp.connectedProps(props);
        var theStore = Comp.store || store();
        var Con = this.constructor;
        console.log('thister', this);
        var thiss = !this || this === Window ? new Con(props) : this;

        _subscriber.subscribeToStore.call(thiss, theStore, selector, selector);

        return thiss;
      });
    Object.defineProperty(clonedComp, 'name', {
      value: 'Connected' + Comp.name
    });

    clonedComp.connectedProps = function (prps) {
      var mappedItems = function mappedItems() {
        return selector(store().getState(), prps);
      };

      var newProps = _objectSpread(_objectSpread({}, prps), mdp(store().dispatch));

      Object.keys(mappedItems()).forEach(function (key) {
        Object.defineProperty(newProps, key, {
          get: function get() {
            return mappedItems()[key];
          },
          configurable: true
        });
      });
      return newProps;
    };

    return clonedComp;
    /*
    var newClassName = Comp.name+'Connector'
     const NewClass = {[newClassName]: function(props) {
       let Parent = proto.get(this.constructor)
       console.error('instantiating new Parent from NewClass in the Connector')
       const thiss = new Parent(updateProps({...props}))
       subscribeToStore.call(thiss,Parent.store,selector,selector)
       
       const unsub = Parent.store.subscribe(function() {
          thiss.props = updateProps({...thiss.props})
       }) 
        console.error('new Connector')
       console.log(thiss)
       return thiss
       
    }}[newClassName]
    proto.set(NewClass,Comp)
    proto.set(NewClass.prototype,Comp.prototype)
    Object.defineProperty(NewClass,'name',{ value: Comp.name+'Connector', writable:false})
    
    return NewClass
    */
  };
}