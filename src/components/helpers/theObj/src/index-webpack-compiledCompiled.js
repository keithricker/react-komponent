"use strict";

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray2(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*! For license information please see index-webpack-compiled.js.LICENSE.txt */
(function () {
  var e = {
    418: function _(e) {
      "use strict";

      var t = Object.getOwnPropertySymbols,
          r = Object.prototype.hasOwnProperty,
          n = Object.prototype.propertyIsEnumerable;

      function o(e) {
        if (null == e) throw new TypeError("Object.assign cannot be called with null or undefined");
        return Object(e);
      }

      e.exports = function () {
        try {
          if (!Object.assign) return !1;
          var e = new String("abc");
          if (e[5] = "de", "5" === Object.getOwnPropertyNames(e)[0]) return !1;

          for (var t = {}, r = 0; r < 10; r++) {
            t["_" + String.fromCharCode(r)] = r;
          }

          if ("0123456789" !== Object.getOwnPropertyNames(t).map(function (e) {
            return t[e];
          }).join("")) return !1;
          var n = {};
          return "abcdefghijklmnopqrst".split("").forEach(function (e) {
            n[e] = e;
          }), "abcdefghijklmnopqrst" === Object.keys(Object.assign({}, n)).join("");
        } catch (e) {
          return !1;
        }
      }() ? Object.assign : function (e, i) {
        for (var c, a, l = o(e), s = 1; s < arguments.length; s++) {
          for (var u in c = Object(arguments[s])) {
            r.call(c, u) && (l[u] = c[u]);
          }

          if (t) {
            a = t(c);

            for (var f = 0; f < a.length; f++) {
              n.call(c, a[f]) && (l[a[f]] = c[a[f]]);
            }
          }
        }

        return l;
      };
    },
    763: function _(e, t, r) {
      var _r = r(562),
          n = _r.randomString,
          o = new WeakMap(),
          i = new WeakMap(),
          c = function c(e, t) {
        return o.has(e) ? arguments.hasOwnProperty(1) ? c.set.apply(c, arguments) : c.get(e) : c.get.apply(c, arguments);
      };

      Reflect.ownKeys(WeakMap.prototype).forEach(function (e) {
        c[e] = "function" == typeof WeakMap.prototype[e] ? WeakMap.prototype[e].bind(o) : WeakMap.prototype[e];
      }), c.get = function (e, t) {
        var _arguments = arguments;

        var r = {},
            n = function n() {
          return _arguments.hasOwnProperty(1);
        };

        return !n() && o.has(e) || o.has(e) || c.set(e, n() ? t : r), o.get(e);
      }, c.set = function (e, t) {
        if (o.has(e)) return o.set(e, t);
        var r = {
          get: function get(n, o, c) {
            if ("randomString" === o) {
              if (i.get(r).handedOutString) return;
              return i.get(r).handedOutString = !0, i.get(r).randomString;
            }

            return "{{target}}" === o || "{{handler}}" === o ? new Proxy({}, {
              get: function get(e, n) {
                if (n === i.get(r).randomString) return "{{target}}" === o ? t : this;
              },
              set: function set() {
                return !0;
              }
            }) : "{{isProxy}}" === o || ("function" == typeof t[o] ? t[o].bind(e) : t[o]);
          },
          set: function set(e, r, n) {
            return !!(t[r] = n);
          }
        };
        return i.set(r, {
          randomString: n()
        }), o.set(e, new Proxy({}, r));
      }, e.exports = c, e.exports["default"] = c;
    },
    19: function _(e, t, r) {
      var n = r(763),
          o = function o() {
        var _r2;

        return (_r2 = r(562)).clone.apply(_r2, arguments);
      },
          i = function i(e, t) {
        var r = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
        var n = arguments.length > 3 ? arguments[3] : undefined;
        var o = {};
        return t ? (Reflect.ownKeys(t).filter(function (e) {
          return !r.includes(e);
        }).forEach(function (e) {
          var r = Object.getOwnPropertyDescriptor(t, e);

          if (n) {
            var _e = _objectSpread({}, r);

            "function" == typeof r.value && (r.value = r.value.bind(n)), "function" == typeof r.get && (r.get = function () {
              var r;

              try {
                r = _e.call(n);
              } catch (_unused) {
                try {
                  r = _e.get.call(this);
                } catch (_unused2) {
                  r = _e.get.call(t);
                }
              }

              return "function" == typeof r ? r.bind(n) : r;
            });
          }

          o[e] = r;
        }), Object.defineProperties(e, o), e) : e;
      },
          c = function c(e, t, r) {
        var n;
        if (Object(e) !== e) return e;
        if (arguments.length < 3 && (1 === arguments.length ? (n = {
          value: e
        }, e = void 0) : t && "string" != typeof t && "symbol" != _typeof(t) && (r = t, n = {
          value: e
        }, e = void 0)), t && e && !(t in e)) return e[t];

        if (n = n || function () {
          if (n = Object.getOwnPropertyDescriptor(e, t), n) return n;
          var r = Object.setPrototypeOf({}, e);

          for (; r = Object.getPrototypeOf(r);) {
            r.hasOwnProperty(t) && (n = Object.getOwnPropertyDescriptor(r, t));
          }

          return n;
        }(), r) {
          var _e2 = Array("value", "get").find(function (e) {
            return "function" == typeof n[e] && "constructor" !== t;
          });

          _e2 && (n[_e2] = n[_e2].bind(r));
        }

        if (n.value) return n.value;
        var o = e ? n.get.call(e) : n.get();
        return r && "function" == typeof o && "constructor" !== t ? o.bind(r) : o;
      },
          a = function () {
        var e = /*#__PURE__*/function () {
          function e() {
            for (var _len = arguments.length, _e3 = new Array(_len), _key = 0; _key < _len; _key++) {
              _e3[_key] = arguments[_key];
            }

            _classCallCheck(this, e);

            n(this).newTarget = !0;
            var t = this,
                r = _e3[0],
                a = _e3[1],
                l = 1 === arguments.length ? r : {
              handler: a,
              target: r
            };
            if (!l.target) return;
            l.actions = l.actions || [], a = l.handler || {}, l.handler || Object.defineProperty(l, "handler", {
              get: function get() {
                return a;
              },
              set: function set(e) {
                return i(a, e), i(t.properties, hander, Reflect.ownKeys(t.properties)), !!Object.defineProperty(this, "handler", {
                  value: a,
                  configurable: !0,
                  enumerable: !0,
                  writable: !0
                });
              },
              enumerable: !0,
              configurable: !0
            });
            var s = l,
                u = new Proxy(s.target, this);
            s.clone && (s.target = s.clone, s.virtualTarget = s.clone, s.bind = s.clone), s.properties, s.newTarget = !0, n.set(this, s), s.bind === s.target && delete s.bind;
            var f = i({}, Reflect),
                p = {
              get: function get(e, r, n) {
                var _s$handler;

                var o,
                    i = [e = e !== s.target ? e : s.virtualTarget || s.target, r, n = n !== u ? n : s.bind || s.clone || n],
                    c = "function" == typeof s.properties ? s.properties.apply(s, i) : s.properties,
                    a = e === s.primary ? s.alternate : e,
                    l = [],
                    f = s.handler && s.handler.get ? (_s$handler = s.handler).get.apply(_s$handler, i) : Reflect.get(e, r, n);
                return c && r in c && l.push([c, r, n]), c && c["default"] && l.push([c["default"].apply(c, i)]), l.push([f]), a && l.push([a, r, n]), l.some(function (e) {
                  if (o = t.getProp.apply(t, _toConsumableArray2(e)), void 0 !== o) return !0;
                }), o = void 0 !== o ? o : r in Object.getPrototypeOf(this) ? this[r] : void 0, o;
              },

              get properties() {
                var e = n.get(this);
                return "object" != _typeof(e.properties) && "function" != typeof e.properties ? {} : function (t, r, n) {
                  return t = t !== e.target ? t : e.clone || e.virtualTarget || t, n = n !== u ? n : e.bind || e.clone, "object" == _typeof(e.properties) ? c(Reflect.get(e.properties, r, t), n) : c(e.properties.call(e, t, r, n), n);
                };
              },

              set: function set(e, r, o) {
                var i = n.get(t);
                if (!Reflect.isExtensible(i.target)) return !0;

                if (Reflect.hasOwnProperty(i.target, r)) {
                  var _e9 = Object.getOwnPropertyDescriptor(i.target, r);

                  if (!1 === _e9.configurable && !1 === _e9.writable) return !0;
                }

                i.virtualTarget && (e = i.virtualTarget);
                var c = Object.getOwnPropertyDescriptor(this.properties, r);
                return c && "function" === c.set ? this.properties[r] === o : i.handler.set ? !!i.handler.set(e, r, o) : !!(e[r] = o);
              },
              has: function has(e, r) {
                var o = n.get(t),
                    i = o.virtualTarget;
                if (!Reflect.isExtensible(o.target)) return Reflect.has(o.target);
                if (!i) return Reflect.has(e, r);
                e = i;
                var c = Object.getOwnPropertyDescriptor(e, r);
                return !(!c || !1 !== c.configurable) || Reflect.has(i, r);
              },
              getPrototypeOf: function getPrototypeOf(e) {
                var o = n.get(t),
                    i = o.virtualTarget;

                for (var _len2 = arguments.length, r = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                  r[_key2 - 1] = arguments[_key2];
                }

                return i && (e = i), Reflect.isExtensible(o.target) || (e = o.target), Reflect.getPrototypeOf.apply(Reflect, [e].concat(r));
              },
              setPrototypeOf: function setPrototypeOf(e) {
                var o = n.get(t),
                    i = o.virtualTarget;

                for (var _len3 = arguments.length, r = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                  r[_key3 - 1] = arguments[_key3];
                }

                return i && (e = i), Reflect.isExtensible(o.target) || (e = o.target), Reflect.setPrototypeOf.apply(Reflect, [e].concat(r));
              },
              ownKeys: function ownKeys(e) {
                var r = n.get(t);
                if (!Reflect.isExtensible(r.target)) return Reflect.ownKeys(r.target);
                var o = r.virtualTarget;
                o && (e = o);
                var i = Reflect.ownKeys(e);
                if (!o) return i;
                var c = new Set(i);
                return Object.entries(Object.getOwnPropertyDescriptors(r.target)).forEach(function (_ref) {
                  var _ref2 = _slicedToArray(_ref, 2),
                      e = _ref2[0],
                      t = _ref2[1];

                  !1 !== t.configurable && Reflect.isExtensible(r.target) || c.add(e);
                }), _toConsumableArray2(c);
              },
              getOwnPropertyDescriptor: function getOwnPropertyDescriptor(e, r) {
                var o = Object.getOwnPropertyDescriptor,
                    i = n.get(t);
                if (!Reflect.isExtensible(i.target)) return Object.getOwnPropertyDescriptor(i.target, r);
                var c = o(e, r);
                if (!i || !i.VirtualTarget) return c;
                var a = i.virtualTarget;
                if (!a) return c;
                var l = o(a, r);
                return !l && (c && !1 === c.configurable || c && !Reflect.isExtensible(e)) ? c : (l.configurable = !c || c.configurable, c && !1 === c.configurable && !1 === c.writable ? c : l);
              },
              defineProperty: function defineProperty(e, r, o) {
                var i = n.get(t);
                if (!(r in i.target) && !Reflect.isExtensible(i.target)) return;
                var c = Object.getOwnPropertyDescriptor(e, r);
                return o.configurable = !c || !("configurable" in c) || c.configurable, e = n.get(e).virtualTarget || e, n.get(e).actions && n.get(e).actions.push({
                  key: "defineProperty",
                  action: function action() {
                    var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : e;
                    return Object.defineProperty(t, r, o);
                  },
                  method: Object.defineProperty,
                  arguments: Array.prototype.slice.call(arguments)
                }), Object.defineProperty(e, r, o) || void 0;
              },
              deleteProperty: function deleteProperty() {
                var r = n.get(t).virtualTarget;

                for (var _len4 = arguments.length, e = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                  e[_key4] = arguments[_key4];
                }

                return r && (ob = r), e[0] = ob, Reflect.deleteProperty.apply(Reflect, e);
              }
            };
            a.defaults || Object.defineProperty(a, "defaults", {
              get: function get() {
                var e = n.get(t);
                return new Proxy(f, {
                  get: function get(t, r) {
                    if ("get" === r) return t[r];
                    e.virtualTarget || e.clone;
                    var n = "function" == typeof p[r] ? p[r] : t[r];
                    return function (t) {
                      for (var _len5 = arguments.length, o = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
                        o[_key5 - 1] = arguments[_key5];
                      }

                      var i = o[1];
                      return t = t !== e.target ? t : e.virtualTarget || t, "get" !== r && "set" !== r || (i = "set" === r ? t : e.bind || t), e.actions && e.actions.push({
                        prop: r,
                        action: function action() {
                          var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : t;
                          return n.apply(void 0, [e].concat(o));
                        },
                        arguments: Array.prototype.slice.call(arguments),
                        method: r,
                        "function": n
                      }), n.apply(void 0, [t].concat(o));
                    };
                  }
                });
              },
              set: function set(_e4) {
                return i(f, _e4), !0;
              },
              enumerable: !0,
              configurable: !0
            });
            var y = Reflect.ownKeys(p).filter(function (_e5) {
              return !("function" == typeof Reflect[_e5] && "get" !== _e5 && "function" == typeof s.handler[_e5]);
            });
            return i(this.properties, p), i(this, a, y, this), function (e) {
              Reflect.ownKeys(Reflect).forEach(function (t) {
                var r = e[t];
                Object.defineProperty(e, t, {
                  value: function value(e) {
                    for (var _len6 = arguments.length, i = new Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
                      i[_key6 - 1] = arguments[_key6];
                    }

                    var c = n.get(this),
                        a = "function" == typeof r ? r : Reflect[t];

                    if (c.clone && (e = o), c.virtualTarget && (e = c.virtualTarget), "get" === t || "set" === t) {
                      var _e10 = c.bind || c.clone;

                      i[2] = _e10;
                    }

                    return c.actions && c.actions.push({
                      key: t,
                      action: function action() {
                        var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : e;
                        return a.apply(void 0, [t].concat(i));
                      },
                      arguments: Array.prototype.slice.call(arguments),
                      method: t,
                      "function": a
                    }), a.apply(void 0, [e].concat(i));
                  }
                });
              });
            }(this), n(this).newTarget = !1, u;
          }

          _createClass(e, [{
            key: "{{handler}}",
            get: function get() {
              return this["{{handler}}"] || this;
            }
          }, {
            key: "{{target}}",
            get: function get() {
              return n.get(this).target["{{target}}"] || n.get(this).target;
            }
          }, {
            key: "_get",
            get: function get() {
              if (n(this).newTarget) return new Proxy(this, {
                set: function set(_e6, t, r) {
                  return _e6.define.get(t, r);
                }
              });
            }
          }, {
            key: "properties",
            get: function get() {
              if (n(this).newTarget) return this;
            },
            set: function set(_e7) {
              return i(this, _e7), !0;
            }
          }, {
            key: "define",
            value: function define() {
              return Object.defineProperty.bind(null, this);
            }
          }, {
            key: "defineProps",
            value: function defineProps() {
              return Object.defineProperties;
            }
          }, {
            key: "getProp",
            value: function getProp() {
              return c.apply(void 0, arguments);
            }
          }, {
            key: "keys",
            get: function get() {
              return Reflect.ownKeys(this);
            }
          }], [{
            key: "swappable",
            value: function swappable(t, r, c) {
              (r = r || {}).actions = [];
              var a = {};
              n.set(a, {
                archive: [t],
                actions: []
              });
              var l = o(t);
              n.has(t) || n.set(t, {
                archive: [l]
              });
              var s = n.get(t).archive;
              y(t);
              var u = {
                target: a,

                get properties() {
                  return t;
                },

                get alternate() {
                  return {
                    "{{swap}}": y,
                    "{{rollback}}": rollback,
                    "{{archive}}": s,
                    "{{clone}}": klone
                  };
                },

                get bind() {
                  return t;
                },

                get virtualTarget() {
                  return t;
                }

              };
              u.handler = r, u.actions = r.actions;
              var f = u.handler.get;

              u.handler.get = function (e, t, r) {
                var o;
                if (f && (o = f(e, t, r), void 0 !== o)) return u.actions.push({
                  key: t,
                  action: function action() {
                    var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : e;
                    return f(n, t, r);
                  },
                  arguments: Array.prototype.slice.call(arguments),
                  method: "get",
                  "function": f
                }), o;
                var i = Reflect.get.apply(Reflect, arguments),
                    c = "function" == typeof i ? i.bind(e) : i;
                return n.get(e) || n.set(e, {
                  actions: []
                }), n.get(e).actions.push({
                  key: t,
                  action: function action() {
                    var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : e;
                    return Reflect.get(n, t, r);
                  },
                  arguments: Array.prototype.slice.call(arguments),
                  method: "get",
                  "function": Reflect.get
                }), c;
              };

              var p = new e(u);

              function y(e, r) {
                return t !== e && (l = o(t), n.set(l, {
                  original: t
                }), n.get(a).archive.push(e), n.has(t) || n.set(t, {
                  archive: [],
                  actions: []
                }), s = n.get(t).archive, s.push(l)), t = e, r ? r(e, u) : p;
              }

              return r.swap = y, r.rollback = function () {
                return t = s.pop(), l = s[s.length - 1] || o(t), n.has(l) || n.set(l, {
                  original: t
                }), s.length || s.push(l), p;
              }, r.klone = function (e) {
                if (e) return u.apply(e), e;
              }, r.refresh = function () {
                var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : t;
                var r = arguments.length > 1 ? arguments[1] : undefined;
                return Reflect.ownKeys(a).filter(function (e) {
                  return !r.includes(e);
                }).forEach(function (e) {
                  delete a[e];
                }), i(a, e, function (t, r) {
                  return setProp(e, t, r);
                });
              }, p;
            }
          }]);

          return e;
        }();

        var t;
        return t = console.log, console.log = function (e) {
          if (e && e["{{target}}"]) {
            var _t = function _t(e) {
              _classCallCheck(this, _t);

              return Object.defineProperties(this, Object.getOwnPropertyDescriptors(e)), Object.setPrototypeOf(this, Object.getPrototypeOf(e)), this;
            };

            var _r3 = new _t(e["{{target}}"]);

            arguments[0] = _r3;
          }

          t.apply(console, arguments);
        }, e;
      }();

      e.exports = a, a["default"] = a;
    },
    562: function _(e, t, r) {
      var n = r(294),
          o = (r(622), function () {
        var t = r(19)["default"];

        for (var _len7 = arguments.length, e = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
          e[_key7] = arguments[_key7];
        }

        return e.length ? _construct(t, e) : t;
      }),
          i = {
        get: Object.getPrototypeOf,
        set: Object.setPrototypeOf
      };
      var c;

      try {
        c = window;
      } catch (_unused3) {
        c = r.g;
      }

      function a(e) {
        return e.charAt(0).toUpperCase() + e.slice(1);
      }

      function l(e, t) {
        return i.set(e, i.set(t, i.get(e)));
      }

      var s = e.exports = {
        get _typeof() {
          var e = function e(_e11, t) {
            var r = (n = {}.toString.call(_e11).split("[object ").join("").split("]")[0]).charAt(0).toLowerCase() + n.slice(1);
            var n;
            var o = !(t !== r),
                i = t ? t.split(" ") : [];
            return i.forEach(function (e, t) {
              "and" !== e && "or" !== e && ("or" === i[t + 1] && (o = !(r !== e && r !== t + 2)), "and" === i[t + 1] && (o = !(r !== e || r !== t + 2)));
            }), "string" == typeof t ? o : r;
          };

          return e["class"] = function (t) {
            return c[a(e(t))];
          }, e;
        },

        entries: function entries(e) {
          return Reflect.ownKeys(e).map(function (t) {
            var r = [t, ""];
            return Object.defineProperty(r, 1, Object.getOwnPropertyDescriptor(e, t)), r;
          });
        },
        _undef: function _undef(e) {
          return void 0 === e;
        },
        isURL: function isURL(e) {
          return "string" == typeof e && (s.isURL.pattern || (s.isURL.pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/), !!s.isURL.pattern.test(e));
        },
        isJSON: function isJSON(e) {
          return "string" == typeof e && ((e = e.trim()).match(/\{[^{}]+\}/) || [])[0] === e;
        },
        randomString: function randomString() {
          var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 32;
          return Math.round(Math.pow(36, e + 1) - Math.random() * Math.pow(36, e)).toString(36).slice(1);
        },
        Problem: /*#__PURE__*/function (_Error) {
          _inherits(Problem, _Error);

          var _super = _createSuper(Problem);

          function Problem() {
            _classCallCheck(this, Problem);

            for (var _len8 = arguments.length, e = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
              e[_key8] = arguments[_key8];
            }

            return _super.call.apply(_super, [this].concat(e));
          }

          _createClass(Problem, [{
            key: "log",
            get: function get() {
              var e,
                  t = new Error().stack,
                  r = {};
              e = t.split("\n"), e[0].includes("log") && e.shift();
              var n = /(\w+)@|at (\w+) \(/g;
              return e.forEach(function (e, t) {
                if (!e.trim()) return;
                var o = n.exec(e);
                if (o && (o = o[1] || o[2]), "string" != typeof o) return;
                r[o] = e;
                var i = e.match(isURL.pattern);
                r[o] = i ? i[0] : e;
              }), r;
            }
          }]);

          return Problem;
        }( /*#__PURE__*/_wrapNativeSuper(Error)),
        isClass: function isClass(e) {
          return is["class"](e);
        },
        _last: function _last(e) {
          return _toConsumableArray2(e).pop();
        },
        tryCatch: function tryCatch(e, t) {
          var r, n;

          try {
            r = e();
          } catch (e) {
            n = e;
          }

          return t ? t(r, n) : n || r;
        },
        suppress: function suppress(e, t) {
          var r = s.tryCatch(e);
          return r instanceof Error ? t : r;
        },
        ReflectBind: function () {
          var e = {
            descriptor: function descriptor(e, t) {
              for (var _len9 = arguments.length, r = new Array(_len9 > 2 ? _len9 - 2 : 0), _key9 = 2; _key9 < _len9; _key9++) {
                r[_key9 - 2] = arguments[_key9];
              }

              var _ref3 = 1 === arguments.length ? arguments[0] : {},
                  _ref3$object = _ref3.object,
                  n = _ref3$object === void 0 ? arguments[0] : _ref3$object,
                  _ref3$property = _ref3.property,
                  o = _ref3$property === void 0 ? arguments[1] : _ref3$property,
                  _ref3$descriptor = _ref3.descriptor,
                  i = _ref3$descriptor === void 0 ? Object.getOwnPropertyDescriptor(n, o) : _ref3$descriptor,
                  _ref3$includeSet = _ref3.includeSet,
                  c = _ref3$includeSet === void 0 ? !1 : _ref3$includeSet,
                  _ref3$bind = _ref3.bind,
                  a = _ref3$bind === void 0 ? r : _ref3$bind;

              return a && a.length ? (a && !Array.isArray(a) && (a = [a]), Reflect.ownKeys(i).filter(function (e) {
                return "set" !== e || c;
              }).forEach(function (e) {
                if ("function" == typeof i[e] && "constructor" !== t) {
                  var _i$e;

                  var _t2 = i[e];
                  i[e] = (_i$e = i[e]).bind.apply(_i$e, _toConsumableArray2(a)), Array("bind", "apply", "call").forEach(function (r) {
                    Object.defineProperty(i[e], r, {
                      value: function value() {
                        for (var _len10 = arguments.length, e = new Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
                          e[_key10] = arguments[_key10];
                        }

                        if (e[0]) {
                          var _t3 = [].concat(e),
                              _r4 = _t3[0];

                          _t3.length && !_r4 && (_r4 = this), e[0] = _r4;
                        }

                        return Function.prototype[r].bind(_t2).apply(void 0, e);
                      },
                      configurable: !0,
                      writable: !0,
                      enumerable: !1
                    });
                  });
                }
              }), i) : i;
            },
            ownDescriptor: function ownDescriptor(e, t) {
              for (var _len11 = arguments.length, r = new Array(_len11 > 2 ? _len11 - 2 : 0), _key11 = 2; _key11 < _len11; _key11++) {
                r[_key11 - 2] = arguments[_key11];
              }

              if (e.hasOwnProperty(t)) return this.descriptor.apply(this, [e, t].concat(r));
            },
            get: function get(e, t, r) {
              var n;
              if (1 === arguments.length || !e || Object(e) !== e) return e;
              if (3 === arguments.length && !r) return e ? e[t] : void 0;

              if (2 === arguments.lenght) {
                if (!t) return e;
                r = t = "", n = {
                  value: i
                };
              }

              if (n = n || Reflect.getOwnPropertyDescriptor(e, t), !n) return e[t];
              var o = Array("get", "value").find(function (e) {
                return "function" == typeof n[e];
              });
              if (!o || "value" === o && "constructor" === t) return e[t];
              var i = "get" === o ? n.get.bind(r)() : n.value,
                  c = "function" == typeof i && "constructor" !== t ? i.bind(r) : c;
              return "function" == typeof c && Array("bind", "apply", "call").forEach(function (e) {
                return c[e] = Function.prototype[e].bind(i);
              }), c;
            }
          },
              t = function t() {
            for (var _len12 = arguments.length, t = new Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
              t[_key12] = arguments[_key12];
            }

            return t.length ? (Reflect.ownKeys(e).forEach(function (r) {
              var n = e[r];

              e[r] = function () {
                for (var _len13 = arguments.length, e = new Array(_len13), _key13 = 0; _key13 < _len13; _key13++) {
                  e[_key13] = arguments[_key13];
                }

                return e.splice.apply(e, [2, 0].concat(t)), n.call.apply(n, e);
              };
            }), e) : e;
          };

          return Object.defineProperties(t, Object.getOwnPropertyDescriptors(e)), t;
        }(),
        argsProxy: function argsProxy(e) {
          var t = {};
          return new Proxy(t, {
            get: function get(r, n) {
              if (t[n]) return t[n];
              if ("args" === n) return t;
              var o = Object.keys(t).length;
              return t[n] = e[o], t[n];
            }
          });
        },
        Args: function Args(e) {
          return function () {
            for (var _len14 = arguments.length, t = new Array(_len14), _key14 = 0; _key14 < _len14; _key14++) {
              t[_key14] = arguments[_key14];
            }

            return e(argsProxy(t));
          };
        },
        Funktion: /*#__PURE__*/function (_Function) {
          _inherits(Funktion, _Function);

          var _super2 = _createSuper(Funktion);

          function Funktion(e, t) {
            var _this;

            _classCallCheck(this, Funktion);

            t = arguments[1] || "object" == _typeof(arguments[0]) && arguments[0], e = "function" == typeof arguments[0] ? arguments[0] : t && t["function"] && t["function"], t && delete t["function"];
            var r = t.hasOwnProperty("name") && t.name || e.name || "funktion";

            function n(e, t) {
              for (var _len15 = arguments.length, r = new Array(_len15 > 2 ? _len15 - 2 : 0), _key15 = 2; _key15 < _len15; _key15++) {
                r[_key15 - 2] = arguments[_key15];
              }

              return e.call.apply(e, [t].concat(r));
            }

            delete t.name;

            var o = _defineProperty({}, r, function () {
              for (var _len16 = arguments.length, t = new Array(_len16), _key16 = 0; _key16 < _len16; _key16++) {
                t[_key16] = arguments[_key16];
              }

              var r = argsProxy(t),
                  o = new Proxy(this || c, {
                get: function get(e, n) {
                  return n in e ? e[n] : r && r.hasOwnProperty(n) ? r[n] : "arguments" === n ? [].concat(t) : void 0;
                }
              });
              return r ? n(e, o, r) : n.apply(void 0, [e, o].concat(Array.prototype.slice.call(arguments)));
            })[r];

            return _possibleConstructorReturn(_this, (Object.defineProperty(o, "name", {
              value: r,
              writable: !1,
              enumerable: !1,
              configurable: !0
            }), Array("properties", "static").forEach(function (e) {
              e in t && merge(o, t[e]), delete t[e];
            }), _this = _super2.call(this), t && "__proto__" in t && Object.setPrototypeOf(o, t.__proto__), merge(o, _assertThisInitialized(_this), ["name"]), t && merge(o, t, ["name", "__proto__"]), t.__proto__ || i.set(o, _this.constructor.prototype), o.prototype.constructor = o, o));
          }

          return Funktion;
        }( /*#__PURE__*/_wrapNativeSuper(Function)),
        swap: function swap(e, t) {
          var r = e(),
              n = {},
              o = n;
          return t.forEach(function (e, t) {
            o === n && t === r && (o = e(r));
          }), o === n ? void 0 : o;
        },
        executionTime: function executionTime(e) {
          var t = new Date();
          return e(), new Date() - t;
        },
        contract: function contract(e, t) {
          return isPromise(e) ? t ? e.then(function (e) {
            return t(e);
          }) : e : t ? t(e) : e;
        },
        asyncForEach: function asyncForEach(e, t, r) {
          var n = -1;
          return function o(i) {
            return n === e.length - 1 ? i : (n++, contract(t.call(r, e[n], n, i, e), function (e) {
              return o(i = e);
            }));
          }();
        },
        sequence: function sequence() {
          for (var _len17 = arguments.length, e = new Array(_len17), _key17 = 0; _key17 < _len17; _key17++) {
            e[_key17] = arguments[_key17];
          }

          return 1 === e.length && Array.isArray(e[0]) && (e = e[0]), e.constructor && !Array.isArray(e) && (e = Object.values(e)), asyncForEach(e, function (e, t, r) {
            return e(r);
          });
        },
        mixProx: function mixProx(e, t, r, n) {
          var o = n;
          return new Proxy(e, {
            get: function get(n, i) {
              var c = i in o && o || i in e && e || i in t && t,
                  a = r;
              return c === r && (a = void 0), a ? s.tie(Reflect.get(c[i], a), a) : c[i];
            }
          });
        },
        reverseInherit: function reverseInherit() {},
        bindIt: function bindIt(e, t, r) {
          var n, o;

          if (arguments.length < 3) {
            if (!t) return e;
            if ("string" == typeof t || "symbol" == _typeof(t)) return e[t];
            r = t, n = e;
          }

          return o = [e, t, r].filter(Boolean), n = n || Reflect.get.apply(Reflect, _toConsumableArray2(o)), "function" == typeof n ? n.bind(r) : n;
        },
        _mixin: function _mixin(_ref4) {
          var e = _ref4.target,
              t = _ref4.source,
              _ref4$priority = _ref4.priority,
              r = _ref4$priority === void 0 ? t : _ref4$priority,
              _ref4$bind = _ref4.bind,
              n = _ref4$bind === void 0 ? e : _ref4$bind;

          function i(e) {
            var _arguments2 = arguments;

            var t = function t(_t4) {
              return 1 === _arguments2.length && "string" == typeof _t4 ? ReflectBind.get(e, _t4, f()) : _arguments2.length ? s.suppress(function () {
                return _t4() === e;
              }, _t4 === e) : e;
            },
                r = o().handlers["default"](e);

            return new Proxy(t, r);
          }

          var c = i(e),
              a = i(t),
              u = i(r),
              f = i(n),
              p = function p(e, t) {
            return t ? Obj(e).Type() === Obj(t).Type() : Obj(e).Type()["class"]();
          },
              y = Obj(Obj(a).descriptors).filter(key, function () {
            return (!(key in c) || !u(c())) && (!(key in p(c).prototype) || p(a).prototype instanceof p(c) || p(c).prototype instanceof a() || p(c) === Object || !f(c)) && void 0;
          }).map(function (e, t) {
            return delete t.value, t.get = function () {
              return a(e);
            }, t;
          });

          return l(c, y);
        },
        mixin: function mixin() {
          for (var _len18 = arguments.length, e = new Array(_len18), _key18 = 0; _key18 < _len18; _key18++) {
            e[_key18] = arguments[_key18];
          }

          return _mixin(argsProxy(e));
        },
        captured: function captured() {
          return captue;
        },
        mapFunction: function mapFunction() {
          var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Map();

          function t(r, n) {
            return e.has(r) ? arguments.hasOwnProperty(1) ? e.set.apply(e, arguments) : e.get(r) : t.get.apply(t, arguments);
          }

          return l(t, {}), Reflect.ownKeys(s._typeof["class"](e).prototype).forEach(function (r) {
            Object.getPrototypeOf(t)[r] = "function" == typeof s._typeof["class"](e).prototype[r] ? s._typeof["class"](e).prototype[r].bind(e) : s._typeof["class"](e).prototype[r];
          }), t.get = function (r, n) {
            var _arguments3 = arguments;

            var o = function o() {
              return _arguments3.hasOwnProperty(1);
            };

            return !o() && e.has(r) ? e.get(r) : (e.has(r) || t.set(r, o()), n);
          }, t;
        },
        WeakerMap: /*#__PURE__*/function (_WeakMap) {
          _inherits(WeakerMap, _WeakMap);

          var _super3 = _createSuper(WeakerMap);

          function WeakerMap() {
            var _this2;

            for (var _len19 = arguments.length, e = new Array(_len19), _key19 = 0; _key19 < _len19; _key19++) {
              e[_key19] = arguments[_key19];
            }

            _classCallCheck(this, WeakerMap);

            _this2 = _super3.call.apply(_super3, [this].concat(e));

            var t = _assertThisInitialized(_this2);

            var r = randomString(),
                n = function n(e, r) {
              return t.has(e) ? arguments.hasOwnProperty(1) ? t.set.apply(t, arguments) : t.get(e) : n.get.apply(n, arguments);
            };

            Reflect.ownKeys(WeakMap.prototype).forEach(function (e) {
              n[e] = "function" == typeof WeakMap.prototype[e] ? WeakMap.prototype[e].bind(t) : WeakMap.prototype[e];
            }), n.get = function (e, r) {
              var _arguments4 = arguments;

              var o = {},
                  i = function i() {
                return _arguments4.hasOwnProperty(1);
              };

              return !i() && t.has(e) ? t.get(e) : (t.has(e) || n.set(e, i() ? r : o), i() ? r : o);
            }, n.set = function (e, n) {
              t.has(e) ? t.set(e, n) : t.set(e, new Proxy({}, {
                get: function get(e, t) {
                  return "randomString" === t ? r : t in n ? n[t] : void 0;
                },
                set: function set(e, t, r) {
                  return n[t] = r;
                }
              }));
            };
            return _this2;
          }

          return WeakerMap;
        }( /*#__PURE__*/_wrapNativeSuper(WeakMap)),
        ObjectMap: function (_ObjectMap) {
          function ObjectMap() {
            return _ObjectMap.apply(this, arguments);
          }

          ObjectMap.toString = function () {
            return _ObjectMap.toString();
          };

          return ObjectMap;
        }(function () {
          var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
          vars = r(763), vars["default"](ObjectMap, {
            keys: new WeakMap()
          });
          var t = vars(ObjectMap).keys,
              n = t.set.bind(t);

          t.set = function (e) {
            return "symbol" == _typeof(e) ? n(e, {
              key: e
            }) : n(e);
          };

          var o = function o(e, r, n) {
            _classCallCheck(this, o);

            var _o = Symbol(n || "MapKey");

            return t.set(_o, {
              key: r,
              map: vars(e).map,
              object: vars(a).obj
            }), _o;
          };

          var c;
          if (vars.has(e) || (c = e, vars(c).type = c instanceof Map ? "map" : "object", vars(c).map || (vars(c).map = "object" === vars(c).type ? new Map(entries(c)) : c), "object" === vars(c).type && (vars(c).map = ObjectMap(vars(c).map), vars(vars(c).map).obj = c), vars(c).obj || (vars(c).obj = c)), "object" === vars(e).type) return i.set(e, vars(e).map), e;

          var a = function a(e) {
            return vars(e).map;
          },
              l = function l(e) {
            return vars(e).obj;
          },
              s = function s(e) {
            return vars(e).mpro || (vars(e).mpro = new Proxy(a(e), {
              get: function get(t, r) {
                return a(e)[r];
              }
            })), vars(e).mpro;
          };

          var u = {
            get: function get(e) {
              return "string" != typeof e && "symbol" != _typeof(e) && (e = this.symbolFromKey(this, e)), l(this)[e];
            },
            set: function set(e, t, r) {
              s(this).set(e);
              var n = "string" == typeof e || "symbol" == _typeof(e) ? e : new o(l(this), e, r);
              l(this)[n] = t;
            },
            "delete": function _delete(e) {
              return s(this)["delete"](e), delete l(this)[e];
            },
            has: function has(e) {
              return "string" != typeof e && "symbol" != _typeof(e) && (e = this.symbolFromKey(e)), !!l(this)[e];
            },
            clear: function clear() {
              return s(this).clear(), Obj(l(this)).clear();
            },
            refresh: function refresh() {
              var _this3 = this;

              s(this).forEach(function (e, t) {
                l(_this3).hasOwnProperty(t) || s(_this3)["delete"](t), s(_this3).set(t, ob(_this3)[t]);
              }), entries(l(this)).filter(function () {
                var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ent,
                    _ref6 = _slicedToArray(_ref5, 2),
                    e = _ref6[0],
                    t = _ref6[1];

                return !s(_this3).has(e);
              }).forEach(function () {
                var _ref7 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ent,
                    _ref8 = _slicedToArray(_ref7, 2),
                    e = _ref8[0],
                    t = _ref8[1];

                return s(_this3).set(e, t);
              });
            },
            symbolFromKey: function symbolFromKey(e, r) {
              return Reflect.ownKeys(vars(e).obj).find(function (e) {
                return t.get(e) === e;
              });
            },
            keyFromSymbol: function keyFromSymbol(e, r) {
              return t.get(r).key;
            }
          };
          return "map" === vars(e).type && vars(e).obj !== e || (delete mixin(e, u).constructor, i.set(e, u)), e;
        }),
        classInherit: function classInherit(e, t) {
          var r = i.set({}, e);

          for (; (r = i.get(r)) && i.get(r) !== t;) {
            if (i.get(r) === n.Component) {
              i.set(r, t);
              break;
            }
          }
        },
        objInherit: function objInherit(e, t) {
          var r = i.set({}, e);

          for (; (r = i.get(r)) && (console.log(r.constructor.name), !i.get(r) || i.get(r).constructor !== t);) {
            if (i.get(r) && i.get(r).constructor === n.Component) {
              i.set(r, t.prototype);
              break;
            }
          }
        },
        tie: function tie() {
          var e = function e(t, r) {
            if ("function" != typeof t || t.name.split("bound ")[1]) return t;
            if (!r) return t;
            if (t instanceof e && (t = t.originalFunc), isClass(t)) return console.error("Problem with: \"".concat(t.name, ".\" Tie function can't work with classes. Invalid data type. Ignoring.")), t;
            var n = t.name;

            var o = _defineProperty({}, n, function () {
              var _o$originalFunc, _o$originalFunc2;

              for (var _len20 = arguments.length, e = new Array(_len20), _key20 = 0; _key20 < _len20; _key20++) {
                e[_key20] = arguments[_key20];
              }

              return o.tie.bind ? (_o$originalFunc = o.originalFunc).call.apply(_o$originalFunc, [o.tie.bind].concat(e)) : (_o$originalFunc2 = o.originalFunc).call.apply(_o$originalFunc2, e);
            })[n];

            return Object.setPrototypeOf(o, t), Object.defineProperty(o, "name", {
              value: n
            }), o.originalFunc = t, o.tie = o.tie || function (e) {
              this.tie.bind = e;
            }, r && (o.tie.bind = r), i.set(o, e.prototype), o;
          };

          return i.set(e.prototype, Function.prototype), Array("bind", "call", "apply").forEach(function (t) {
            return e.prototype[t] = function () {
              var _this$originalFunc;

              return (_this$originalFunc = this.originalFunc)[t].apply(_this$originalFunc, arguments);
            };
          }), e;
        },
        cloneFunc: function (_cloneFunc) {
          function cloneFunc(_x, _x2, _x3) {
            return _cloneFunc.apply(this, arguments);
          }

          cloneFunc.toString = function () {
            return _cloneFunc.toString();
          };

          return cloneFunc;
        }(function (e, t, r) {
          var n = e.name;

          var c = _defineProperty({}, n, function _target() {
            var o = r || this;

            for (var _len21 = arguments.length, n = new Array(_len21), _key21 = 0; _key21 < _len21; _key21++) {
              n[_key21] = arguments[_key21];
            }

            return (this instanceof _target ? this.constructor : void 0) ? _construct(e, n) : t.call.apply(t, [o, r].concat(n));
          })[n];

          if (c.prototype = e.prototype, !r) return Object.setPrototypeOf(c, e), Object.defineProperty(c, "name", {
            value: e.name
          }), c;
          var a = {}.apply.forEach(function (n) {
            var o = s.tie(Function.prototype[n], c);

            a[n] = function () {
              var c = r || this;

              if (r = arguments.length <= 0 ? undefined : arguments[0], "bind" === n) {
                var _n2 = cloneFunc(e, t, arguments.length <= 0 ? undefined : arguments[0]),
                    _o2 = s.tie(Function.prototype.bind, _n2);

                return r = c, _o2.apply(void 0, arguments);
              }

              try {
                return o.apply(void 0, arguments);
              } finally {
                r = c;
              }
            };
          }),
              l = o({
            target: e,
            virtualTarget: Object.getPrototypeOf(e),
            properties: a
          });
          return Object.defineProperty(c, "name", {
            value: e.name
          }), i.set(c, l), c;
        }),
        waitFor: function waitFor(e) {
          var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;

          var r = function r(n) {
            "number" == typeof e ? setTimeout(function (e) {
              return n();
            }, e) : e() ? n() : setTimeout(function (e) {
              return r(n);
            }, t);
          };

          return new Promise(r);
        },
        merge: function (_merge) {
          function merge(_x4, _x5, _x6, _x7) {
            return _merge.apply(this, arguments);
          }

          merge.toString = function () {
            return _merge.toString();
          };

          return merge;
        }(function (e, t, r, n) {
          var _e$parentNode;

          if (void 0 === e || void 0 === t) throw new Error("Invalid arguments at merge function. Must have a valid target and source.");
          var o = "function" == typeof r ? r : void 0;
          if (Array.isArray(r) || (r = []), Array.isArray(e) && Array.isArray(t)) return [].concat(_toConsumableArray2(e), _toConsumableArray2(t.filter(function (t) {
            return !r.includes(t) && e;
          })));
          if (e[Symbol.iterator] && t[Symbol.iterator]) return e instanceof HTMLCollection ? (_e$parentNode = e.parentNode).replaceChildren.apply(_e$parentNode, _toConsumableArray2(e.children).concat(_toConsumableArray2(t))) : e.set ? _toConsumableArray2(t).forEach(function (t) {
            return e.set.apply(e, _toConsumableArray2(t));
          }) : e.add && _toConsumableArray2(t).forEach(function (t) {
            return e.add(t);
          }), e;
          if ("element" === s._typeof(e) || "htmlElement" === s._typeof(e)) return "element" === s._typeof(t) || "htmlElement" === s._typeof(t) ? (e.replaceChildren.apply(e, _toConsumableArray2(e.children).concat(_toConsumableArray2(t.children))), Reflect.ownKeys(t).filter(function (e) {
            return "children" !== e && "childNodes" !== e;
          }).forEach(function (r) {
            if (e[r][Symbol.iterator]) try {
              merge(e[r], t[r]);
            } catch (_unused4) {} else try {
              e.setAttribute(r, t[r]);
            } catch (_unused5) {}
          })) : "hTMLCollection" === s._typeof(t) && e.replaceChildren.apply(e, _toConsumableArray(e.children).concat(_toConsumableArray(t))), e.replaceChildren.apply(e, _toConsumableArray2(e.children).concat(_toConsumableArray2(t))), e;
          if (t === Object.prototype) throw new Error("Object prototype");
          var i = function (e) {
            var t = !0;
            if (!Reflect.ownKeys(e).length) return !1;

            try {
              var _r5 = Object.getOwnPropertyDescriptors(Object.defineProperties({}, e));

              t = !(JSON.stringify(_r5) !== JSON.stringify(e) || !Reflect.ownKeys(_r5).every(function (t) {
                return !(JSON.stringify(e[t]) !== JSON.stringify(_r5[t]) || !Reflect.ownKeys(_r5[t]).every(function (e) {
                  return !(_r5[e][e] !== original[e][e]);
                }));
              }));
            } catch (_unused6) {
              t = !1;
            }

            return t;
          }(t) ? t : Object.getOwnPropertyDescriptors(t);
          return Reflect.ownKeys(i).filter(function (e) {
            return !r.includes(e);
          }).forEach(function (r) {
            var c = i[r],
                a = "value" in c ? "value" : "get" in c ? "get" : "set";
            n && (c[a] = "constructor" === r || "set" === r ? c[a] : s.bindIt(c[a], n));
            var l,
                u = Object.getOwnPropertyDescriptor(e, r);

            if (!u || !1 !== u.configurable || !1 !== u.writable || o) {
              if (u && !1 === u.configurable && !o) {
                var _o3;

                try {
                  _o3 = Reflect.get(u, a, e);
                } catch (_unused7) {
                  _o3 = Reflect.get(u, a, t);
                }

                return _o3 && "function" == typeof _o3 && n && (_o3 = _o3.bind(n)), e[r] = _o3, void delete i[r];
              }

              try {
                var _t5;

                o && (_t5 = o(r, c, e), c = !0 === _t5 ? c : _t5 && "object" == _typeof(_t5) && !Array.isArray(_t5) && !_t5 instanceof Error ? _t5 : c, (_t5 instanceof Error || "string" == typeof _t5) && (l = _t5, c = void 0));
              } catch (e) {
                if (e && console.error(e), l) throw l;
              }
            } else delete i[r];
          }), Object.defineProperties(e, i), e;
        }),
        clone: function clone(e) {
          var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : !1;
          var r = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
          var n = arguments.length > 3 ? arguments[3] : undefined;

          if ("function" == typeof e) {
            var _t6;

            (r.length || !1 === arguments[1]) && (_t6 = Object.setPrototypeOf(Object.getOwnPropertyDescriptors(e), Object.getPrototypeOf(e))), e = this.cloneFunc(e, function () {
              return e.apply(void 0, arguments);
            }, n), !1 === arguments[1] && Object.setPrototypeOf(e, Object.getPrototypeOf(_t6)), r.length && r.forEach(function (r) {
              return Object.defineProperty(e, r, _t6[r]);
            });
          }

          var o,
              l,
              u = "function" == typeof r ? r : void 0,
              f = a(s._typeof(e)),
              p = c[f];
          if (Symbol.iterator in e) if (Array.isArray(e)) o = _toConsumableArray2(e).filter(function (e) {
            return !r.includes(e);
          });else if (e instanceof String) {
            if (Object(e) !== e) return e;
            o = Object.setPrototypeOf(String(Object(e).toString()), Object.getPrototypeOf(e));
          } else {
            var _t7 = _toConsumableArray2(e);

            l = _toConsumableArray2(_t7.entries()), l.every(function (e) {
              return Array.isArray(e[1]);
            }) ? l = l.map(function (e) {
              return !r.includes(e[1][1]) && e[1];
            }).filter(Boolean) : l.every(function (t, r) {
              return e.hasOwnProperty(r) && t[1] === e[r];
            }) && (l = l.filter(function (e) {
              return !r.includes(e[1]);
            }));

            var _n3 = s.suppress(function () {
              return new e.constructor(l);
            }, !1);

            if (_n3 && JSON.stringify(_toConsumableArray2(_n3)) === JSON.stringify(l)) o = _n3;else {
              var _e12 = new p(l);

              _e12 && JSON.stringify(_toConsumableArray2(_e12)) === JSON.stringify(l) && (o = _e12);
            }
          }
          o = o || s.suppress(function () {
            return new e.constructor();
          }, new p()), t && i.set(o, i.get(e));
          var y = Object.getOwnPropertyDescriptors(e);
          return t && i.set(y, i.get(e)), "function" != typeof r ? (r.length && Reflect.ownKeys(e).forEach(function (e) {
            r.includes(e) && delete y[e];
          }), Object.defineProperties(o, y)) : (Object.entries(y).forEach(function (_ref9) {
            var _ref10 = _slicedToArray(_ref9, 2),
                t = _ref10[0],
                r = _ref10[1];

            u && (y[t] = u(t, r, e) || y[t]);
          }), Object.defineProperties(o, y));
        },
        getClone: function getClone(e, t) {
          var r = t || this.clone(e, !0, Reflect.ownKeys(e));

          function n() {
            Reflect.ownKeys(e).forEach(function (t) {
              if (!Reflect.has(r, t)) {
                var _n4 = Object.getOwnPropertyDescriptor(e, t);

                Object.defineProperties(r, t, {
                  get: function get() {
                    return e[t];
                  },
                  set: function set(r) {
                    return !!(e[t] = r);
                  },
                  enumerable: _n4.enumerable,
                  configurable: !0
                });
              }
            }), Reflect.ownKeys(r).forEach(function (t) {
              if (!Reflect.has(e, t)) try {
                Reflect.deleteProperty(clone, t);
              } catch (_unused8) {}
            });
          }

          Reflect.ownKeys(e).forEach(function (t) {
            var o = Object.getOwnPropertyDescriptor(e, t),
                i = Object.getOwnPropertyDescriptor(r, t);
            if (!i || !1 !== i.configurable || !1 !== i.writable) if (i && !1 === i.configurable) try {
              r[t] = e[t];
            } catch (_unused9) {} else Object.defineProperty(r, t, {
              get: function get() {
                return n(), Reflect.has(e, t) || Reflect.deleteProperty(r, t), e[t];
              },
              set: function set(r) {
                return Reflect.set(e, t, r), n(), !0;
              },
              configurable: !0,
              enumerable: o.enumerable
            });
          });
          var i = {};
          return Reflect.ownKeys(Reflect).forEach(function (e) {
            return i[e] = function () {
              var _this$defaults;

              return n(), (_this$defaults = this.defaults)[e].apply(_this$defaults, arguments);
            };
          }), Object.setPrototypeOf(r, o({
            target: e,
            virtualTarget: Object.getPrototypeOf(e),
            handler: i
          })), r;
        },
        getLevel: function getLevel(e, t) {
          var r = e,
              n = !1;
          if (void 0 !== r) return function () {
            for (r = i.set({}, r); r = i.get(r);) {
              if (void 0 === r) return;
              if (t(r)) return n = !0, r;
            }
          }(), n ? r : void 0;
        },
        getLevels: function getLevels(e) {
          var t = new Set();
          this.getLevel(e, function (e) {
            if (!e) return !0;
            t.add(e.constructor);
          });
          var r = Array.from(t);

          r.strings = function () {
            return r.map(function (e) {
              return e.constructor.name;
            });
          };
        },
        getDescriptor: function getDescriptor(e, t) {
          var r = this.getLevel(e, function (e) {
            return e && e.hasOwnProperty(t);
          });
          return r ? new Descriptor(r, t) : void 0;
        },
        descriptorValue: function descriptorValue(e, t) {
          if (!e) return;
          var r;
          return 1 === arguments.length && ("get" in e || "value" in e) && (r = e), r = r || Object.getOwnPropertyDescriptor(e, t), r ? r.hasOwnProperty("get") ? r.get : r.value : void 0;
        },
        getStackTrace: function getStackTrace() {
          return new Problem().log;
        },
        safe: function (_safe) {
          function safe(_x8) {
            return _safe.apply(this, arguments);
          }

          safe.toString = function () {
            return _safe.toString();
          };

          return safe;
        }(function (e) {
          var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "get";
          var r = [];
          return o()(e, {
            get: function get(e, n) {
              return "done" !== n && "setVal" !== n && r.push(n), e = e["{{target}}"] || e, "done" === n || "setVal" === n ? function (t) {
                return t && (n = last(r), e[n] = arguments[0]), "done" === n ? e : safe(e[n]);
              } : "get" === t ? n in e ? safe(e[n]) : safe({}) : (e[n] || (e[n] = {}), safe(e[n], "set"));
            },
            set: function set(e, t, r) {
              return e[t] = void 0 === e[t] ? e[t] : r, !0;
            }
          });
        })
      };
      console.log("modexp", e.exports);
    },
    408: function _(e, t, r) {
      "use strict";

      var n = r(418),
          o = "function" == typeof Symbol && Symbol["for"],
          i = o ? Symbol["for"]("react.element") : 60103,
          c = o ? Symbol["for"]("react.portal") : 60106,
          a = o ? Symbol["for"]("react.fragment") : 60107,
          l = o ? Symbol["for"]("react.strict_mode") : 60108,
          s = o ? Symbol["for"]("react.profiler") : 60114,
          u = o ? Symbol["for"]("react.provider") : 60109,
          f = o ? Symbol["for"]("react.context") : 60110,
          p = o ? Symbol["for"]("react.forward_ref") : 60112,
          y = o ? Symbol["for"]("react.suspense") : 60113,
          g = o ? Symbol["for"]("react.memo") : 60115,
          h = o ? Symbol["for"]("react.lazy") : 60116,
          d = "function" == typeof Symbol && Symbol.iterator;

      function b(e) {
        for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, r = 1; r < arguments.length; r++) {
          t += "&args[]=" + encodeURIComponent(arguments[r]);
        }

        return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
      }

      var O = {
        isMounted: function isMounted() {
          return !1;
        },
        enqueueForceUpdate: function enqueueForceUpdate() {},
        enqueueReplaceState: function enqueueReplaceState() {},
        enqueueSetState: function enqueueSetState() {}
      },
          m = {};

      function v(e, t, r) {
        this.props = e, this.context = t, this.refs = m, this.updater = r || O;
      }

      function w() {}

      function j(e, t, r) {
        this.props = e, this.context = t, this.refs = m, this.updater = r || O;
      }

      v.prototype.isReactComponent = {}, v.prototype.setState = function (e, t) {
        if ("object" != _typeof(e) && "function" != typeof e && null != e) throw Error(b(85));
        this.updater.enqueueSetState(this, e, t, "setState");
      }, v.prototype.forceUpdate = function (e) {
        this.updater.enqueueForceUpdate(this, e, "forceUpdate");
      }, w.prototype = v.prototype;
      var P = j.prototype = new w();
      P.constructor = j, n(P, v.prototype), P.isPureReactComponent = !0;
      var R = {
        current: null
      },
          S = Object.prototype.hasOwnProperty,
          E = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
      };

      function x(e, t, r) {
        var n,
            o = {},
            c = null,
            a = null;
        if (null != t) for (n in void 0 !== t.ref && (a = t.ref), void 0 !== t.key && (c = "" + t.key), t) {
          S.call(t, n) && !E.hasOwnProperty(n) && (o[n] = t[n]);
        }
        var l = arguments.length - 2;
        if (1 === l) o.children = r;else if (1 < l) {
          for (var s = Array(l), u = 0; u < l; u++) {
            s[u] = arguments[u + 2];
          }

          o.children = s;
        }
        if (e && e.defaultProps) for (n in l = e.defaultProps) {
          void 0 === o[n] && (o[n] = l[n]);
        }
        return {
          $$typeof: i,
          type: e,
          key: c,
          ref: a,
          props: o,
          _owner: R.current
        };
      }

      function k(e) {
        return "object" == _typeof(e) && null !== e && e.$$typeof === i;
      }

      var _ = /\/+/g,
          T = [];

      function A(e, t, r, n) {
        if (T.length) {
          var o = T.pop();
          return o.result = e, o.keyPrefix = t, o.func = r, o.context = n, o.count = 0, o;
        }

        return {
          result: e,
          keyPrefix: t,
          func: r,
          context: n,
          count: 0
        };
      }

      function C(e) {
        e.result = null, e.keyPrefix = null, e.func = null, e.context = null, e.count = 0, 10 > T.length && T.push(e);
      }

      function M(e, t, r, n) {
        var o = _typeof(e);

        "undefined" !== o && "boolean" !== o || (e = null);
        var a = !1;
        if (null === e) a = !0;else switch (o) {
          case "string":
          case "number":
            a = !0;
            break;

          case "object":
            switch (e.$$typeof) {
              case i:
              case c:
                a = !0;
            }

        }
        if (a) return r(n, e, "" === t ? "." + K(e, 0) : t), 1;
        if (a = 0, t = "" === t ? "." : t + ":", Array.isArray(e)) for (var l = 0; l < e.length; l++) {
          var s = t + K(o = e[l], l);
          a += M(o, s, r, n);
        } else if ("function" == typeof (s = null === e || "object" != _typeof(e) ? null : "function" == typeof (s = d && e[d] || e["@@iterator"]) ? s : null)) for (e = s.call(e), l = 0; !(o = e.next()).done;) {
          a += M(o = o.value, s = t + K(o, l++), r, n);
        } else if ("object" === o) throw r = "" + e, Error(b(31, "[object Object]" === r ? "object with keys {" + Object.keys(e).join(", ") + "}" : r, ""));
        return a;
      }

      function D(e, t, r) {
        return null == e ? 0 : M(e, "", t, r);
      }

      function K(e, t) {
        return "object" == _typeof(e) && null !== e && null != e.key ? function (e) {
          var t = {
            "=": "=0",
            ":": "=2"
          };
          return "$" + ("" + e).replace(/[=:]/g, function (e) {
            return t[e];
          });
        }(e.key) : t.toString(36);
      }

      function F(e, t) {
        e.func.call(e.context, t, e.count++);
      }

      function $(e, t, r) {
        var n = e.result,
            o = e.keyPrefix;
        e = e.func.call(e.context, t, e.count++), Array.isArray(e) ? L(e, n, r, function (e) {
          return e;
        }) : null != e && (k(e) && (e = function (e, t) {
          return {
            $$typeof: i,
            type: e.type,
            key: t,
            ref: e.ref,
            props: e.props,
            _owner: e._owner
          };
        }(e, o + (!e.key || t && t.key === e.key ? "" : ("" + e.key).replace(_, "$&/") + "/") + r)), n.push(e));
      }

      function L(e, t, r, n, o) {
        var i = "";
        null != r && (i = ("" + r).replace(_, "$&/") + "/"), D(e, $, t = A(t, i, n, o)), C(t);
      }

      var I = {
        current: null
      };

      function N() {
        var e = I.current;
        if (null === e) throw Error(b(321));
        return e;
      }

      var W = {
        ReactCurrentDispatcher: I,
        ReactCurrentBatchConfig: {
          suspense: null
        },
        ReactCurrentOwner: R,
        IsSomeRendererActing: {
          current: !1
        },
        assign: n
      };
      t.Children = {
        map: function map(e, t, r) {
          if (null == e) return e;
          var n = [];
          return L(e, n, null, t, r), n;
        },
        forEach: function forEach(e, t, r) {
          if (null == e) return e;
          D(e, F, t = A(null, null, t, r)), C(t);
        },
        count: function count(e) {
          return D(e, function () {
            return null;
          }, null);
        },
        toArray: function toArray(e) {
          var t = [];
          return L(e, t, null, function (e) {
            return e;
          }), t;
        },
        only: function only(e) {
          if (!k(e)) throw Error(b(143));
          return e;
        }
      }, t.Component = v, t.Fragment = a, t.Profiler = s, t.PureComponent = j, t.StrictMode = l, t.Suspense = y, t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W, t.cloneElement = function (e, t, r) {
        if (null == e) throw Error(b(267, e));
        var o = n({}, e.props),
            c = e.key,
            a = e.ref,
            l = e._owner;

        if (null != t) {
          if (void 0 !== t.ref && (a = t.ref, l = R.current), void 0 !== t.key && (c = "" + t.key), e.type && e.type.defaultProps) var s = e.type.defaultProps;

          for (u in t) {
            S.call(t, u) && !E.hasOwnProperty(u) && (o[u] = void 0 === t[u] && void 0 !== s ? s[u] : t[u]);
          }
        }

        var u = arguments.length - 2;
        if (1 === u) o.children = r;else if (1 < u) {
          s = Array(u);

          for (var f = 0; f < u; f++) {
            s[f] = arguments[f + 2];
          }

          o.children = s;
        }
        return {
          $$typeof: i,
          type: e.type,
          key: c,
          ref: a,
          props: o,
          _owner: l
        };
      }, t.createContext = function (e, t) {
        return void 0 === t && (t = null), (e = {
          $$typeof: f,
          _calculateChangedBits: t,
          _currentValue: e,
          _currentValue2: e,
          _threadCount: 0,
          Provider: null,
          Consumer: null
        }).Provider = {
          $$typeof: u,
          _context: e
        }, e.Consumer = e;
      }, t.createElement = x, t.createFactory = function (e) {
        var t = x.bind(null, e);
        return t.type = e, t;
      }, t.createRef = function () {
        return {
          current: null
        };
      }, t.forwardRef = function (e) {
        return {
          $$typeof: p,
          render: e
        };
      }, t.isValidElement = k, t.lazy = function (e) {
        return {
          $$typeof: h,
          _ctor: e,
          _status: -1,
          _result: null
        };
      }, t.memo = function (e, t) {
        return {
          $$typeof: g,
          type: e,
          compare: void 0 === t ? null : t
        };
      }, t.useCallback = function (e, t) {
        return N().useCallback(e, t);
      }, t.useContext = function (e, t) {
        return N().useContext(e, t);
      }, t.useDebugValue = function () {}, t.useEffect = function (e, t) {
        return N().useEffect(e, t);
      }, t.useImperativeHandle = function (e, t, r) {
        return N().useImperativeHandle(e, t, r);
      }, t.useLayoutEffect = function (e, t) {
        return N().useLayoutEffect(e, t);
      }, t.useMemo = function (e, t) {
        return N().useMemo(e, t);
      }, t.useReducer = function (e, t, r) {
        return N().useReducer(e, t, r);
      }, t.useRef = function (e) {
        return N().useRef(e);
      }, t.useState = function (e) {
        return N().useState(e);
      }, t.version = "16.14.0";
    },
    294: function _(e, t, r) {
      "use strict";

      e.exports = r(408);
    },
    622: function _(e) {
      "use strict";

      e.exports = require("path");
    }
  },
      t = {};

  function r(n) {
    var o = t[n];
    if (void 0 !== o) return o.exports;
    var i = t[n] = {
      exports: {}
    };
    return e[n](i, i.exports, r), i.exports;
  }

  r.g = function () {
    if ("object" == (typeof globalThis === "undefined" ? "undefined" : _typeof(globalThis))) return globalThis;

    try {
      return this || new Function("return this")();
    } catch (e) {
      if ("object" == (typeof window === "undefined" ? "undefined" : _typeof(window))) return window;
    }
  }(), r.r = function (e) {
    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
      value: "Module"
    }), Object.defineProperty(e, "__esModule", {
      value: !0
    });
  };
  var n = {};
  (function () {
    "use strict";

    r.r(n), r(763), module.exports = {
      "default": function _default() {
        return "i am a module ";
      }
    };
  })(), module.exports["the-object"] = n;
})();