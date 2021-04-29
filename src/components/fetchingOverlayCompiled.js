"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = Overlay;

var _react = _interopRequireWildcard(require("react"));

require("./overlay.css");

function Overlay(props) {
  var Component = props.component;

  var Overlay = function Overlay() {
    return props.overlay || /*#__PURE__*/_react["default"].createElement("div", {
      id: "overlay",
      style: {
        display: props.fetching ? 'block' : 'none'
      }
    }, /*#__PURE__*/_react["default"].createElement("p", null, "Loading ..."));
  };

  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(Overlay, null), console.log('rendering the component'), /*#__PURE__*/_react["default"].createElement(Component, null));
}