"use strict";

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

var _global;

try {
  _global = global;
} catch (_unused) {
  global = window;
}

var DOM = module.exports = function DOM() {
  for (var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++) {
    arg[_key] = arguments[_key];
  }

  // require('jsdom-global')()
  var jsdom = require("jsdom");

  var JSDOM = jsdom.JSDOM;

  var DOM = /*#__PURE__*/function (_JSDOM) {
    _inherits(DOM, _JSDOM);

    var _super = _createSuper(DOM);

    function DOM() {
      var _this;

      for (var _len2 = arguments.length, arg = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        arg[_key2] = arguments[_key2];
      }

      _classCallCheck(this, DOM);

      if (!arg[1]) arg[1] = {
        runScripts: "dangerously"
      };
      if (!arg[0]) arg[0] = "<!doctype html>\n          <html lang=\"en\">\n          <head>\n            <meta charset=\"utf-8\">\n            <title></title>\n          </head>\n          <body>\n          </body>\n          </html>";
      _this = _super.call.apply(_super, [this].concat(arg));

      var self = _assertThisInitialized(_this);

      var env = _global.document && _global.document.constructor.name === 'HTMLDocument' ? 'web' : 'node';

      var _window = arguments.length || env === 'node' ? self.window : window;

      var _document = _window.document;
      var docHandler = {
        get: function get(ob, prop, prox) {
          if (prop === '{{target}}') return ob;
          var match = /^{{(.*)}}$/.exec(prop);

          if (match && match[1]) {
            prop = match[1];
            ob = self;
          }

          if (prop === 'window') return new Proxy(_window, {
            get: function get(obj, key) {
              if (key === 'document') return prox;
              if (key in obj) return obj[key];
              if (key in self) return prox[key];
            }
          });
          if (ob.hasOwnProperty(prop)) return ob[prop];
          if (prop in DOM.prototype) return typeof self[prop] === 'function' ? self[prop].bind(self) : self[prop];
          if (prop in self) return self[prop];
          var elem = ob.getElementsByTagName(prop);
          if (elem && elem.length === 1) elem = elem[0];
          if (typeof elem !== 'undefined') return elem;
        }
      };
      var docProx = new Proxy(_document, docHandler);
      return _possibleConstructorReturn(_this, docProx);
    }

    _createClass(DOM, [{
      key: "elements",
      value: function elements(key, val) {
        if (key === 'class') return this.getElementsByClassName(key);else if (key === 'tag') return this.getElementsByTagName(key);

        var query = function query(cb) {
          return _toConsumableArray(document.querySelectorAll("*")).filter(function (item) {
            return cb(item);
          });
        };

        if (arguments.length === 1 && _typeof(key) === 'object') {
          return query(function (item) {
            return Object.keys(item).every(function (key) {
              return item.getAttribute(key) === val;
            });
          });
        }

        return query(function (item) {
          return item.getAttribute(key) === val;
        });
      }
    }, {
      key: "create",
      value: function create(type, attributes, appendTo) {
        var newEl,
            text = type;
        /*
        let match = /^<([^ ]*?) .*?(?:>?)(.*)(?:<\/(?:[^ ].*)>|\/>)/gi.exec(text)
        */

        if (text.trim().split(" ").length > 1 && text.includes('<')) {
          if (_typeof(attributes) === 'object') {
            appendTo = attributes;
            attributes = undefined;
          }

          try {
            var tempEl = document.createElement('div');
            var tempId = 'reactKomponentDOMTemporaryElement';
            tempEl.setAttribute("id", tempId);
            tempEl.innerHTML = text;
            newEl = tempEl.childNodes[0];
            tempEl.remove();
          } catch (err) {
            throw err;
          }
        }
        /*
        let pattern1 = `^<${type}.*?(?:>|.*?\/>)(.*?)(?:<?)\/(?:${type}?)`
        let pattern2 = `([^ ]*)=(?:["|'])([^ ]*?)["|']`
        */


        newEl = newEl || this.window.document.createElement(type);
        if (attributes) Object.keys(attributes).forEach(function (key) {
          return newEl.setAttribute(key, attributes[key]);
        });
        if (appendTo) appendTo.appendChild(newEl);
        Object.setPrototypeOf(newEl, Object.setPrototypeOf({
          set: function set() {
            this.setAttribute.apply(this, arguments);
            return this;
          }
        }, Object.getPrototypeOf(newEl)));
        return newEl;
      }
    }, {
      key: "tags",
      value: function tags(name) {
        return this.getElementsByTagName(name);
      }
    }, {
      key: "tag",
      value: function tag(name) {
        return this.tags(name)[0];
      }
    }, {
      key: "html",
      value: function html(_html) {
        if (!_html) {
          var prop = _global.document && this === _global.document ? 'outerHTML' : 'innerHTML';
          this.getElementsByTagName('html')[prop] = _html;
          return this.tag('html').outerHTML;
        }

        var newJdom = _html instanceof DOM ? _html : new DOM(_html);
        var newHTML = this.tag('html').innerHTML = newJdom(_html).tag('html').innerHTML;
        return newHTML;
      }
    }, {
      key: "query",
      value: function query(search) {
        return this.querySelector(search);
      }
    }, {
      key: "queryAll",
      value: function queryAll(search) {
        return this.querySelectorAll(search);
      }
    }], [{
      key: Symbol.hasInstance,
      value: function value(instance) {
        return instance['{{constructor}}'].prototype instanceof this;
      }
    }]);

    return DOM;
  }(JSDOM);

  return _construct(DOM, arg);
};

DOM["default"] = DOM;