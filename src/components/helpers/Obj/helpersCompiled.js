"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineEnumerableProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/defineEnumerableProperties"));

var _construct2 = _interopRequireDefault(require("@babel/runtime/helpers/construct"));

var _readOnlyError2 = _interopRequireDefault(require("@babel/runtime/helpers/readOnlyError"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapNativeSuper"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _typeof3 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var _Proxy = require('../_ProxyCompiled');

var privateVars = require('../../Komponent/privateVariablesCompiled');

var esprima = require('esprima');

var escodegen = require('escodegen');

function findDeclarations(code) {
  var ast = esprima.parse(code);
  var funcDecls = [];
  var globalVarDecls = [];
  var funcStack = [];
  var funcs = {
    object: [],
    vars: []
  };

  function visitEachAstNode(root, enter, leave) {
    var prev = root;
    var key;

    function visit(node) {
      prev = node === root ? undefined : prev;
      if (prev) Object.defineProperty(node, 'prev', {
        value: prev,
        enumerable: false,
        writable: true,
        configurable: true
      });
      if (key) Object.defineProperty(node, 'key', {
        value: key,
        enumerable: false,
        writable: true,
        configurable: true
      });

      function isSubNode(key) {
        var child = node[key];
        if (child === null) return false;
        var ty = (0, _typeof3["default"])(child);
        if (ty !== 'object') return false;
        if (child.constructor === Array) return key !== 'range';
        if (key === 'loc') return false;

        if ('type' in child) {
          if (child.type in esprima.Syntax) return true;
          debugger;
          throw new Error('unexpected');
        } else {
          return false;
        }
      }

      enter(node);
      var keys = Object.keys(node);
      var subNodeKeys = keys.filter(isSubNode);
      subNodeKeys.forEach(function (ky) {
        if (node[ky].type === 'ObjectExpression') {
          Object.defineProperty(node[ky], 'prev', {
            value: node,
            enumerable: false,
            writable: true,
            configurable: true
          });
          Object.defineProperty(node[ky], 'key', {
            value: key,
            enumerable: false,
            writable: true,
            configurable: true
          });
          node[ky].properties.forEach(function (prop, ind) {
            Object.defineProperty(prop.value, 'prev', {
              value: prop,
              enumerable: false,
              configurable: true
            });
            Object.defineProperty(prop.value, 'key', {
              value: 'value',
              enumerable: false,
              configurable: true
            });
            var curr = myEnter(prop.value);
            prev = node[ky].properties;
            key = ind;
            if (!curr) visit(prop.value);
          });
          return;
        }

        prev = node;
        key = ky;
        visit(node[ky]);
      });
      leave(node);
      prev = node;
    }

    visit(root);
  }

  function myEnter(node) {
    if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') {
      if (node.id === null || node.id.name === undefined) {
        if (node.prev.property) {
          node.id = {
            name: node.prev.property.name
          };
        } else if (node.prev.type === 'Property') {
          node.id = {
            name: node.prev.key.name
          };
        } else if (node.prev.type === 'Literal') {
          node.id = {
            name: node.prev.name || node.prev.value
          };
        } else if (node.prev.type === 'Identifier') {
          node.id = {
            name: node.prev.value || node.prev.name
          };
        } else if (node.prev.left) {
          node.id = {
            name: node.prev.left.property ? node.prev.left.property.name : undefined
          };
        } else node.id = {
          name: 'anonymous'
        };
      }

      if (Array('anonymous', undefined, null, 'get', 'set', 'default').includes(node.id.name)) return;
      var current = {
        name: node.id.name,
        params: node.params.map(function (p) {
          return p.name;
        }),
        variables: []
      };
      Object.defineProperty(current, 'isDeclaration', {
        value: true,
        enumerable: false,
        writable: true,
        configurable: true
      });
      funcDecls.push(current);
      funcStack.push(current);

      if (node.prev && node.prev.type === 'Property' || node.prev && node.prev.type === 'Identifier' && node.prev.prev && Array.isArray(node.prev.prev) && node.prev.prev[0] && node.prev.prev[0].type === 'Property') {
        funcs.object.push(current);
      } else funcs.vars.push(current);

      return current;
    }

    if (node.type === 'VariableDeclaration') {
      var foundVarNames = node.declarations.map(function (d) {
        return d.id.name;
      });

      if (funcStack.length === 0) {
        globalVarDecls = globalVarDecls.concat(foundVarNames);
      } else {
        var onTopOfStack = funcStack[funcStack.length - 1];
        onTopOfStack.variables = onTopOfStack.variables.concat(foundVarNames);
      }
    }
  }

  function myLeave(node) {
    if (node.type === 'FunctionDeclaration') {
      funcStack.pop();
    }
  }

  visitEachAstNode(ast, myEnter, myLeave);
  return {
    vars: globalVarDecls,
    funcs: funcDecls,

    get names() {
      return this.funcs.map(function (name) {
        return name.name;
      });
    },

    funcdecs: funcs
  };
}

var util = {
  clone: '',
  cloneFunc: '',
  merge: '',
  _typeof: '',
  getLevel: '',
  ReflectBind: ''
};
Reflect.ownKeys(util).forEach(function (key) {
  return util[key] = function () {
    var _require;

    return (_require = require('../utilsCompiled'))[key].apply(_require, arguments);
  };
});

util._typeof["class"] = function () {
  var _require$_typeof;

  return (_require$_typeof = require('../utilsCompiled')._typeof)["class"].apply(_require$_typeof, arguments);
};

util.ReflectBind.descriptor = function () {
  var _require$ReflectBind;

  return (_require$ReflectBind = require('../utilsCompiled').ReflectBind).descriptor.apply(_require$ReflectBind, arguments);
};

var clone = util.clone,
    cloneFunc = util.cloneFunc,
    merge = util.merge,
    _typeof = util._typeof,
    getLevel = util.getLevel,
    ReflectBind = util.ReflectBind;

var _global;

try {
  _global = window;
} catch (_unused) {
  _global = global;
}

var capitalize = function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

var equivalent = function equivalent(thing1, thing2) {
  return JSON.stringify(thing1) === JSON.stringify(thing2) && Reflect.ownKeys(thing1).every(function (key) {
    return thing1[key] === thing2[key];
  });
};

var ownProp = exports.ownProp = function (obj, key) {
  return Reflect.ownKeys(obj).includes(key);
};

var defineProp = exports.defineProp = function (trg, key, desc) {
  for (var _len = arguments.length, bind = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    bind[_key - 3] = arguments[_key];
  }

  if (arguments.length > 3) desc = bind.length === 1 ? boundDescriptor(desc, bind) : ReflectBind.descriptor.apply(ReflectBind, [desc].concat(bind));
  desc = new Descriptor(desc);
  return Object.defineProperty(trg, key, desc);
};

var defineProps = exports.defineProps = function (trg, src) {
  var ex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  for (var _len2 = arguments.length, bind = new Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
    bind[_key2 - 3] = arguments[_key2];
  }

  var descs = {};
  Reflect.ownKeys(src).forEach(function (key) {
    if (ex.includes(key)) return false;
    var trgDesc = Object.getOwnPropertyDescriptor(trg, key);

    if (trgDesc) {
      if (trgDesc.configurable === false && trgDesc.writable === false) return;

      if (trgDesc.configurable === false) {
        var val = src[key].value;

        if ("get" in src[key]) {
          var binds = Array(trg, src[key].object).filter(Boolean);
          binds.forEach(function (bnd) {
            try {
              val = val || src[key].get.call(bnd);
            } catch (_unused2) {}
          });
          if (!val) try {
            val = src[key].get();
          } catch (_unused3) {}
        }

        try {
          trg[key] = val;
        } catch (_unused4) {}

        return;
      }
    }

    return descs[key] = bind.length ? boundDescriptor.apply(void 0, [src[key]].concat(bind)) : src[key];
  });
  return Object.defineProperties(trg, descs);
};

var mixin = exports.mixin = function (target, mix, trg) {
  return Object.setPrototypeOf(target, Object.setPrototypeOf(mix, Object.getPrototypeOf(target)));
};

var entries = exports.entries = function (obj) {
  return Reflect.ownKeys(obj).map(function (key) {
    var ent = [key, ''];
    Object.defineProperty(ent, 1, Object.getOwnPropertyDescriptor(obj, key));
    return ent;
  });
};

var Descriptor = exports.Descriptor = /*#__PURE__*/function () {
  function Descriptor(desc) {
    (0, _classCallCheck2["default"])(this, Descriptor);
    var thisPrivs = privateVars(this);

    if (arguments[1]) {
      thisPrivs.object = arguments[0];
      thisPrivs.key = arguments[1];
    }

    desc = arguments.length === 1 ? desc : Object.getOwnPropertyDescriptor.apply(Object, arguments);
    return Object.defineProperties(this, Object.getOwnPropertyDescriptors(desc));
  }

  (0, _createClass2["default"])(Descriptor, [{
    key: "key",
    get: function get() {
      return privateVars(this).key;
    }
  }, {
    key: "object",
    get: function get() {
      return privateVars(this).object;
    }
  }]);
  return Descriptor;
}();

var Descriptors = exports.Descriptors = /*#__PURE__*/function (_Object) {
  (0, _inherits2["default"])(Descriptors, _Object);

  var _super2 = _createSuper(Descriptors);

  function Descriptors() {
    var _this;

    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2["default"])(this, Descriptors);
    _this = _super2.apply(this, arguments);
    var descs = (0, _assertThisInitialized2["default"])(_this);
    Reflect.ownKeys(obj).forEach(function (key) {
      if (key !== Symbol.iterator) return !!(descs[key] = new Descriptor(obj, key));
      var original = obj[key];
      Object.defineProperty(descs, key, {
        value: function value() {
          var _Reflect$get;

          for (var _len3 = arguments.length, arg = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            arg[_key3] = arguments[_key3];
          }

          if (!this instanceof Descriptors) return original.call.apply(original, [this].concat(arg));
          return (_Reflect$get = Reflect.get(Descriptors.prototype, Symbol.iterator, this)).call.apply(_Reflect$get, [this].concat(arg));
        },
        enumerable: true,
        configurable: true,
        writable: true
      });
    });
    return (0, _possibleConstructorReturn2["default"])(_this, descs);
  }

  (0, _createClass2["default"])(Descriptors, [{
    key: "spread",
    value: function spread() {
      var ents = Object.values(this);
      var spreadProto = {
        unspread: function unspread() {
          var unsp = this.reduce(function (prev, desc) {
            prev[desc.key] = desc;
            return prev;
          }, new Descriptors());
          return unsp;
        }
      };
      Reflect.ownKeys(Array.prototype).forEach(function (key) {
        spreadProto[key] = function () {
          var _Array$prototype$key;

          for (var _len4 = arguments.length, arg = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            arg[_key4] = arguments[_key4];
          }

          var result = (_Array$prototype$key = Array.prototype[key]).call.apply(_Array$prototype$key, [this].concat(arg));

          if (Array.isArray(result)) return Object.setPrototypeOf(result, spreadProto);
          return result;
        };
      });
      Reflect.ownKeys(Descriptors.prototype).forEach(function (key) {
        spreadProto[key] = function () {
          var _this$unspread;

          return (_this$unspread = this.unspread())[key].apply(_this$unspread, arguments);
        };
      });
      return mixin(ents, spreadProto);
    }
  }, {
    key: "merge",
    value: function merge(trg) {
      for (var _len5 = arguments.length, arg = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
        arg[_key5 - 1] = arguments[_key5];
      }

      return defineProps.apply(void 0, [trg, this].concat(arg));
    }
  }, {
    key: "toObject",
    value: function toObject() {
      var newObj;
      var objConstructor = this.constructor.value || this.constructor.get ? this.constructor.get() : Object;
      getLevel(objConstructor.prototypek, function (lvl) {
        var newObj;

        try {
          return !!(newObj = new lvl.constructor());
        } catch (_unused5) {
          return false;
        }
      });
      Object.setPrototypeOf(newObj, objConstructor.prototype);
      return defineProps(newObj, this);
    }
  }, {
    key: Symbol.iterator,
    get: function get() {
      var thiss = Object.values(this);
      return function () {
        var iterator = {
          current: 0,
          last: thiss.length - 1,
          // 3. next() is called on each iteration by the for..of loop
          next: function next() {
            // 4. it should return the value as an object {done:.., value :...}
            if (iterator.current <= iterator.last) {
              return {
                done: false,
                value: thiss[iterator.current++]
              };
            } else {
              return {
                done: true
              };
            }
          }
        };
        return iterator;
      };
    }
  }]);
  return Descriptors;
}( /*#__PURE__*/(0, _wrapNativeSuper2["default"])(Object));

var setProto = function setProto(obj, pro) {
  return obj === pro || !pro ? obj : !obj ? undefined : Object.setPrototypeOf(obj, pro);
};

var getProto = function getProto(ob) {
  return !ob ? undefined : Object.getPrototypeOf(ob);
};

var ownDescriptor = exports.ownDescriptor = function (obj, prop) {
  return new Descriptor(obj, prop) || undefined;
};

var getDescriptor = exports.getDescriptor = function (obj, prop) {
  var level = getLevel(obj, function (lvl) {
    return lvl && ownProp(lvl, prop);
  });
  return level ? new Descriptor(level, prop) : undefined;
};

var getDescriptors = exports.getDescriptors = function (ob, defaults) {
  for (var _len6 = arguments.length, bind = new Array(_len6 > 2 ? _len6 - 2 : 0), _key6 = 2; _key6 < _len6; _key6++) {
    bind[_key6 - 2] = arguments[_key6];
  }

  // spreading the bind argument allows for passing multiple arguments to bind method
  var descs = new Descriptors({});
  Reflect.ownKeys(ob).forEach(function (key) {
    var desc = new Descriptor(ob, key);
    desc = boundDescriptor.apply(void 0, [desc].concat(bind));

    if (defaults) {
      if (typeof defaults === "function") desc = defaults(desc) || desc;else Object.assign(desc, defaults);
    }

    descs[key] = desc;
  });
  return descs;
};

function boundProperty(key, original) {
  for (var _len7 = arguments.length, bind = new Array(_len7 > 2 ? _len7 - 2 : 0), _key7 = 2; _key7 < _len7; _key7++) {
    bind[_key7 - 2] = arguments[_key7];
  }

  var newProp = cloneFunc(original, original.bind.apply(original, bind));
  Array('call', 'apply').forEach(function (prop) {
    Object.defineProperty(newProp, prop, {
      value: Function.prototype[prop].bind(original),
      configurable: true,
      enumerable: false,
      writable: true
    });
  });
  Object.defineProperty(newProp, 'bind', {
    value: function value() {
      return boundProperty.apply(void 0, [key, original].concat((0, _toConsumableArray2["default"])(arg)));
    },
    configurable: true,
    enumerable: false,
    writable: true
  });
  return Object.setPrototypeOf(newProp, original);
}

var boundDescriptor = exports.boundDescriptor = function (descriptor) {
  for (var _len8 = arguments.length, bind = new Array(_len8 > 1 ? _len8 - 1 : 0), _key8 = 1; _key8 < _len8; _key8++) {
    bind[_key8 - 1] = arguments[_key8];
  }

  return ReflectBind.descriptor({
    descriptor: descriptor,
    bind: bind
  });
};

var boundDescriptors = exports.boundDescriptors = function (ob) {
  for (var _len9 = arguments.length, bind = new Array(_len9 > 1 ? _len9 - 1 : 0), _key9 = 1; _key9 < _len9; _key9++) {
    bind[_key9 - 1] = arguments[_key9];
  }

  var descs = new Descriptors({});
  Reflect.ownKeys(ob).forEach(function (key) {
    descs[key] = new Descriptor(ReflectBind.descriptor(ob, key, bind));
  });
  return descs;
};

var backup = exports.backup = function (ob) {
  if (!ob) return;
  var bup = setProto(getDescriptors(ob), getProto(ob));
  bup['{{restore target}}'] = setProto(new (_typeof["class"](ob))(), getProto(ob));
  return bup;
};

var restore = exports.restore = function (ob, backup) {
  if (!backup) {
    var _ref = [ob, backup];
    backup = _ref[0];
    ob = _ref[1];
    ob = backup['{{restore target}}'] || new (Object.defineProperty({}, 'constructor', backup.constructor).constructor)();
  }

  Reflect.ownKeys(ob).forEach(function (key) {
    var gd = Object.getOwnPropertyDescriptor(ob);

    if (gd.writable === false && gd.configurable === false) {
      delete backup[key];
      return;
    }

    if (gd.writable === false) Object.defineProperty(ob, key, {
      value: '',
      writable: true
    });
    delete ob[key];
  });
  delete backup['{{restore target}}'];
  Object.defineProperties(ob, backup);
  if (!arguments[1]) return ob;
  return setProto(ob, getProto(backup));
};

var bindProxies = new Map();

var bindProxy = exports.bindProxy = function (thiss, properties, bind, softTarget) {
  var bps = bindProxies;
  thiss = thiss['{{target}}'] || this;
  var theArgs = Array.prototype.slice.call(arguments);
  theArgs[0] = thiss;
  if (bps.has(thiss) && bps.get(thiss).args.every(function (ar, ind) {
    return ar === theArgs[ind];
  })) return bps.get(thiss).bindProx;
  var bindProx;
  bindProx = new _Proxy({
    target: bind,

    get virtualTarget() {
      return softTarget || bind;
    },

    get proxy() {
      return bindProx;
    },

    handler: {
      get: function get(ob, prop, prx) {
        // boundDescriptors(bind,bind).merge(ob)
        var trg = prop in ob ? ob : softTarget && prop in softTarget ? softTarget : properties;
        var binder = !ownProp(trg, prop) ? trg : undefined;
        var res = Reflect.get(trg, prop, binder || prx);
        return typeof res === 'function' && prop !== 'constructor' && binder ? res.bind(binder) : res;
      },
      set: function set(ob, prop, val, prx) {
        if (softTarget) return !!(softTarget[prop] = typeof val === 'function' && prop !== 'constructor' ? val.bind(prx) : val);
        return !!(ob[prop] = val);
      },
      defineProperty: function defineProperty(ob, prop, desc) {
        if (softTarget) return defineProp(softTarget, prop, boundDescriptor(_objectSpread(_objectSpread({}, desc), {}, {
          configurable: true
        }), this.proxy));
        return defineProp(ob, prop, desc);
      }
    }
  });
  bps.set(thiss, {
    bindProx: bindProx,
    args: theArgs
  });
  return bindProx;
};

var replaceThis = exports.replaceThis = function (obj, callback) {
  var keys = [];
  var computedFieldNames = {};

  if (arguments.length === 1) {
    callback = obj;
    obj = null;
  }

  var parsedObj = esprima.parse(callback.toString());
  if (!parsedObj) return obj;
  parseThis(parsedObj);

  if (obj) {
    keys = (0, _toConsumableArray2["default"])(new Set(keys));
    Reflect.ownKeys(obj).forEach(function (key) {
      if (keys.includes(key)) obj[key] = obj;
    });
  }

  function parseThis(parsed) {
    if (parsed.type === "ObjectExpression") {
      var properties = parsed.properties;

      if (properties && properties.length) {
        properties.forEach(function (prop) {
          if (prop.value.type === 'ThisExpression') keys.push(prop.key.name);
        });
      }

      return parsed;
    } else if (parsed.type === 'SequenceExpression') {
      parsed.expressions.slice(1).forEach(function (exp) {
        var arg = exp.arguments;
        if (!exp.arguments) return;
        if (arg[1].type !== 'Identifier') return;
        var varname = arg[1].name;
        var val = arg[2].value;
        computedFieldNames[varname] = val;
      });
      return;
    }

    Object.keys(parsed).forEach(function (key) {
      if (key === 'body') {
        if (Array.isArray(parsed.body)) parsed.body.forEach(function (element) {
          Object.setPrototypeOf(element, {
            prev: parsed.body
          });
          parseThis(element);
        });else {
          Object.setPrototypeOf(parsed.body, {
            prev: parsed
          });
          parseThis(parsed.body);
        }
      } else if (parsed[key] && parsed[key].type) {
        Object.setPrototypeOf(parsed[key], {
          prev: parsed
        });
        parseThis(parsed[key]);
      }
    });
  }

  return obj || {
    keys: keys,
    computedFieldNames: computedFieldNames
  };
};

var mergeProps = exports.mergeProps = function (obj, props) {
  var exc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var overrides = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if (arguments.length === 3) {
    overrides = (0, _typeof3["default"])(exc) === 'object' && !Array.isArray(exc) ? arguments[2] : {};
    exc = Array.isArray(exc) ? exc : [];
  }

  return obj !== props && getDescriptors(props).spread().filter(function (desc) {
    return !exc.includes(desc.key);
  }).map(function (desc) {
    return /^{{(.*?)}}$/.exec(desc.key) && (desc.configurable = true) ? Object.assign(desc, overrides) : Object.assign(desc, overrides);
  }).merge(obj);
};

var Constructor = exports.Constructor = function Constructor(subject, callback) {
  (0, _classCallCheck2["default"])(this, Constructor);
  var staticProps,
      inits = new WeakSet();

  if (arguments.length === 1) {
    var _ref2 = Array.prototype.slice.call(arguments);

    callback = _ref2[0];
    subject = _ref2[1];
  }

  if (arguments.length === 2 && typeof arguments[0] === 'function' && (0, _typeof3["default"])(arguments[1]) === 'object') {
    var _ref3 = Array.prototype.slice.call(arguments);

    callback = _ref3[0];
    staticProps = _ref3[1];
    subject = _ref3[2];
  }

  var classArgs = {
    subject: subject,
    callback: callback
  };
  var theName = staticProps && staticProps.name ? staticProps.name : callback.name;
  var theConstructor = (0, _defineProperty2["default"])({}, theName, function () {
    var _subject, _mutatorMap, _callback3, _callback4;

    for (var _len10 = arguments.length, arg = new Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
      arg[_key10] = arguments[_key10];
    }

    var object = this;

    if (this === _global || this === undefined) {
      var ext = privateVars(theConstructor)._super;

      if (!ext) ext = Object.getPrototypeOf(theConstructor.prototype).constructor;
      object = new ext();
    }

    function mergeDescs(desc1, desc2) {
      if (desc2.value) {
        delete desc1.get;
        delete desc1.set;
      }

      if (desc2.get || desc2.set) {
        delete desc1.value;
      }

      var newDesc = Object.assign(desc1, desc2);
      if (newDesc.set || newDesc.get) delete newDesc.writable;
      return newDesc;
    }

    var _replaceThis = replaceThis(callback),
        keys = _replaceThis.keys,
        computedFieldNames = _replaceThis.computedFieldNames;

    var replace = function replace(obj) {
      var replace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : obj;
      return Reflect.ownKeys(obj).forEach(function (key) {
        if (keys.includes(key)) obj[key] = replace;
      });
    };

    var _extends = _global['{{_extends}}'] = '{{_extends}}';

    var _super = _global['{{_super}}'] = '{{_super}}';

    var _static = _global['{{_static}}'] = '{{_static}}';

    var descriptors = _global.descriptors = '{{descriptors}}';
    var constructor = '{{constructor}}';
    var prototype = _global.prototype = '{{prototype}}';
    var properties = _global.properties = '{{properties}}';
    var __proto__ = '{{__proto__}}';
    var name = _global.name = '{{name}}';
    var priv = global.priv = '_priv';
    var iffe = global.iife = '{{iife}}';
    if (!subject) subject = (_subject = {}, _mutatorMap = {}, _mutatorMap[_static] = _mutatorMap[_static] || {}, _mutatorMap[_static].get = function () {
      return this[constructor];
    }, _mutatorMap[_static] = _mutatorMap[_static] || {}, _mutatorMap[_static].set = function (val) {
      mergeProps(this[constructor], val, ['name']);

      if (ownProp(val, 'name')) {
        Object.defineProperty(this, name, {
          get: function get() {
            return this.constructor.name;
          },
          set: function set(val) {
            return true;
          }
        });
        Object.defineProperty(callback, 'name', {
          value: val,
          configurable: true
        });
        Object.defineProperty(this[constructor], 'name', {
          value: val,
          configurable: true
        });
      }

      return !!Object.defineProperty(this, _static, {
        get: function get() {
          return this[constructor];
        },
        set: function set(val) {
          return true;
        }
      });
    }, _mutatorMap[constructor] = _mutatorMap[constructor] || {}, _mutatorMap[constructor].get = function () {
      var constr = this.constructor;

      if (constr === callback) {
        Object.setPrototypeOf(this, mergeProps(theConstructor.prototype, callback.prototype));
        return theConstructor;
      }

      if (constr !== theConstructor) {
        if (constr.prototype.isPrototypeOf(theConstructor.prototype)) return Object.setPrototypeOf(this, theConstructor.prototype).constructor;
        var _name = theConstructor.name;
        var desc = Object.getOwnPropertyDescriptor(this, _static);

        if (desc && desc.value) {
          var nameDesc = Object.getOwnPropertyDescriptor(desc.value, 'name');
          if (nameDesc && nameDesc.value) _name = ((0, _readOnlyError2["default"])("name"), nameDesc.value);
        }

        constr = (0, _defineProperty2["default"])({}, _name, function () {
          for (var _len11 = arguments.length, ar = new Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
            ar[_key11] = arguments[_key11];
          }

          return theConstructor.call.apply(theConstructor, [(0, _construct2["default"])(constr, ar)].concat(ar));
        })[_name];
        Object.setPrototypeOf(constr, this.constructor);
        Object.setPrototypeOf(constr.prototype, this.constructor.prototype);
        Object.setPrototypeOf(this, constr.prototype);
        if (staticProps) mergeProps(constr, staticProps);
      }

      return constr;
    }, _mutatorMap[constructor] = _mutatorMap[constructor] || {}, _mutatorMap[constructor].set = function (val) {
      var cons = Object.getOwnPropertyDescriptor(this, constructor);
      cons = cons.value || cons.get.call(this);
      var thisProto = cons.prototype;
      Object.setPrototypeOf(this, merge(val.prototype, thisProto));
      return !!Object.defineProperty(this, constructor, {
        get: function get() {
          return this.constructor;
        },
        set: function set(val) {
          return true;
        }
      });
    }, _mutatorMap[_extends] = _mutatorMap[_extends] || {}, _mutatorMap[_extends].get = function () {
      return Object.getPrototypeOf(this[constructor]) === 'Function' ? Object : Object.getPrototypeOf(this.constructor);
    }, _mutatorMap[_extends] = _mutatorMap[_extends] || {}, _mutatorMap[_extends].set = function (val) {
      var _callback;

      Object.setPrototypeOf(this[constructor], val);
      Object.setPrototypeOf(this.constructor.prototype, val.prototype);
      object = Object.setPrototypeOf(new val(), Object.getPrototypeOf(this));
      Object.defineProperties(object, getDescriptors(subject).spread().filter(function (desc) {
        return desc.key !== _extends;
      }).unspread());
      object[_extends] = val;

      (_callback = callback).call.apply(_callback, [object].concat(arg));

      return !!Object.defineProperty(this, _extends, {
        get: function get() {
          return val;
        },
        set: function set(val) {
          return true;
        }
      });
    }, _mutatorMap[priv] = _mutatorMap[priv] || {}, _mutatorMap[priv].get = function () {
      var thisPriv;
      if (!privateVars(Constructor).instances.has(this)) privateVars(Constructor).instances.set(this, {});

      if (!privateVars.has(this)) {
        thisPriv = privateVars(this);
        var rando = thisPriv.randomString;
        if (!privateVars(Constructor).instances.has(this)) privateVars(Constructor).instances.set(this, {});
        privateVars(Constructor).instances.get(this).priv = {
          randomString: rando,
          vars: privateVars(this)
        };
        Object.getOwnPropertyDescriptor(this, priv).set.call(this);
      } else thisPriv = privateVars.get(this);

      return thisPriv;
    }, _mutatorMap[priv] = _mutatorMap[priv] || {}, _mutatorMap[priv].set = function (val) {
      var thisPriv = this[priv];
      var ConstThis = privateVars(Constructor).instances.get(this);
      var randoString = ConstThis.priv.randomString;
      var props = this[priv]['{{target}}'][randoString];
      if (props && val) mergeProps(props, val);
      Object.defineProperty(this, '_priv', {
        value: thisPriv,
        enumerable: false,
        writable: false,
        configurable: false
      });
      return true;
    }, _mutatorMap[prototype] = _mutatorMap[prototype] || {}, _mutatorMap[prototype].get = function () {
      return this[constructor].prototype;
    }, _mutatorMap[prototype] = _mutatorMap[prototype] || {}, _mutatorMap[prototype].set = function (val) {
      mergeProps(this[constructor].prototype, val);
      return !!Object.defineProperty(this, prototype, {
        get: function get() {
          return this[constructor].prototype;
        },
        set: function set(val) {
          return true;
        }
      });
    }, _mutatorMap[__proto__] = _mutatorMap[__proto__] || {}, _mutatorMap[__proto__].get = function () {
      return Object.getPrototypeOf(this);
    }, _mutatorMap[__proto__] = _mutatorMap[__proto__] || {}, _mutatorMap[__proto__].set = function (val) {
      Object.setPrototypeOf(this, val);
      return !!delete this[__proto__];
    }, _mutatorMap[_super] = _mutatorMap[_super] || {}, _mutatorMap[_super].set = function (val) {
      return !!Object.defineProperty(this, _super, {
        value: val,
        configurable: true
      });
    }, _mutatorMap[_super] = _mutatorMap[_super] || {}, _mutatorMap[_super].get = function () {
      return function () {
        var _callback2;

        for (var _len12 = arguments.length, args = new Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
          args[_key12] = arguments[_key12];
        }

        object = Object.setPrototypeOf((0, _construct2["default"])(this[_extends], args), Object.getPrototypeOf(this));
        Object.defineProperties(object, getDescriptors(subject).spread().filter(function (desc) {
          return desc.key !== _super && desc.key !== _extends;
        }).unspread());
        object[_extends] = this[_extends];

        object[_super] = function () {
          return object;
        };

        privateVars(theConstructor)._super = object;

        (_callback2 = callback).call.apply(_callback2, [object].concat(arg));

        return object;
      };
    }, _mutatorMap[properties] = _mutatorMap[properties] || {}, _mutatorMap[properties].get = function () {
      return this;
    }, _mutatorMap[properties] = _mutatorMap[properties] || {}, _mutatorMap[properties].set = function (val) {
      return !!mergeProps(this, val);
    }, _mutatorMap[descriptors] = _mutatorMap[descriptors] || {}, _mutatorMap[descriptors].get = function () {
      return getDescriptors(this);
    }, _mutatorMap[descriptors] = _mutatorMap[descriptors] || {}, _mutatorMap[descriptors].set = function (val) {
      var self = this;
      Reflect.ownKeys(val).forEach(function (key) {
        var obDesc = Object.getOwnPropertyDescriptor(self, key);
        var subDesc = Object.getOwnPropertyDescriptor(subject, key);

        if (obDesc && subDesc && equivalent(obDesc, subDesc)) {
          var breakout = true;

          if (obDesc.set) {
            obDesc.set = function (value) {
              subDesc.set.call(self, value);
              var newDesc = Object.getOwnPropertyDescriptor(self, key);

              if (!newDesc || equivalent(newDesc, subDesc)) {
                return true;
              }

              Object.defineProperty(self, key, mergeDescs(newDesc, val[key]));
              return true;
            };

            return true;
          }

          Object.defineProperty(self, key, mergeDescs(subDesc, val[key]));
          return true;
        }

        var desc = obDesc || subDesc;
        if (!desc) return;
        Object.defineProperty(self, key, mergeDescs(desc, val[key]));
      });
    }, (0, _defineEnumerableProperties2["default"])(_subject, _mutatorMap), _subject);
    console.log('object', object);
    console.log('subject', subject);
    mergeProps(object, subject, {
      configurable: true
    });

    var firstPassResult = (_callback3 = callback).call.apply(_callback3, [object].concat(arg));

    var fpType = _typeof["class"](firstPassResult);

    var obType = _typeof["class"](object);

    if (fpType !== Object && fpType !== obType) {
      mergeProps(firstPassResult, object, Reflect.ownKeys(firstPassResult));
      mergeProps(firstPassResult, subject, {
        configurable: true
      });
      replace(firstPassResult);
      object = callback.call(firstPassResult);
    } else {
      replace(firstPassResult);
      Reflect.ownKeys(firstPassResult).forEach(function (key) {
        if (key in object) {
          var desc = Object.getOwnPropertyDescriptor(object, key);

          if (desc.set) {
            object[key] = firstPassResult[key];
            if (ownProp(object, key) && object !== firstPassResult) delete firstPassResult[key];
          }
        }
      });
      Reflect.ownKeys(object).filter(function (key) {
        return !(key in firstPassResult);
      }).forEach(function (key) {
        var desc = Object.getOwnPropertyDescriptor(object, key);
        if (desc.get) try {
          desc.get.call(object);
        } catch (_unused6) {}
      });
      mergeProps(object, firstPassResult, {
        configurable: true
      });
    }

    var secondPassResult = (_callback4 = callback).call.apply(_callback4, [object].concat(arg));

    replace(secondPassResult, object);
    Reflect.ownKeys(secondPassResult).forEach(function (key) {
      if (key in object) {
        var desc = Object.getOwnPropertyDescriptor(object, key);

        if (desc.set) {
          object[key] = secondPassResult[key];
          if (ownProp(object, key) && object !== secondPassResult) delete secondPassResult[key];
        }
      }
    });
    Reflect.ownKeys(object).filter(function (key) {
      return !(key in firstPassResult);
    }).forEach(function (key) {
      var desc = Object.getOwnPropertyDescriptor(object, key);
      if (desc.get) try {
        desc.get.call(object);
      } catch (_unused7) {}
    });
    subject = restore(backup(subject));

    if (!inits.has(object.constructor)) {
      Array(_extends, constructor, prototype, __proto__, _static).forEach(function (item) {
        var desc = getDescriptor(subject, item);
        if (!desc) return;

        if (desc.get || desc.set) {
          desc.set = function (val) {
            return true;
          };
        }
      });
    }

    var decls;
    var props = secondPassResult !== object ? secondPassResult : undefined;
    inits.add(object.constructor);
    mergeProps(object, boundObject(secondPassResult, object));
    var descs = {};
    Reflect.ownKeys(object).forEach(function (key) {
      var desc = Object.getOwnPropertyDescriptor(object, key);

      if (typeof desc.value === 'function') {
        decls = decls || findDeclarations(callback.toString());
        var names = decls.names;
        var dvProto = Object.getPrototypeOf(desc.value);
        if (typeof dvProto === 'function' && Reflect.ownKeys(dvProto).filter(function (ky) {
          return !Array('length', 'bind', 'apply', 'call').includes(ky);
        }).every(function (ky) {
          return dvProto[ky] === desc.value[ky];
        })) if (names.includes(key) || names.includes(dvProto.name) || names.includes(window[key])) {
          mergeProps(desc.value, dvProto, ['bind', 'call', 'apply', 'length']);
          descs[key] = desc;
        }
      }
    });
    if (Reflect.ownKeys(descs).length) defineProps(object, descs);
    Reflect.ownKeys(object).forEach(function (key) {
      return (key.split("__")[0] === "" || /^{{(.*?)}}$/.exec(key)) && delete object[key];
    });
    return object;
  })[theName];
  Object.setPrototypeOf(theConstructor, callback);
  if (staticProps) mergeProps(theConstructor, staticProps);

  try {
    if (_typeof["class"](new callback()) === callback) {
      Object.setPrototypeOf(theConstructor.prototype, callback.prototype);
      return theConstructor;
    }
  } catch (_unused8) {}

  theConstructor.prototype = mergeProps(callback.prototype, theConstructor.prototype);
  return theConstructor;
};

privateVars(Constructor).instances = new WeakMap();

function boundObjectMerge(trg, src) {
  for (var _len13 = arguments.length, bind = new Array(_len13 > 2 ? _len13 - 2 : 0), _key13 = 2; _key13 < _len13; _key13++) {
    bind[_key13 - 2] = arguments[_key13];
  }

  return merge(trg, src, function (key, desc) {
    var type = Array("get", "value").find(function (type) {
      return typeof desc[type] === 'function' && key !== 'constructor';
    });
    if (!type) return desc;
    var original = desc[type];

    var newFunc = function newFunc() {
      var binder = [].concat(bind);
      if (binder.length && !binder[0]) binder[0] = this;else binder[0] = key in _typeof["class"](binder[0]).prototype && !ownProp(binder[0], key) ? binder[0] : key in _typeof["class"](this).prototype && !ownProp(this, key) ? undefined : bindProxy(this, src, binder[0], trg === src ? null : this);
      return original.bind.apply(original, (0, _toConsumableArray2["default"])(binder)).apply(void 0, arguments);
    };

    var newProp = type === 'value' ? cloneFunc(original, newFunc) : Object.setPrototypeOf(mergeProps(newFunc, original, ['length']), original);
    Array('bind', 'apply', 'call').forEach(function (meth) {
      Object.defineProperty(newProp, meth, {
        value: function value() {
          for (var _len14 = arguments.length, arg = new Array(_len14), _key14 = 0; _key14 < _len14; _key14++) {
            arg[_key14] = arguments[_key14];
          }

          if (arg[0]) {
            var args = [].concat(arg);
            var newBind = args[0];
            if (args.length && !newBind) newBind = this;else newBind = key in _typeof["class"](newBind).prototype && !ownProp(newBind, key) ? newBind : key in _typeof["class"](this).prototype && !ownProp(this, key) ? undefined : bindProxy(this, src, newBind, trg === src ? null : this);
            arg[0] = newBind;
          }

          return Function.prototype[meth].bind(original).apply(void 0, arg);
        },
        configurable: true,
        enumerable: false,
        writable: true
      });
    });
    desc[type] = Object.setPrototypeOf(newProp, original);
    return desc;
  });
}

exports.boundObjectMerge = boundObjectMerge;

function boundObject(object, bind, callback) {
  var selfbind = function selfbind(self) {
    var firstCall = callback.call(self);
    self = merge(self, firstCall);
    replaceThis(self, callback);
    var secondCall = callback.call(self);
    self = merge(self, secondCall);
    replaceThis(self, callback);
    return self;
  };

  if (arguments.length === 1) {
    if (typeof arguments[0] === 'function') {
      callback = object;
      object = callback.call({});
      return selfbind(object);
    } else {
      bind = object;
      callback = null;
      return clone(object, true, function (key, desc) {
        return ReflectBind.descriptor(bind, key, bind);
      });
    }
  }

  if (arguments.length === 2) {
    if (typeof arguments[1] === 'function') {
      callback = arguments[1];
      bind = object;
      object = selfbind(callback.call({}));
      return boundObjectMerge(object, object, bind);
    }

    var softTarget = {};
    return boundObjectMerge(softTarget, object, bind);
  }

  var trg = clone(bind, true);
  var props = selfbind(object);
  var subject = boundObjectMerge(trg, props, bind);
  return replaceThis(merge(subject, callback.call(subject)), callback);
}

exports.boundObject;

function boundProperties(object) {
  for (var _len15 = arguments.length, bind = new Array(_len15 > 1 ? _len15 - 1 : 0), _key15 = 1; _key15 < _len15; _key15++) {
    bind[_key15 - 1] = arguments[_key15];
  }

  return boundObject({}, object, function () {
    var descs = getDescriptors(object, function (desc) {
      Array('set', 'get', 'value').forEach(function (type) {
        if (typeof desc[type] === 'function') {
          var property = desc[type];

          desc[type] = function () {
            for (var _len16 = arguments.length, arg = new Array(_len16), _key16 = 0; _key16 < _len16; _key16++) {
              arg[_key16] = arguments[_key16];
            }

            arg = Object.assign(arg, bind.slice(1));

            try {
              return property.call.apply(property, [bind[0]].concat((0, _toConsumableArray2["default"])(arg)));
            } catch (err) {
              console.log(bind[0]);
              if (desc.key in bind[0]) return bind[desc.key].apply(bind, (0, _toConsumableArray2["default"])(arg));
            }
          };

          return desc;
        }
      });
    });
    return Object.defineProperties(this, descs);
  });
}

module.exports = require('../utilsCompiled').getClone(module.exports);