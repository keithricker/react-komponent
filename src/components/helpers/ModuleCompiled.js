"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineEnumerableProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/defineEnumerableProperties"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var thisMod = module;

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

var fs = require("fs");

var ownProp = function ownProp(ob, prop) {
  return Reflect.ownKeys(ob).includes(prop);
};

var requireThis = function requireThis() {
  return globalType() === 'node' ? require : _global.reactKomponent.require;
};
/*
let params = '?path='+str
let url = window.location.protocol+"//"+window.location.host+'/require'+params 

let requiredModule = require('require-from-url/sync')(''+url)
return requiredModule;
*/


var resolve = function resolve(reqString, base) {
  if (!base) base = this && this !== _global && this.id ? this.id : thisMod.id;
  var reslv = requireThis().resolve(require("path").resolve(require("path").dirname(base), reqString));
  console.log('reslv!', reslv);
  return reslv;
};

var req = requireThis()("react-komponent/utils").require;

req.base = require('path').resolve(process.cwd(), thisMod.id);

var getClone = function getClone() {
  var _req;

  return (_req = req("./utilsCompiled")).getClone.apply(_req, arguments);
};

var isURL = function isURL() {
  var _req2;

  return (_req2 = req("./utilsCompiled")).isURL.apply(_req2, arguments);
};

var merge = function merge() {
  var _req3;

  return (_req3 = req("./utilsCompiled")).merge.apply(_req3, arguments);
};

var serverHooks = function serverHooks(name) {
  return req("../../../server/ssrHooks.js").ssrHooks[name];
};

var postRequest = function postRequest() {
  var _req4;

  return (_req4 = req("./utilsCompiled")).postRequest.apply(_req4, arguments);
};

var imports = new WeakMap([[dynamicImport, {
  imports: {}
}]]);

var requireFromUrl = require('./utilsCompiled').requireFromUrl;

function functionalImport(required) {
  var _mod = this;

  return new Proxy({}, {
    get: function get(ob, prop) {
      var returnVal = function returnVal() {
        console.log('requireModz!', [required, _mod.id]);
        var requireMod = req(required, _mod.id);
        if (prop !== "default" && requireMod && requireMod.__esModule && requireMod["default"] && Object.keys(requireMod.length === 1)) requireMod = requireMod["default"];
        var requiredMod = Reflect.get(requireMod, prop, requireMod);
        if (typeof requiredMod === "function") return requiredMod.apply(void 0, arguments);
        return requiredMod;
      };

      return new Proxy(returnVal, {
        get: function get(obj, prp) {
          var requireMod = req(required, _mod.id);
          if (prop !== "default" && requireMod && requireMod.__esModule && requireMod["default"] && Object.keys(requireMod.length === 1)) requireMod = requireMod["default"];
          var requiredMod = Reflect.get(requireMod, prop, requireMod);
          return Reflect.get(requiredMod, prp, requiredMod);
        }
      });
    }
  });
}

function _Module(_module) {
  var _type,
      _name,
      _mode,
      _exports,
      _exports2,
      _newModule,
      _mutatorMap,
      _this = this;

  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "single";
  var theArgs = Array.prototype.slice.call(arguments);
  if (!_module.exports) _module.exports = {};
  var thiss = this;
  var resolveThis = resolve.bind(this);
  var exportSets;
  var exportsProxy = arguments[1] === "single" ? undefined : new Proxy(_module.exports, {
    set: function set(ob, key, val, prx) {
      var returnVal;
      if (key !== "__esModule") returnVal = !!Object.defineProperty(ob, key, {
        value: val
      });
      returnVal = !!Reflect.set.apply(Reflect, (0, _toConsumableArray2["default"])(theArgs));
      if (returnVal) exportSets[key] = val;
    }
  });

  var getName = function getName(thePath) {
    var parsed = require("path").parse(thePath);

    return parsed.name === "index" ? require("path").parse(parsed.dir).name : parsed.name;
  };

  var newModule = (_newModule = {}, (0, _defineProperty2["default"])(_newModule, priv, {
    module: _module,
    exports: _module.exports
  }), (0, _defineProperty2["default"])(_newModule, "imports", new Map()), (0, _defineProperty2["default"])(_newModule, "requirements", new Map()), _type = "type", _mutatorMap = {}, _mutatorMap[_type] = _mutatorMap[_type] || {}, _mutatorMap[_type].get = function () {
    if (typeof theArgs[1] === "string") return theArgs[1];

    if (this.mode === "es") {
      if (ownProp(this[priv].exports, "default")) {
        if (Object.keys(this[priv].exports).length === 1) return "single";
      }

      return "multiple";
    }

    if (!exportSets || !Reflect.ownKeys(exportSets).length && !Reflect.ownKeys(this[priv].exports.length)) return "single";
  }, _name = "name", _mutatorMap[_name] = _mutatorMap[_name] || {}, _mutatorMap[_name].get = function () {
    return getName(this[priv].module.id);
  }, (0, _defineProperty2["default"])(_newModule, "imports", new Map()), _mode = "mode", _mutatorMap[_mode] = _mutatorMap[_mode] || {}, _mutatorMap[_mode].get = function () {
    return this[priv].exports.__esModule === true ? "es" : "common";
  }, _exports = "exports", _mutatorMap[_exports] = _mutatorMap[_exports] || {}, _mutatorMap[_exports].get = function () {
    var self = this;

    if (this.type === "single") {
      if (this.mode === "es" && "default" in this[priv].exports && Object.keys(this[priv].exports).length === 1) return this[priv].exports["default"];
      return this[priv].exports;
    }

    var exp = getClone(this[priv].exports);
    if (!ownProp(exp, "default")) Object.defineProperty(exp, "default", {
      get: function get() {
        return self[priv].exports;
      },
      set: function set(val) {
        return !!Object.defineProperty(this, "default", {
          value: val,
          configurable: true,
          writable: true,
          enumerable: true
        });
      }
    });
    return exp;
  }, (0, _defineProperty2["default"])(_newModule, "export", function () {
    var exp = function exp(key, val) {
      exportSets = exportSets || {};
      exportSets[key] = val;
      Object.defineProperty(this.exports, key, {
        get: function get() {
          return val;
        },
        enumerable: true,
        configurable: true
      });
    };

    Object.defineProperties(exp, Object.getOwnPropertyDescriptors({
      onDemand: function onDemand(name, exp) {
        exportSets = exportSets || {};
        exportSets[name] = exp;

        var returnVal = function returnVal() {
          console.log('requireModder!', requireThis().resolve(this[priv].module.id));

          var requireMod = require(requireThis().resolve(this[priv].module.id));

          if (!(name in requireMod) && requireMod["default"] && requireMod.__esModule && name in requireMod["default"]) requireMod = requireMod["default"];
          requiredMod = Reflect.get(requireMod, name, requireMod);
          if (typeof requiredMod === "function") return requiredMod.apply(void 0, arguments);
          return requiredMod;
        };

        Object.defineProperty(this[priv].exports, name, {
          get: function get() {
            return new Proxy(returnVal, {
              get: function get(obj, prp) {
                var requireMod = require(requireThis().resolve(this[priv].module.id));

                return Reflect.get(requiredMod, prp, requiredMod);
              }
            });
          },
          enumerable: true,
          configurable: true,
          writable: true
        });
      },
      "default": function _default(exp) {
        exportSets = exportSets || {};
        exportSets["default"] = exp;
        Object.defineProperty(this[priv].exports, "default", {
          get: function get() {
            return exp;
          },
          enumerable: true,
          configurable: true,
          writable: true
        });

        if (!this[priv].exports.__esModule) {
          Object.defineProperty(this[priv].exports, "__esModule", {
            value: true,
            enumerable: false,
            writable: true,
            configurable: true
          });
        }
      }
    }));
    return exp;
  }()), (0, _defineProperty2["default"])(_newModule, "set", function () {
    var thiss = this;
    return {
      exports: function exports(cb) {
        var Constructor = req("./Obj/helpers").Constructor;
        var object = thiss;
        var constr = new Constructor(cb);
        console.log("AnoterhConstructorCall", constr.call(object));
      }
    };
  }()), _exports2 = "exports", _mutatorMap[_exports2] = _mutatorMap[_exports2] || {}, _mutatorMap[_exports2].set = function (val) {
    exportSets = {};
    return !!(this[priv].exports = val);
  }, (0, _defineProperty2["default"])(_newModule, prototype, {
    "import": function (thiss) {
      var importer = function (mod) {
        //  let env = (is.function(require) && is.defined(path) && is.defined(path.resolve) && is.defined(module)) ? 'npm' : 'browser'
        var resolved = typeof mod === "string" && resolveThis(mod);
        var fromCache = this.imports.get(mod);
        if (fromCache) return fromCache.compiled || fromCache.exports;
        var returnVal;
        var compiled;
        var obj = (0, _typeof2["default"])(mod) === "object" && mod;
        if (!obj) obj = this.require(resolved);
        if (!this.mode === "es" && (typeof obj === "undefined" || obj === null)) return obj;

        if (this.mode === "es") {
          var newObj = obj;

          if (!obj.__esModule) {
            if (obj === null || (0, _typeof2["default"])(obj) !== "object" && typeof obj !== "function") newObj = getClone(obj);
            Object.defineProperty(newObj, "default", {
              get: function get() {
                return newObj;
              }
            });
            obj = newObj;
          }
        } else if (obj.__esModule) {
          if (Reflect.ownKeys(obj).length === 1 && obj["default"]) obj = obj["default"];else if (obj["default"]) {
            var name = require("path").parse(mod.id).name;

            if (!ownProp(mod, name)) {
              obj = getClone(obj);
              Object.defineProperty(obj, name, {
                get: function get() {
                  return this["default"];
                }
              });
            }
          }
        }

        var modl = typeof mod === "string" ? resolved : mod;
        this.imports.set(modl, {
          exports: returnVal,
          compiled: compiled
        });
        return obj;
      }.bind(thiss);

      importer.dynamic = dynamicImport.bind(thiss);
      importer.onDemand = functionalImport.bind(thiss);
      return importer;
    }(this),

    get imports() {
      var imports = this.imports;
      return Array.from(imports.entries).map(function (ent) {
        return ent[0];
      });
    },

    require: function require(mod, base) {
      if (!base) base = this.id;
      var required;
      if (typeof mod !== "string") required = mod;else {
        if (this.mode !== "es") {
          /*
          try {
            required = req(mod, base);
          } catch (err) {
          */
          // console.error(err)
          required = this.compile.babel(resolveThis(mod, base), 'object'); //}
        } else required = req(mod, base);
      }
      if (required.__esModule && required["default"] && Object.keys(required).length === 1) required = required["default"];
      this.requirements.set(mod, required);
      return required;
    },

    get compile() {
      return Reflect.get(this.constructor, 'compile', this);
    }

  }), (0, _defineEnumerableProperties2["default"])(_newModule, _mutatorMap), _newModule);
  Object.keys(module).filter(function (key) {
    return key !== "exports";
  }).forEach(function (key) {
    try {
      Object.defineProperty(_this, key, {
        get: function get() {
          return _module[key];
        },
        set: function set(val) {
          try {
            return _module[key] = val;
          } catch (_unused2) {
            return true;
          }
        },
        enumerable: true,
        configurable: true
      });
    } catch (_unused3) {}
  });
  return newModule;
}

var Constructor = require("./Obj/helpersCompiled").Constructor;

var theMod = new Constructor(_Module, {
  get imports() {
    if (!imports.has(this)) imports.set(this, new Map());
    return imports.get(this);
  },

  get compile() {
    var thiss = this && this !== _global && this.id ? this : thisMod;
    return {
      // for transforming es to common
      babel: function (src, path) {
        if (globalType() === 'node') {
          src = require("path").resolve(process.cwd(), src || thiss.id);
          return require('./babel-compiler')(src, path);
        }

        if (path === 'object') path = arguments[1] = undefined;
        var params = '?src=' + src;
        if (path) params += '&path=' + path;
        var url = window.location.protocol + "//" + window.location.host + '/compile/babel' + params;

        if (!arguments[1]) {
          require('./babel-compiler')(src, path);

          return requireFromUrl(url);
        }

        return src;
      }.bind(thiss),
      webpack: function (entry, output, id, cb) {
        var args = Array.prototype.slice.call(arguments);

        cb = args.find(function (arg, ind) {
          if (typeof arg === "function") return args.slice(ind, 1);
        }) || function () {
          for (var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++) {
            arg[_key] = arguments[_key];
          }

          console.log(arg);
          return arg;
        };

        var config;

        if ((0, _typeof2["default"])(entry) === 'object') {
          config = entry;
          entry = undefined;
        }

        function compileIt(custom, callback) {
          var earl = require('react-komponent/utils').Earl;

          var url = earl();
          url.pathname = '/compile/webpack';
          return postRequest(url.toString(), custom, 'json', callback);
        }

        return new Promise(function (resolve) {
          var theCb = function theCb(res) {
            if (id && global[id]) res.id = global[id];
            var returnVal = [res];
            if (cb) cb.apply(void 0, returnVal);
            resolve.apply(void 0, returnVal);
          };

          var argus = config ? {
            config: config
          } : {
            input: entry,
            output: output,
            id: id
          };
          compileIt(argus, theCb);
        });
        /*
               if (typeof arguments[1] !== 'string') output = undefined
               entry = overrides.entry || entry
               if (typeof entry === "string")
                 entry = path.resolve(process.cwd(), entry);
               
               if (typeof output === "string")
                 output = path.resolve(process.cwd(), output);
               else if (overrides.output && overrides.output.filename) {
                 overrides.output.path = overrides.output.path || process.cwd()
                 output = path.resolve(process.cwd(),overrides.output.path,overrides.output.filename)
               }
                 
               let asObject = !output, library = overrides.output.library
               if (asObject) {
                 let parsed = path.parse(entry),outputName
                 if (!overrides.output.path && !overrides.output.filename) {
                    outputName = parsed.name+'-webpack-compiled'+parsed.ext
                    output = path.resolve(entry.replace(path.basename(entry),''),outputName)
                 } 
                 
                 if (!library) {
                  library = parsed.name
                  if (library === 'index') {
                    library = path.basename(path.dirname(output))
                    if (library === 'src') { 
                      if (globalType() === 'node') {
                        let pjson = path.resolve(output,'../','package.json')
                        if (require('fs').existsSync(pjson)) {
                          let parsed = JSON.parse(require('fs').readFileSync(src, { encoding: "utf8" }))
                          if (parsed.name) library = parsed.name
                        }
                      }
                      else library = path.dirname(library)           
                    }
                  }
                }
               }
               let defaultOverrides = {
                 target: overrides.target || "node",
                 entry,
                 output: Object.assign(overrides.output,{
                    path: output.split('/'+path.basename(output))[0],
                    filename: path.basename(output),
                    globalObject: overrides.output.globalObject || 'this',
                    publicPath: overrides.output.publicPath || '/'
                 }),
                 resolve: Object.assign(overrides.resolve || {},{
                   modules: [path.resolve(__dirname,'../../../','src'),path.resolve(process.cwd(),'src'),path.resolve(process.cwd(),'node_modules'),path.resolve(__dirname,'../../../','node_modules'),...(overrides && overrides.resolve && overrides.resolve.modules) ? overrides.resolve.modules : []],
                 })
              }
              if (asObject) {
                defaultOverrides.output.library = library,
                defaultOverrides.output.libraryTarget = overrides.output.libraryTarget || 'commonjs2'
              }
              overrides = Object.assign(overrides,defaultOverrides) 
        
              let conf = { overrides };
        
        */

        /*
        let compiled = compiler(conf,function callback(...arg) {
          if (asObject) {
            console.log({arg})
            let result = require(output);
            cb(result, require("fs").readFileSync(output), ...arg);
            res(result);
            console.log('result',result)
            throw new Error('got result')
          }
          cb(...arg);
        }); */

        /*
               return new Promise((res) => {
                 compiler(conf,function callback(...arg) {
                   let result
                   if (asObject) {
                     result = req(output)
                     if (result.default && Object.keys(result).filter(key => key !== 'library').length === 1) result = result.default
                   } 
                   if (cb) res(cb(result, ...arg))
                   else res(result)
                   return result
                 });
               }); */
      }.bind(thiss)
    };
  },

  dynamicImport: dynamicImport
});

function dynamicImport(script, output, id, callback) {
  // let entry,dir, fs = require("fs"), path = require('path')
  callback = Array.apply(void 0, arguments).find(function (ar) {
    return typeof ar === 'function';
  });
  var theWindow = globalType() === 'node' ? {
    location: require('./utilsCompiled').Earl(process.env.serverUrl)
  } : _global;

  var fetchit = require('./utilsCompiled').fetchit;

  if (!isURL(script)) {
    if (!script.indexOf(process.cwd()) === 0) {
      if (script.indexOf('/') === 0) script = '.' + script;
      script = require('path').resolve(process.cwd(), script);
    }
  }

  var params = {
    url: encodeURIComponent(script),
    format: 'url',
    cache: 'true'
  };
  if (arguments[1]) params.id = id;
  if (output) params.output = encodeURIComponent(require('path').resolve(process.cwd(), output));
  var scriptArg = {
    id: id,
    src: script,
    async: false
  };
  var url = 'dynamicScript';
  var earl = req("./utilsCompiled").Earl;

  if (!output) {
    params.format = 'file';
    scriptArg.src = earl.format(_objectSpread(_objectSpread({}, theWindow.location), {}, {
      pathname: '/' + url,
      query: params
    }));
    fetchit(url, params, theWindow, function (res) {
      return insertTag(callback);
    });
    return;
  }

  return new Promise(function (resolve) {
    var cb = function cb(res) {
      var text = res.text();

      var eventHook = function eventHook() {
        for (var _len2 = arguments.length, arg = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          arg[_key2] = arguments[_key2];
        }

        if (window[id]) arg.unshift(window[id]);else arg.unshift(require('react-komponent/utils').browserRequire(scriptArg.src));
        var result = arg;

        if (callback) {
          result = callback.apply(void 0, arg);
          resolve(result);
          return result;
        }

        resolve.apply(void 0, arg);
        return;
      };

      scriptArg.src = text || output;
      insertTag(eventHook);
    };

    var file = fetchit(url, params, window, cb);
  });

  function insertTag() {
    var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : callback;

    if (globalType() === 'node') {
      var hook = serverHooks('constructor');
      return hook(it, true);
    }

    var domarg = Array(globalType() === 'window' ? document : undefined).filter(Boolean);
    return it(require("./DOMCompiled").apply(void 0, (0, _toConsumableArray2["default"])(domarg)));

    function it(dom) {
      var theTag = dom.create("script", scriptArg);

      function loaded(res) {
        console.log('locked and loaded');
        if (global[id]) theTag = global[id];
        console.log('-----theRes---------', res);
        return cb(theTag, res);
      }

      theTag.onload = loaded;
      dom.head.insertBefore(theTag, dom.head.firstElementChild);
      return theTag;
    }
  }
}

module.exports = new Proxy(theMod, {});