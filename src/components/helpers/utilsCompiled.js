"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lowerFirst = lowerFirst;
exports.capitalize = capitalize;
exports.toHash = toHash;
exports.randomString = randomString;
exports.isURL = isURL;
exports.isJSON = isJSON;
exports.isPromise = isPromise;
exports.contract = contract;
exports.asyncForEach = asyncForEach;
exports.sequence = sequence;
exports.dynamicImport = dynamicImport;
exports.capture = capture;
exports.isClass = isClass;
exports.tie = tie;
exports.cloneFunc = cloneFunc;
exports.ReflectBind = ReflectBind;
exports.ReflecTie = ReflecTie;
exports.tieProx = tieProx;
exports.ReflecTieProx = ReflecTieProx;
exports.defineTie = defineTie;
exports.cleanup = cleanup;
exports.waitFor = waitFor;
exports.merge = merge;
exports.clone = clone;
exports.getLevel = getLevel;
exports.getDefinition = getDefinition;
exports.descriptorValue = descriptorValue;
exports.getNextLevel = getNextLevel;
exports.cloneProxy = cloneProxy;
exports.getStackTrace = getStackTrace;
exports.commandLine = commandLine;
exports.safe = safe;
exports.getProp = exports.objInherit = exports.classInherit = exports.reverseExtend = exports.Prox = exports.Obj = exports.WeakerMap = exports.appendScript = exports.mixin = void 0;

var _react = _interopRequireDefault(require("react"));

var _child_process = require("child_process");

var _http = require("http");

var _util = require("util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

let proto = {
  get: Object.getPrototypeOf,
  set: Object.setPrototypeOf
};

function lowerFirst(word) {
  return word.charAt(0).toLowerCase() + word.slice(1);
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function toHash(obj) {
  if (!obj) return 0;
  console.log('the objj', obj);
  let toString = JSON.stringify(obj);
  var hash = 0;
  let char;
  let i;
  if (toString.length === 0) return hash;

  for (i = 0; i < toString.length; i++) {
    char = toString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return hash;
}

function randomString(length = 32) {
  return Math.round(Math.pow(36, length + 1) - Math.random() * Math.pow(36, length)).toString(36).slice(1);
}

function isURL(url) {
  if (typeof url !== 'string') return false;
  var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  return pattern.test(url) ? true : false;
}

function isJSON(data) {
  if (typeof data !== 'string') return false;
  data = data.trim();
  let match = data.match(/\{[^{}]+\}/) || [];
  return match[0] === data;
}

function isPromise(res) {
  return typeof res === 'object' && res.constructor === Promise;
}

function contract(input, then) {
  if (isPromise(input)) return then ? input.then(done => then(done)) : input;
  return then ? then(input) : input;
}

function asyncForEach(arr, cb, ths) {
  let iteration = -1;

  function iterate(prev) {
    if (iteration === arr.length - 1) return prev;
    iteration++;
    return contract(cb.call(ths, arr[iteration], iteration, prev, arr), res => {
      prev = res;
      return iterate(prev);
    });
  }

  return iterate();
}

function sequence(...funcs) {
  if (funcs.length === 1 && Array.isArray(funcs[0])) funcs = funcs[0];
  if (funcs.constructor && !Array.isArray(funcs)) funcs = Object.values(funcs);
  return asyncForEach(funcs, (func, ind, res) => {
    return func(res);
  });
}

function dynamicImport(name) {
  let imports = dynamicImport.imports || {};
  return async function (cb) {
    if (!imports[name]) {
      try {
        imports[name] = await Promise.resolve().then(() => _interopRequireWildcard(require('socket.io-client')));
      } catch {
        throw new Error('could not import ' + name);
      }
    }

    let res = imports[name];
    return cb ? await cb(res) : res;
  };
}

const mixin = (obj, mix) => {
  let mixProx = new Proxy(proto.get(obj), {
    get(ob, prop) {
      if (obj.hasOwnProperty(prop)) return ob[prop];
      if (ob.hasOwnProperty(prop)) return obj[prop];
      return tie(Reflect.get(mix, prop, obj), obj);
    }

  });
  return mixProx;
};

exports.mixin = mixin;

const appendScript = (scriptToAppend, external = true) => {
  const script = document.createElement("script");

  if (external = true) {
    script.src = scriptToAppend;
    script.async = true;
  } else {
    inlineScript = document.createTextNode(scriptToAppend);
    script.appendChild(inlineScript);
  }

  document.body.appendChild(script);
};

exports.appendScript = appendScript;
const captured = {
  get: {},
  set: {}
};

function capture(name = 'object') {
  let cap = typeof name === 'string' ? [] : name;
  if (!cap.applies) cap.applies = [];
  return new Proxy(cap, {
    get: function (ob, prop) {
      if (typeof name === 'string') {
        captured.get[name] = captured.get[name] || [];
        captured.get[name].push(cap);
      }

      cap.push(prop);
      return capture(cap);
    },
    set: function (ob, prop, val) {
      if (typeof name === 'string') {
        captured.set[name] = captured.get[name] || [];
        captured.set[name].push(cap);
      }

      cap.set(prop);
      cap.applies.push(target => {
        let dest = target;
        cap.forEach((part, ind) => {
          if (ind === cap.length) dest[part] = val;else dest = dest[part];
        });
      });
      return true;
    },
    apply: function (target, that, args) {
      cap.applies.push();
    }
  });
}

class WeakerMap extends WeakMap {
  constructor(...arg) {
    super(...arg);
    let thiss = this;

    function WeakerMap(...arg) {
      return thiss.getSet(...arg);
    }

    let prox = new Proxy(thiss, {
      get: function (ob, prop) {
        let res = Reflect.get(thiss, prop);
        if (typeof res === 'function') return res.bind(thiss);
        return res;
      }
    });
    return proto.set(WeakerMap, prox);
  }

  getSet(key, val) {
    val = val || proto.set({}, {
      getSet(key, value) {
        if (!this.hasOwnProperty(key)) this[key] = value;
        return this[key];
      }

    });
    if (!this.has(key)) this.set(key, val);
    return this.get(key);
  }

}

exports.WeakerMap = WeakerMap;

const Obj = function () {
  const mixins = new WeakMap();

  let newObj = function Obj(obj) {
    if (mixins.has(obj)) return mixins(obj);
    let mix = mixin(obj, {
      has(prop) {
        return this.hasOwnProperty(prop);
      },

      get type() {
        return Array.isArray(obj) ? 'array' : typeof this;
      },

      get size() {
        return Reflect.ownKeys(this).length;
      },

      define(key, val, type = 'value') {
        let isDef = false;

        if (arguments.length === 2 && typeof val === 'object' && !Array.isArray(val) && Object.keys(val).length < 5) {
          let type = val.hasOwnProperty('get') ? 'get' : val.hasOwnProperty('set') ? 'set' : val.hasOwnProperty('value') ? 'value' : undefined;

          if (type) {
            if (val.length === 1) isDef = true;else isDef = Array('configurable', 'writable', 'enumerable').some(conf => Object.keys(conf).includes(conf));
          }
        }

        return Object.defineProperty(this, key, isDef ? val : {
          [type]: val,
          configurable: true
        });
      },

      get proto() {
        return Object.getPrototypeOf(this);
      },

      set proto(val) {
        return Object.setPrototypeOf(this, val);
      }

    });
    mixins.set(obj, mix);
    return mix;
  };

  return newObj;
}();

exports.Obj = Obj;
var proxInstances = new WeakMap();
const Prox = new Proxy(Proxy, {
  construct(target, args) {
    var newProxy = new Proxy(...args);
    proxInstances.set(newProxy, target);
    let handler = args[1];
    let handlerCopy = clone(handler);
    let trg = args[0];

    handler.get = function (ob, prop, ...arg) {
      if (prop === 'variant') return ob.variant || target;
      if (prop === '{{variant}}') return ob.variant;
      if (prop === 'source') return ob.source || getStackTrace();
      if (prop === '{{source}}') return getStackTrace();
      if (prop === 'target') return ob.target || trg;
      if (prop === 'handler') return ob.handler || handlerCopy;
      if (prop === '{{target}}') return trg;
      if (prop === '{{handler}}') return handlerCopy;
      return handlerCopy.get(ob, prop, ...arg);
    };

    proxInstances.set(newProxy, target);
    return newProxy;
  },

  get(obj, prop) {
    if (prop == Symbol.hasInstance) {
      return instance => {
        return proxInstances.has(instance);
      };
    }

    return Reflect.get(...arguments);
  }

});
exports.Prox = Prox;

const reverseExtend = (comp, pro) => {
  let kompProto;
  if (proto.get(comp).hasOwnProperty('konstructor') && proto.get(comp).konstructor === 'Komponent') return;
  let oneBefore = getLevel(comp, lvl => proto.get(lvl) && proto.get(lvl).hasOwnProperty('konstructor') && proto.get(lvl).konstructor === 'Komponent');
  kompProto = oneBefore ? proto.get(oneBefore) : pro || clone(getLevel(comp, lvl => lvl.name === 'Komponent').prototype, true, ['constructor']);
  if (oneBefore) proto.set(oneBefore, proto.get(kompProto));
  proto.set(comp, proto.set(kompProto, proto.get(comp)));
};

exports.reverseExtend = reverseExtend;

const classInherit = (komp, Komponent) => {
  let comp = proto.set({}, komp);

  while (comp = proto.get(comp)) {
    if (proto.get(comp) === Komponent) break;

    if (proto.get(comp) === _react.default.Component) {
      proto.set(comp, Komponent);
      break;
    }
  }
};

exports.classInherit = classInherit;

const objInherit = (komp, Komponent) => {
  let comp = proto.set({}, komp);

  while (comp = proto.get(comp)) {
    console.log(comp.constructor.name);
    if (proto.get(comp) && proto.get(comp).constructor === Komponent) break;

    if (proto.get(comp) && proto.get(comp).constructor === _react.default.Component) {
      proto.set(comp, Komponent.prototype);
      break;
    }
  }
};

exports.objInherit = objInherit;

function bind(...arg) {
  let target = arg[0];
  if (typeof target !== 'function' || isClass(target)) return target;
  return Function.prototype.bind.call(...arg);
}

function isClass(func) {
  return func.toString().split(" ")[0] === "class";
}

function tie(func, newBind) {
  if (typeof func !== 'function' || func.name.split('bound ')[1]) return func;
  if (func instanceof tie) func = func.originalFunc;

  if (isClass(func)) {
    console.error(`Problem with: "${func.name}." Tie function can't work with classes. Invalid data type. Ignoring.`);
    return func;
  }

  var funcName = func.name;
  let newFunc = {
    [funcName]: function (...arg) {
      return newFunc.tie.bind ? newFunc.originalFunc.call(newFunc.tie.bind, ...arg) : newFunc.originalFunc.call(...arg);
    }
  }[funcName];
  Object.setPrototypeOf(newFunc, func);
  Object.defineProperty(newFunc, 'name', {
    value: funcName
  });
  newFunc.originalFunc = func;

  newFunc.tie = newFunc.tie || function (binder) {
    this.tie.bind = binder;
  };

  if (newBind) newFunc.tie.bind = newBind;
  proto.set(newFunc, tie.prototype); // return newFunc

  return newFunc;
}

proto.set(tie.prototype, Function.prototype);
Array('bind', 'call', 'apply').forEach(key => tie.prototype[key] = function (...arg) {
  return this.originalFunc[key](...arg);
});

function cloneFunc(func, cb, binder) {
  var clonedFunctionName = func.name;
  const cloned = {
    [clonedFunctionName]: function (...props) {
      binder = binder || new func(...props);
      return cb.call(binder, ...props);
    }
  }[clonedFunctionName];
  cloned.prototype = func.prototype;
  const clonedProto = proto.set({}, func);
  Array('call', 'bind', 'apply').forEach(method => {
    let original = tie(Function.prototype[method], cloned);

    clonedProto[method] = function (...arg) {
      let bin = binder || this;
      binder = arg[0];

      if (method === 'bind') {
        let newClone = cloneFunc(func, cb, arg[0]);
        let newOriginal = tie(Function.prototype.bind, newClone);
        binder = bin;
        return newOriginal(...arg);
      }

      try {
        return original(...arg);
      } finally {
        binder = bin;
      }
    };
  });
  Object.defineProperty(cloned, 'name', {
    value: func.name
  });
  proto.set(cloned, clonedProto);
  return cloned;
}

function ReflectBind(ob, prop, binder) {
  binder = binder || ob;
  return bind(Reflect.get(ob, prop, binder), binder);
}

function ReflecTie(ob, prop, binder) {
  let returnVal = tie(Reflect.get(ob, prop, binder), binder);
  if (typeof returnVal !== 'function') return function () {
    return returnVal;
  };
  return returnVal;
}

function tieProx(func, binder) {
  return new Proxy(func, {
    apply(a, b, args) {
      return func.call(binder, ...args);
    },

    get(ob, prop) {
      if (prop === 'bind') return function bind(bnd) {
        return new tieProx(func, bnd);
      };
      return ob[prop];
    }

  });
}

function ReflecTieProx(ob, prop, binder) {
  let returnVal = Reflect.get(ob, prop, binder);
  if (typeof returnVal !== 'function') return returnVal;
  return tieProx(returnVal, binder);
}

function defineTie(trg, prop, src, key, binder) {
  src = getLevel(src, lvl => lvl.hasOwnProperty(key));
  const def = Object.getOwnPropertyDescriptor(src, key);
  const type = def.hasOwnProperty('get') ? 'get' : 'value';
  def[type] = tie(def[type], binder);
  return Object.defineProperty(trg, prop, def);
}

function cleanup(comp) {
  merge(comp, comp.tree, comp);
}

function waitFor(conditionFunction, time = 100) {
  const poll = resolve => {
    if (typeof conditionFunction === 'number') {
      setTimeout(_ => resolve(), conditionFunction);
    } else {
      if (conditionFunction()) resolve();else setTimeout(_ => poll(resolve), time);
    }
  };

  return new Promise(poll);
}

function merge(target, src, exclude, binder) {
  exclude = exclude || [];
  Reflect.ownKeys(src).filter(key => !exclude.includes(key)).forEach(key => {
    let desc = Object.getOwnPropertyDescriptor(src, key);
    let type = desc.get ? 'get' : 'value';

    if (binder) {
      desc[type] = key === 'constructor' ? desc[type] : bind(desc[type], binder);
      if (desc.set) desc.set = desc.set.bind(binder);
    }

    try {
      Object.defineProperty(target, key, desc);
    } catch {}
  });
  return target;
}

function clone(obj, withProto = false, exclude = [], binder) {
  let cloned = merge({}, obj, exclude, binder);
  if (withProto) proto.set(cloned, proto.get(obj));
  return cloned;
}

function getLevel(obj, cb) {
  let level = obj;
  let success = false;
  if (typeof level === 'undefined') return;

  const loop = () => {
    level = proto.set({}, level);

    while (level = proto.get(level)) {
      if (typeof level === 'undefined') return;

      if (cb(level)) {
        success = true;
        return level;
      }
    }
  };

  loop();
  return success ? level : undefined;
}

function getDefinition(obj, prop) {
  let level = getLevel(obj, lvl => lvl && lvl.hasOwnProperty(prop));
  return level ? Object.getOwnPropertyDescriptor(level, prop) : undefined;
}

function descriptorValue(obj, prop) {
  if (!obj) return;
  let desc;
  if (arguments.length === 1 && ('get' in obj || 'value' in obj)) desc = obj;
  desc = desc || Object.getOwnPropertyDescriptor(obj, prop);
  if (!desc) return;
  return desc.hasOwnProperty('get') ? desc.get : desc.value;
}

const getProp = (obj, prop) => {
  let desc = getDefinition(obj, prop);
  if (!desc) return;
  return desc.hasOwnProperty('get') ? desc.get : desc.value;
};

exports.getProp = getProp;

function getNextLevel(lvl, prop) {
  if (!lvl || !prop) return;
  let current = descriptorValue(getDefinition(lvl, prop));
  if (!current) return;
  return getLevel(lvl, lvl2 => {
    let next = descriptorValue(lvl2, prop);
    return next && next !== current;
  });
}

function cloneProxy(obj, replace = {}, binder) {
  const bindIt = (o, pr, bndr = binder) => {
    if (bndr === 'cloneProxy') bndr = cloneProx;
    if (!bndr || pr === 'constructor') return Reflect.get(o, pr);
    return tie(Reflect.get(o, pr, bndr), bndr);
    /* let retVal = Reflect.get(o,pr,bndr)
    return (typeof retVal === 'function' && pr !== 'constructor') ? retVal.bind(bndr) : retVal */
  };

  let cloneProx = new Prox(obj, {
    get: function (ob, prop) {
      let customGet;
      let replaced;
      if (prop === '{{handler}}') return replace;
      if (prop === 'handler' && !('handler' in ob)) return replace;

      if (replace.hasOwnProperty('get')) {
        if (typeof replace.get === 'object') {
          if (replace.get.hasOwnProperty(prop)) {
            replaced = bindIt(replace.get, prop)(ob, prop);
          }

          let def = replace.hasOwnProperty('{{default}}') ? '{{default}}' : 'default';

          if (replace.get.hasOwnProperty(def)) {
            let getDefault = bindIt(replace.get, def)(ob, prop);
            if (!replaced && typeof replaced !== 'boolean') replaced = getDefault;
          }
        } else {
          let replaceGet = bindIt(replace, 'get');
          customGet = replaceGet(ob, prop);
        }
      }

      if (replace.hasOwnProperty(prop) && replace[prop].hasOwnProperty('get')) replaced = bindIt(replace[prop], 'get')(ob, prop);
      if (replace.hasOwnProperty(prop)) replaced = bindIt(replace, prop)(ob, prop);
      if (typeof customGet !== 'undefined' && typeof replaced === 'undefined') return customGet;else if (typeof replaced !== 'undefined') return replaced;
      return bindIt(ob, prop);
    },
    set: function (ob, prop, val) {
      if (replace.set && replace.set.skip && replace.set.skip.hasOwnProperty(prop)) return;
      let replaced;
      let replaceSet;
      if (replace.hasOwnProperty(prop) && replace[prop].hasOwnProperty('set')) replaced = replace[prop].set(ob, prop, val);
      if (typeof replaced === 'boolean') return replaced;

      if (replace.hasOwnProperty('set')) {
        if (typeof replace.set === 'object') {
          if (replace.set.hasOwnProperty(prop)) replaced = replace.set[prop](ob, prop, val);
          let def = replace.hasOwnProperty('{{default}}') ? '{{default}}' : 'default';
          if (replace.set.hasOwnProperty(def) && typeof replaced !== 'boolean') replaced = replace.set[def](ob, prop, val);
        } else if (typeof replace.set === 'function') replaceSet = replace.set(ob, prop, val) || true;

        return typeof replaced === 'boolean' ? replaced : replaceSet;
      }

      ob = binder || ob;
      ob[prop] = val;
      return true;
    },
    setPrototypeOf: function (trg, src) {
      trg = binder || obj;
      proto.set(trg, src);
      return true;
    }
  });
  return cloneProx;
}

function getStackTrace() {
  let stackTrace;
  let stack;
  stack = new Error().stack;
  stackTrace = stack.split("\n");
  stackTrace.forEach((st, ind) => {
    let returnVal = st.split('@')[0];
    if (returnVal.includes(' (')) returnVal = returnVal.split(' (')[0];
    if (returnVal.includes('    at ')) returnVal = returnVal.split('    at ')[1];
    stackTrace[ind] = returnVal;
  });
  stackTrace.shift();
  stackTrace.pop();
  if (stackTrace[0].includes('getStackTrace')) stackTrace.shift();
  return stackTrace.filter(ti => ti !== "");
}

function commandLine(command) {
  return (0, _child_process.execSync)(command, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }

    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }

    console.log(`stdout: ${stdout}`);
  });
}

function safe(ob, type = 'get') {
  let props = [];
  let safeProx = Prox(ob, {
    get: function (ob, prop) {
      if (prop !== 'done' && prop !== 'setVal') props.push(prop);
      ob = ob['{{target}}'] || ob;

      if (prop === 'done' || prop === 'setVal') {
        return function (val) {
          if (val) {
            prop = props[props.length - 1];
            ob[prop] = args[0];
          }

          return prop === 'done' ? ob : safe(ob[prop]);
        };
      }

      if (type === 'get') {
        if (!(prop in ob)) return safe({});
        return safe(ob[prop]);
      }

      if (!ob[prop]) ob[prop] = {};
      return safe(ob[prop], 'set');
    },
    set: function (ob, prop, val) {
      ob[prop] = typeof ob[prop] === 'undefined' ? ob[prop] : val;
      return true;
    }
  }); // if (typeof ob !== 'object' && typeof ob !== 'function')
  // return ob

  return safeProx;
}

if (typeof exports !== 'undefined') {
  Object.keys(exports).forEach(key => {
    let val = module.exports[key];
    Object.defineProperty(module.exports, key, {
      get: function () {
        return val;
      }
    });
  });
}