"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = Komponent;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _react = _interopRequireDefault(require("react"));

var _class2 = _interopRequireDefault(require("./class"));

var _privateVariables = _interopRequireDefault(require("./privateVariables"));

var _utils = require("../helpers/utils");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var proto = {
  set: Object.setPrototypeOf,
  get: Object.getPrototypeOf
};
var rand = _privateVariables["default"].randomString;
var rxProxy = new _utils.Standin(_react["default"].Component, {
  get: function get(ob, prop) {
    if (prop === 'variant') return 'rxProxy';
    return prop === 'prototype' ? _react["default"].Component.prototype : _class2["default"][prop];
  }
});

var exProxy = function exProxy(ex) {
  return new _utils.Standin(ex, {
    get: function get(ob, prop) {
      if (prop === 'variant') return 'exProxy';
      return prop === 'prototype' ? ex.prototype : prop in ex ? ex[prop] : _class2["default"][prop];
    }
  });
};

function Komponent(comp, cb, prps) {
  var extensionName = comp.name;

  if ((0, _utils.isClass)(comp)) {
    var target = (0, _utils.getLevel)(comp, function (lvl) {
      return proto.get(lvl) === _react["default"].Component;
    });
    console.log('target', target);
    var newComp = (0, _utils.cloneFunc)(_react["default"].Component, function (pr) {
      var instance = pr[rand] || this;
      console.log('instance', instance);
      return instance;
    });
    var compClassName = comp.name;
    var Extended = (0, _defineProperty2["default"])({}, compClassName, /*#__PURE__*/function (_comp) {
      (0, _inherits2["default"])(_class, _comp);

      var _super = _createSuper(_class);

      function _class(props) {
        var _this;

        (0, _classCallCheck2["default"])(this, _class);
        props = prps ? prps(props) : props;
        var thiss = props[rand] = props[rand] || new comp(props);
        if (cb) thiss = props[rand] = cb.call(thiss, props);
        var backup = proto.get(target);
        proto.set(target, newComp);
        _this = _super.call(this, props);
        proto.set(target, backup); // Object.defineProperty(thiss,'componentName',{value:lowerFirst((thiss.props && thiss.props.component) ? thiss.props.component.constructor.name : thiss.constructor.name),configurable:true,writable:true,enumerable:true})

        /*
        Constructor.call(thiss,props)
        */

        return (0, _possibleConstructorReturn2["default"])(_this, thiss);
      }

      return _class;
    }(comp))[compClassName];
    proto.set(Extended, exProxy(comp));

    if (!comp.prototype instanceof _react["default"].Component) {
      proto.set(Extended.prototype, (0, _utils.clone)(comp.prototype, true));
      proto.set(proto.get(Extended.prototype), _react["default"].Component.prototype);
    }

    Extended.prototype.constructor = Extended;
    Object.defineProperty(Extended, 'name', {
      value: comp.name
    });
    Object.defineProperty(Extended.prototype, 'componentName', {
      get: function get() {
        return (0, _utils.lowerFirst)(this.props && this.props.component ? this.props.component.constructor.name : this.constructor.name);
      },
      configurable: true,
      enumerable: true
    });
    return Extended;
  }

  var extension = (0, _defineProperty2["default"])({}, extensionName, function (props) {
    var thiss = props[rand] || props.component || this;
    var Super = proto.get(thiss.constructor);
    if ((0, _utils.isClass)(Super) && thiss === this) thiss = new Super(props);else Super.call(thiss, props);
    proto.set(thiss, proto.get(this));
    Object.defineProperty(thiss, 'componentName', {
      value: (0, _utils.lowerFirst)(thiss.props && thiss.props.component ? thiss.props.component.constructor.name : thiss.constructor.name),
      configurable: true,
      writable: true,
      enumerable: true
    });
    thiss.initialized = thiss.initialized || false;

    _privateVariables["default"].getSet(thiss, {});

    if (cb) return cb.call(thiss, props);
    return thiss;
  })[extensionName];
  proto.set(extension, rxProxy);
  (0, _utils.merge)(extension.prototype, (0, _utils.clone)(comp.prototype), ['constructor']);
  proto.set(extension.prototype, _react["default"].Component.prototype);
  proto.get(extension.prototype).constructor = extension;
  Object.defineProperty(extension, 'name', {
    value: comp.name
  });
  return extension;
}