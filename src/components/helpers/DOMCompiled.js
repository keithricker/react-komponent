"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _construct2 = _interopRequireDefault(require("@babel/runtime/helpers/construct"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapNativeSuper"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var _global;

function globalType() {
  try {
    if (global && global.constructor && global.constructor.name.toLowerCase() === 'window') {
      _global = global;
      return 'window';
    }

    if (window) {
      _global = window;
      return 'window';
    }

    _global = global;
    return 'node';
  } catch (_unused) {
    _global = global;
    return 'node';
  }
}

globalType();
var pv = new WeakMap();
var canUseJsdom;

try {
  canUseJsdom = require('jsdom'); // canUseJsdom = require("jsdom");
} catch (_unused2) {
  canUseJsdom = false;
}

var jsdom = canUseJsdom ? require("jsdom") : {
  JSDOM: /*#__PURE__*/function (_Object) {
    (0, _inherits2["default"])(JSDOM, _Object);

    var _super = _createSuper(JSDOM);

    function JSDOM() {
      (0, _classCallCheck2["default"])(this, JSDOM);
      return _super.apply(this, arguments);
    }

    return JSDOM;
  }( /*#__PURE__*/(0, _wrapNativeSuper2["default"])(Object))
};
var JSDOM = jsdom.JSDOM;

var DOM = /*#__PURE__*/function (_JSDOM) {
  (0, _inherits2["default"])(DOM, _JSDOM);

  var _super2 = _createSuper(DOM);

  function DOM() {
    var _this;

    (0, _classCallCheck2["default"])(this, DOM);

    for (var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++) {
      arg[_key] = arguments[_key];
    }

    var superArgs = [].concat(arg);

    if (!arg[1]) {
      var url;
      if (process && process.env && process.env.serverUrl) url = process.env.serverUrl + "/";
      if (globalType() === "window") url = _global.location.protocol + "//" + _global.location.hostname + "/";
      superArgs[1] = {
        url: url,
        contentType: "text/html",
        runScripts: "dangerously",
        resources: "usable"
      };
    }

    var _window, _document;

    if (arg.length === 1 && arg[0].document && (arg[0].document.constructor.name === "HTMLDocument" || arg[0].document.constructor.name === "Document" && arg[0].document.defaultView)) _window = arg[0];else if (arg.length === 1 && arg[0].constructor && (arg[0].constructor.name === "HTMLDocument" || arg[0].constructor.name === "Document" && arg[0].defaultView)) _window = arg[0].defaultView;else if (!arg[0]) superArgs[0] = "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><title></title></head><body></body></html>";
    _this = _super2.call.apply(_super2, [this].concat((0, _toConsumableArray2["default"])(canUseJsdom ? superArgs : [])));
    var self = (0, _assertThisInitialized2["default"])(_this);
    var env = globalType();
    if (!_window) _window = arg.length || env === "node" ? self.window : {
      document: _document
    };
    if (!_document) _document = _window.document;

    if (!canUseJsdom && !_document) {
      _document = new Document().implementation.createHTMLDocument();
      _window.document = _document;
      var htmlString = typeof arg[0] === "string" ? arg[0] : superArgs[0];

      if (typeof arg[0] !== "string") {
        var _require = require("./utils"),
            ReflectBind = _require.ReflectBind,
            clone = _require.clone;

        Reflect.ownKeys(Document.prototype).forEach(function (key, desc) {
          desc = ReflectBind.descriptor(Document.prototype, key, _document);
          if (desc.value) desc.value = document[key];
          if ((0, _typeof2["default"])(desc.value) === "object") desc.value = clone(desc.value, true);
          Object.defineProperty(_document, key, desc);
        });
      }

      pv.set((0, _assertThisInitialized2["default"])(_this), {
        window: {
          document: _document
        },
        document: _document,
        arguments: superArgs
      });
      htmlString = document.documentElement.outerHTML || document.getElementsByTagName("html")[0].outerHTML;

      _this.html(htmlString);
    } else pv.set((0, _assertThisInitialized2["default"])(_this), {
      window: _window,
      document: _document,
      arguments: superArgs
    });

    var docHandler = {
      get: function get(ob, prop, prox) {
        if (prop === "{{target}}") return self;
        var match = /^{{(.*)}}$/.exec(prop);

        if (match && match[1]) {
          prop = match[1];
          ob = self;
        }

        if (prop === "window") return new Proxy(_window, {
          get: function get(obj, key) {
            if (key === "document") return prox;
            if (key in obj) return obj[key];
            if (key in self) return prox[key];
          }
        });

        if (prop in ob) {
          var prp = Reflect.get(ob, prop, ob);
          return typeof prp === "function" ? prp.bind(ob) : prp;
        }

        if (prop in DOM.prototype) return typeof self[prop] === "function" ? self[prop].bind(self) : self[prop];
        if (prop in self) return self[prop];
        var elem = ob.getElementsByTagName(prop);
        if (elem && elem.length === 1) elem = elem[0];
        if (typeof elem !== "undefined") return elem;
      }
    };
    var docProx = new Proxy(_document, docHandler);
    return (0, _possibleConstructorReturn2["default"])(_this, docProx);
  }

  (0, _createClass2["default"])(DOM, [{
    key: "elements",
    value: function elements(key, val) {
      var _this2 = this;

      if (key === "class") return pv.get(this).document.getElementsByClassName(key);else if (key === "tag") return pv.get(this).document.getElementsByTagName(key);

      var query = function query(cb) {
        return (0, _toConsumableArray2["default"])(pv.get(_this2).document.querySelectorAll("*")).filter(function (item) {
          return cb(item);
        });
      };

      if (arguments.length === 1 && (0, _typeof2["default"])(key) === "object") {
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

      if (text.trim().split(" ").length > 1 && text.includes("<")) {
        if ((0, _typeof2["default"])(attributes) === "object") {
          appendTo = attributes;
          attributes = undefined;
        }

        try {
          var tempEl = document.createElement("div");
          var tempId = "reactKomponentDOMTemporaryElement";
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


      newEl = newEl || pv.get(this).document.createElement(type);
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
      return pv.get(this).document.getElementsByTagName(name);
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
        if (_global.document && pv.get(this).document === _global.document) return pv.get(this).document.documentElement.outerHTML || pv.get(this).document.getElementsByTagName("html")[0].outerHTML;
        return pv.get(this).document.documentElement.outerHTML;
      }

      if (_html instanceof DOM) _html = _html.outerHtml();
      /*
      let args = Array(html,pv.get(this).arguments[1]).filter(Boolean)
      */

      var newHtml = _html;
      if (canUseJsdom) newHtml = new DOM(_html).tag("html").innerHTML;else {
        var match = _html.match(/<html[\s\S]*?>([\s\S]*?)<\/html>/im);

        newHtml = newHtml ? match[1] : newHtml;
      }
      this.tag("html").innerHTML = newHtml;
    }
  }, {
    key: "outerHTML",
    get: function get() {
      console.log("blablablablabla");
      var oh;
      if (this.window && this.window.document === pv.get(this).document && typeof pv.get(this).arguments[0] === "string") oh = this.serialize ? this.serialize() : pv.get(this).document.documentElement.outerHTML;else oh = pv.get(this).document.documentElement.outerHTML;
      return oh;
    }
  }, {
    key: "query",
    value: function query(search) {
      return pv.get(this).document.querySelector(search);
    }
  }, {
    key: "queryAll",
    value: function queryAll(search) {
      return pv.get(this).document.querySelectorAll(search);
    }
  }], [{
    key: Symbol.hasInstance,
    value: function value(instance) {
      if (this.prototype.isPrototypeOf(instance)) return true;
      return !!(instance["{{target}}"] && this.prototype.isPrototypeOf(instance["{{target}}"]));
    }
  }]);
  return DOM;
}(JSDOM);

var DOMClass = DOM;
var domName = "DOM";
var theDom = (0, _defineProperty2["default"])({}, domName, function DOM() {
  for (var _len2 = arguments.length, arg = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    arg[_key2] = arguments[_key2];
  }

  // require('jsdom-global')()
  return (0, _construct2["default"])(DOMClass, arg);
})[domName];

if (canUseJsdom) {
  Reflect.ownKeys(jsdom).filter(function (key) {
    return key !== "constructor";
  }).forEach(function (key) {
    Object.defineProperty(theDom, key, {
      get: function get() {
        return jsdom[key];
      }
    });
  });
}

theDom["default"] = theDom;
module.exports = theDom;