"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function webpackUniversalModuleDefinition(root, factory) {
  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && (typeof module === "undefined" ? "undefined" : _typeof(module)) === 'object') module.exports = factory();else if (typeof define === 'function' && define.amd) define([], factory);else if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') exports["index-webpack-compiled"] = factory();else root["index-webpack-compiled"] = factory();
})(void 0, function () {
  return exports.ids = ["main"];
  exports.modules = {
    /***/
    "path":
    /***/
    function path(module, exports) {
      module.exports = require("path");
      /***/
    }
  };
  ;
});