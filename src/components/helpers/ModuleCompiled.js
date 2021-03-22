"use strict";

var _this = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _defineEnumerableProperties(obj, descs) { for (var key in descs) { var desc = descs[key]; desc.configurable = desc.enumerable = true; if ("value" in desc) desc.writable = true; Object.defineProperty(obj, key, desc); } if (Object.getOwnPropertySymbols) { var objectSymbols = Object.getOwnPropertySymbols(descs); for (var i = 0; i < objectSymbols.length; i++) { var sym = objectSymbols[i]; var desc = descs[sym]; desc.configurable = desc.enumerable = true; if ("value" in desc) desc.writable = true; Object.defineProperty(obj, sym, desc); } } return obj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var thisMod = module;

var _global;

try {
  _global = global;
} catch (_unused) {
  _global = window;
}

var fs = require("fs");

var resolve = function resolve(reqString, base) {
  if (!base) base = this && this !== _global && this.id ? this.id : thisMod.id;
  return require.resolve(require("path").resolve(require("path").dirname(base), reqString));
};

var req = function req(reqString, base) {
  if (!base) base = _this && _this !== _global && _this.id ? _this.id : thisMod.id;
  var dest = resolve(reqString, base);
  return require("" + dest);
};

var getClone = function getClone() {
  var _req;

  return (_req = req("./utils")).getClone.apply(_req, arguments);
};

var isURL = function isURL() {
  var _req2;

  return (_req2 = req("./utils")).isURL.apply(_req2, arguments);
};

var merge = function merge() {
  var _req3;

  return (_req3 = req("./utils")).merge.apply(_req3, arguments);
};

var imports = new WeakMap([[_dynamicImport, {
  imports: {}
}]]);

function functionalImport(required) {
  var _mod = this;

  return new Proxy({}, {
    get: function get(ob, prop) {
      var returnVal = function returnVal() {
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
      _this2 = this;

  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "single";
  if (!_module.exports) _module.exports = {};
  var thiss = this;
  var resolveThis = resolve.bind(this);
  var exportSets;
  var exportsProxy = arguments[1] === "single" ? undefined : new Proxy(_module.exports, {
    set: function set(ob, key, val) {
      var returnVal;
      if (key !== "__esModule") returnVal = !!Object.defineProperty(ob, key, {
        value: val
      });
      returnVal = !!Reflect.set.apply(Reflect, arguments);
      if (returnVal) exportSets[key] = val;
    }
  });

  var getName = function getName(thePath) {
    var parsed = require("path").parse(thePath);

    return parsed.name === "index" ? require("path").parse(parsed.dir).name : parsed.name;
  };

  var newModule = (_newModule = {}, _defineProperty(_newModule, priv, {
    module: _module,
    exports: _module.exports
  }), _defineProperty(_newModule, "imports", new Map()), _defineProperty(_newModule, "requirements", new Map()), _type = "type", _mutatorMap = {}, _mutatorMap[_type] = _mutatorMap[_type] || {}, _mutatorMap[_type].get = function () {
    if (typeof arguments[1] === "string") return arguments[1];

    if (this.mode === "es") {
      if (Reflect.hasOwnProperty(this[priv].exports, "default")) {
        if (Object.keys(this[priv].exports).length === 1) return "single";
      }

      return "multiple";
    }

    if (!exportSets || !Reflect.ownKeys(exportSets).length && !Reflect.ownKeys(this[priv].exports.length)) return "single";
  }, _name = "name", _mutatorMap[_name] = _mutatorMap[_name] || {}, _mutatorMap[_name].get = function () {
    return getName(this[priv].module.id);
  }, _defineProperty(_newModule, "imports", new Map()), _mode = "mode", _mutatorMap[_mode] = _mutatorMap[_mode] || {}, _mutatorMap[_mode].get = function () {
    return this[priv].exports.__esModule === true ? "es" : "common";
  }, _exports = "exports", _mutatorMap[_exports] = _mutatorMap[_exports] || {}, _mutatorMap[_exports].get = function () {
    var self = this;

    if (this.type === "single") {
      if (this.mode === "es" && "default" in this[priv].exports && Object.keys(this[priv].exports).length === 1) return this[priv].exports["default"];
      return this[priv].exports;
    }

    var exp = getClone(this[priv].exports);
    if (!Reflect.hasOwnProperty(exp, "default")) Object.defineProperty(exp, "default", {
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
  }, _defineProperty(_newModule, "export", function () {
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
          var requireMod = require(require.resolve(this[priv].module.id));

          if (!(name in requireMod) && requireMod["default"] && requireMod.__esModule && name in requireMod["default"]) requireMod = requireMod["default"];
          requiredMod = Reflect.get(requireMod, name, requireMod);
          if (typeof requiredMod === "function") return requiredMod.apply(void 0, arguments);
          return requiredMod;
        };

        Object.defineProperty(this[priv].exports, name, {
          get: function get() {
            return new Proxy(returnVal, {
              get: function get(obj, prp) {
                var requireMod = require(require.resolve(this[priv].module.id));

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
  }()), _defineProperty(_newModule, "set", function () {
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
  }, _defineProperty(_newModule, prototype, {
    "import": function (thiss) {
      var importer = function (mod) {
        //  let env = (is.function(require) && is.defined(path) && is.defined(path.resolve) && is.defined(module)) ? 'npm' : 'browser'
        var resolved = typeof mod === "string" && resolveThis(mod);
        var fromCache = this.imports.get(mod);
        if (fromCache) return fromCache.compiled || fromCache.exports;
        var returnVal;
        var compiled;
        var obj = _typeof(mod) === "object" && mod;
        if (!obj) obj = this.require(resolved);
        if (!this.mode === "es" && (typeof obj === "undefined" || obj === null)) return obj;

        if (this.mode === "es") {
          var newObj = obj;

          if (!obj.__esModule) {
            if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") newObj = getClone(obj);
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

            if (!Reflect.hasOwnProperty(mod, name)) {
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

      importer.dynamicImport = _dynamicImport.bind(thiss);
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
          required = this.compile.babel(resolveThis(mod, base)); //}
        } else required = req(mod, base);
      }
      if (required.__esModule && required["default"] && Object.keys(required).length === 1) required = required["default"];
      this.requirements.set(mod, required);
      return required;
    },

    get compile() {
      return Reflect.get(this.constructor, 'compile', this);
    }

  }), _defineEnumerableProperties(_newModule, _mutatorMap), _newModule);
  Object.keys(module).filter(function (key) {
    return key !== "exports";
  }).forEach(function (key) {
    try {
      Object.defineProperty(_this2, key, {
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

var Constructor = require("./Obj/helpers").Constructor;

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
        src = require("path").resolve(process.cwd(), src || thiss.id);
        var processed;
        var asString = fs.readFileSync(src, {
          encoding: "utf8"
        });

        var babel = require("@babel/standalone");

        var transform = babel.transform;
        processed = transform(asString, {
          presets: ["react", "env"]
        });
        /*
        processed = require("@babel/core").transformFile("" + asString, {
          presets: ["@babel/preset-react","@babel/preset-env"],
          plugins: ["@babel/plugin-transform/react-jsx"],
        });
        */

        asString = processed.code;

        if (!path) {
          var parsed = require("path").parse(src);

          path = "".concat(parsed.dir, "/").concat(parsed.name, "-Module-babel-compiled.").concat(parsed.ext);
        }

        var dest = require("path").resolve(process.cwd(), path);

        require("fs").writeFileSync(dest, asString);

        if (!arguments[1]) {
          var _dest = src;
          var requiredModule = req("" + _dest, thiss.id); // let requiredModule = require(''+dest)
          // fs.unlinkSync(dest);

          return requiredModule;
        }

        return dest;
      }.bind(thiss),
      webpack: function (entry, output, cb) {
        var nodeExternals = require('webpack-node-externals');

        var path = require('path');

        var overrides = Array.prototype.slice.call(arguments).find(function (arg) {
          return _typeof(arg) === "object";
        }) || {
          output: {},
          resolve: {}
        };

        cb = Array.prototype.slice.call(arguments).find(function (arg) {
          return typeof arg === "function";
        }) || function () {};

        if (typeof arguments[1] !== 'string') output = undefined;
        entry = overrides.entry || entry;
        if (typeof entry === "string") entry = path.resolve(process.cwd(), entry);
        if (typeof output === "string") output = path.resolve(process.cwd(), output);
        var asObject = typeof arguments[1] !== "string",
            library = overrides.output.library;

        if (asObject) {
          var parsed = path.parse(entry),
              outputName;

          if (!overrides.output.path && !overrides.output.filename) {
            outputName = parsed.name + '-webpack-compiled' + parsed.ext;
            output = path.resolve(entry.replace(path.basename(entry), ''), outputName);
          } else output = path.resolve(process.cwd(), overrides.output.path, overrides.output.filename);

          if (!library) {
            library = parsed.name;
            if (library === 'index') library = path.basename(path.dirname(output));
          }
        }

        var defaultOverrides = {
          target: overrides.target || "node",
          entry: entry,
          output: Object.assign(overrides.output, {
            path: output.split('/' + path.basename(output))[0],
            filename: path.basename(output),
            globalObject: overrides.output.globalObject || 'this',
            publicPath: overrides.output.publicPath || '/'
          }),
          resolve: Object.assign(overrides.resolve || {}, {
            modules: [path.resolve(__dirname, '../../../', 'src'), path.resolve(process.cwd(), 'src'), path.resolve(process.cwd(), 'node_modules'), path.resolve(__dirname, '../../../', 'node_modules')].concat(_toConsumableArray(overrides && overrides.resolve && overrides.resolve.modules ? overrides.resolve.modules : []))
          })
        };

        if (asObject) {
          defaultOverrides.output.library = library, defaultOverrides.output.libraryTarget = overrides.output.libraryTarget || 'commonjs2';
        }

        overrides = Object.assign(overrides, defaultOverrides);
        var conf = {
          overrides: overrides
        };

        var compiler = require("../../../server/compiler").webpack;
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


        return new Promise(function (res) {
          compiler(conf, function callback() {
            var result;

            for (var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++) {
              arg[_key] = arguments[_key];
            }

            if (asObject) {
              console.log('arg', arg);
              result = require(output);
              if (result["default"] && Object.keys(result).filter(function (key) {
                return key !== 'library';
              }).length === 1) result = result["default"];
            } else result = fs.readFileSync(output);

            console.log('result', result);
            cb.apply(void 0, [result].concat(arg));
            res(result);
            return;
          });
        });
      }.bind(thiss)
    };
  },

  dynamicImport: function dynamicImport() {
    return _dynamicImport.apply(void 0, arguments);
  }
});

function _dynamicImport(script, id, callback) {
  var entry,
      dir,
      fs = require("fs"),
      path = require('path');

  var output = typeof callback === 'string' ? arguments[2] : undefined;
  if (output) callback = arguments[3];

  var parsed = require("path").parse(script);

  var newPath = require('path').resolve(process.cwd(), parsed.dir + '/' + id + '-dynamicImport' + parsed.ext);

  var isLocal = fs.existsSync(newPath);
  var isModule = isLocal && !!function () {
    try {
      return !!Object.keys(require(script)).length;
    } catch (_unused4) {
      return false;
    }
  }();

  if (!output && !isModule) {
    if (process.env.PUBLIC_URL) dir = process.env.PUBLIC_URL;else {
      Array('public', 'build', 'dist').forEach(function (dirName) {
        var stat = fs.statSync(path.resolve(process.cwd(), dirName));

        if (stat && stat.isDirectory()) {
          dir = dir || dirName;
        }
      });
    }
    if (dir) output = path.resolve(dir, id + '-dynamicImport.js');
  } else output = path.resolve(process.cwd(), output);

  var dom = new (require("./DOM"))();
  var scriptTag = dom.create("script", {
    id: id,
    src: script,
    async: false
  });
  if (!output) return insertTag(scriptTag, callback);

  if (isURL(script)) {
    var fetchData = require('../../server/fetchData.js');

    return fetchData(script, function (res) {
      fs.writeFileSync(res, output, 'utf-8');
      return _dynamicImport(output, id, output, callback);
    });
  }

  var asyncRes, newProps;
  var overrides = {
    entry: entry || path.resolve(process.cwd(), script)
  };
  var filename = path.basename(output);
  var splitPath = output.split(filename);
  var thePath = splitPath[splitPath.length - 2];
  overrides.output = {
    path: thePath,
    filename: filename,
    library: id,
    libraryTarget: 'umd'
  };
  theMod.compile.webpack(overrides, function (res) {
    scriptTag.setAttribute('src', output);
    return insertTag(scriptTag, callback);
  });
  if (!callback) return new Promise(function (res) {
    asyncRes = res;
  });

  function insertTag(script) {
    var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : callback;
    script.onload = loaded;
    dom.head.insertBefore(script, dom.head.firstElementChild);

    function loaded(res) {
      console.log('locked and loaded');
      if (asyncRes) return asyncRes(script, res);
      return cb(script, res);
    }
  }
}

module.exports = new Proxy(theMod, {});