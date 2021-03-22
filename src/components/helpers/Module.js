let thisMod = module;
let _global;
try {
  _global = global;
} catch {
  _global = window;
}
const fs = require("fs");

const resolve = function (reqString, base) {
  if (!base) base = this && this !== _global && this.id ? this.id : thisMod.id;
  return require.resolve(
    require("path").resolve(require("path").dirname(base), reqString)
  );
};
let req = (reqString, base) => {
  if (!base) base = this && this !== _global && this.id ? this.id : thisMod.id;
  let dest = resolve(reqString, base);
  return require("" + dest);
};
const getClone = (...arg) => req("./utils").getClone(...arg);
const isURL = (...arg) => req("./utils").isURL(...arg);
const merge = (...arg) => req("./utils").merge(...arg);
let imports = new WeakMap([[dynamicImport, { imports: {} }]]);

function functionalImport(required) {
  let _mod = this;
  return new Proxy(
    {},
    {
      get(ob, prop) {
        let returnVal = function (...arg) {
          let requireMod = req(required, _mod.id);
          if (
            prop !== "default" &&
            requireMod &&
            requireMod.__esModule &&
            requireMod.default &&
            Object.keys(requireMod.length === 1)
          )
            requireMod = requireMod.default;
          let requiredMod = Reflect.get(requireMod, prop, requireMod);
          if (typeof requiredMod === "function") return requiredMod(...arg);
          return requiredMod;
        };
        return new Proxy(returnVal, {
          get(obj, prp) {
            let requireMod = req(required, _mod.id);
            if (
              prop !== "default" &&
              requireMod &&
              requireMod.__esModule &&
              requireMod.default &&
              Object.keys(requireMod.length === 1)
            )
              requireMod = requireMod.default;
            let requiredMod = Reflect.get(requireMod, prop, requireMod);
            return Reflect.get(requiredMod, prp, requiredMod);
          }
        });
      }
    }
  );
}

function _Module(_module, type = "single") {
  if (!_module.exports) _module.exports = {};
  let thiss = this;
  let resolveThis = resolve.bind(this);
  let exportSets;
  let exportsProxy =
    arguments[1] === "single"
      ? undefined
      : new Proxy(_module.exports, {
          set(ob, key, val) {
            let returnVal;
            if (key !== "__esModule")
              returnVal = !!Object.defineProperty(ob, key, { value: val });
            returnVal = !!Reflect.set(...arguments);
            if (returnVal) exportSets[key] = val;
          }
        });
  const getName = (thePath) => {
    let parsed = require("path").parse(thePath);
    return parsed.name === "index"
      ? require("path").parse(parsed.dir).name
      : parsed.name;
  };
  let newModule = {
    [priv]: {
      module: _module,
      exports: _module.exports
    },
    imports: new Map(),
    requirements: new Map(),
    get type() {
      if (typeof arguments[1] === "string") return arguments[1];

      if (this.mode === "es") {
        if (Reflect.hasOwnProperty(this[priv].exports, "default")) {
          if (Object.keys(this[priv].exports).length === 1) return "single";
        }
        return "multiple";
      }
      if (
        !exportSets ||
        (!Reflect.ownKeys(exportSets).length &&
          !Reflect.ownKeys(this[priv].exports.length))
      )
        return "single";
    },
    get name() {
      return getName(this[priv].module.id);
    },
    imports: new Map(),
    get mode() {
      return this[priv].exports.__esModule === true ? "es" : "common";
    },
    get exports() {
      let self = this;
      if (this.type === "single") {
        if (
          this.mode === "es" &&
          "default" in this[priv].exports &&
          Object.keys(this[priv].exports).length === 1
        )
          return this[priv].exports.default;
        return this[priv].exports;
      }
      let exp = getClone(this[priv].exports);
      if (!Reflect.hasOwnProperty(exp, "default"))
        Object.defineProperty(exp, "default", {
          get() {
            return self[priv].exports;
          },
          set(val) {
            return !!Object.defineProperty(this, "default", {
              value: val,
              configurable: true,
              writable: true,
              enumerable: true
            });
          }
        });
      return exp;
    },
    export: (function () {
      let exp = function (key, val) {
        exportSets = exportSets || {};
        exportSets[key] = val;
        Object.defineProperty(this.exports, key, {
          get() {
            return val;
          },
          enumerable: true,
          configurable: true
        });
      };
      Object.defineProperties(
        exp,
        Object.getOwnPropertyDescriptors({
          onDemand(name, exp) {
            exportSets = exportSets || {};
            exportSets[name] = exp;
            let returnVal = function (...arg) {
              let requireMod = require(require.resolve(this[priv].module.id));
              if (
                !(name in requireMod) &&
                requireMod.default &&
                requireMod.__esModule &&
                name in requireMod.default
              )
                requireMod = requireMod.default;
              requiredMod = Reflect.get(requireMod, name, requireMod);
              if (typeof requiredMod === "function") return requiredMod(...arg);
              return requiredMod;
            };
            Object.defineProperty(this[priv].exports, name, {
              get() {
                return new Proxy(returnVal, {
                  get(obj, prp) {
                    let requireMod = require(require.resolve(
                      this[priv].module.id
                    ));
                    return Reflect.get(requiredMod, prp, requiredMod);
                  }
                });
              },
              enumerable: true,
              configurable: true,
              writable: true
            });
          },
          default(exp) {
            exportSets = exportSets || {};
            exportSets.default = exp;
            Object.defineProperty(this[priv].exports, "default", {
              get() {
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
        })
      );
      return exp;
    })(),
    set: (function () {
      let thiss = this;
      return {
        exports: function (cb) {
          const Constructor = req("./Obj/helpers").Constructor;
          let object = thiss;
          let constr = new Constructor(cb);
          console.log("AnoterhConstructorCall", constr.call(object));
        }
      };
    })(),
    set exports(val) {
      exportSets = {};
      return !!(this[priv].exports = val);
    },
    [prototype]: {
      import: (function (thiss) {
        let importer = function (mod) {
          //  let env = (is.function(require) && is.defined(path) && is.defined(path.resolve) && is.defined(module)) ? 'npm' : 'browser'
          let resolved = typeof mod === "string" && resolveThis(mod);
          let fromCache = this.imports.get(mod);
          if (fromCache) return fromCache.compiled || fromCache.exports;
          let returnVal;
          let compiled;
          let obj = typeof mod === "object" && mod;
          if (!obj) obj = this.require(resolved);
          if (
            !this.mode === "es" &&
            (typeof obj === "undefined" || obj === null)
          )
            return obj;

          if (this.mode === "es") {
            let newObj = obj;
            if (!obj.__esModule) {
              if (
                obj === null ||
                (typeof obj !== "object" && typeof obj !== "function")
              )
                newObj = getClone(obj);
              Object.defineProperty(newObj, "default", {
                get() {
                  return newObj;
                }
              });
              obj = newObj;
            }
          } else if (obj.__esModule) {
            if (Reflect.ownKeys(obj).length === 1 && obj.default)
              obj = obj.default;
            else if (obj.default) {
              let name = require("path").parse(mod.id).name;
              if (!Reflect.hasOwnProperty(mod, name)) {
                obj = getClone(obj);
                Object.defineProperty(obj, name, {
                  get() {
                    return this.default;
                  }
                });
              }
            }
          }

          let modl = typeof mod === "string" ? resolved : mod;
          this.imports.set(modl, { exports: returnVal, compiled });

          return obj;
        }.bind(thiss);
        importer.dynamicImport = dynamicImport.bind(thiss);
        importer.onDemand = functionalImport.bind(thiss);
        return importer;
      })(this),
      get imports() {
        let imports = this.imports;
        return Array.from(imports.entries).map((ent) => ent[0]);
      },
      require(mod, base) {
        if (!base) base = this.id;

        let required;
        if (typeof mod !== "string") required = mod;
        else {
          if (this.mode !== "es") {
            /*
            try {
              required = req(mod, base);
            } catch (err) {
            */
            // console.error(err)
            required = this.compile.babel(resolveThis(mod, base));
            //}
          } else required = req(mod, base);
        }
        if (
          required.__esModule &&
          required.default &&
          Object.keys(required).length === 1
        )
          required = required.default;
        this.requirements.set(mod, required);
        return required;
      },
      get compile() {
        return Reflect.get(this.constructor,'compile',this)
      }
    }
  };
  Object.keys(module)
    .filter((key) => key !== "exports")
    .forEach((key) => {
      try {
        Object.defineProperty(this, key, {
          get() {
            return _module[key];
          },
          set(val) {
            try {
              return (_module[key] = val);
            } catch {
              return true;
            }
          },
          enumerable: true,
          configurable: true
        });
      } catch {}
    });
  return newModule;
}
let Constructor = require("./Obj/helpers").Constructor;
const theMod = new Constructor(_Module, {
  get imports() {
    if (!imports.has(this)) imports.set(this, new Map());
    return imports.get(this);
  },
  get compile() {
   let thiss = (this && this !== _global && this.id) ? this : thisMod
   return {
     // for transforming es to common
     babel: function (src, path) {
       src = require("path").resolve(process.cwd(), src || thiss.id);
       let processed;

       let asString = fs.readFileSync(src, { encoding: "utf8" });

       const babel = require("@babel/standalone");
       const transform = babel.transform;
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
         let parsed = require("path").parse(src);
         path = `${parsed.dir}/${parsed.name}-Module-babel-compiled.${parsed.ext}`;
       }
       let dest = require("path").resolve(process.cwd(), path);
       require("fs").writeFileSync(dest, asString);
       if (!arguments[1]) {
         let dest = src;
         let requiredModule = req("" + dest, thiss.id);
         // let requiredModule = require(''+dest)
         // fs.unlinkSync(dest);
         return requiredModule;
       }
       return dest;
     }.bind(thiss),
     webpack: function (entry, output, cb) {
       let nodeExternals = require('webpack-node-externals')
       let path = require('path')
       let overrides = [...arguments].find((arg) => typeof arg === "object") || { output:{},resolve:{} }
       cb =
         [...arguments].find((arg) => typeof arg === "function") ||
         function () {};
       if (typeof arguments[1] !== 'string') output = undefined
       entry = overrides.entry || entry
       if (typeof entry === "string")
         entry = path.resolve(process.cwd(), entry);
       
       if (typeof output === "string")
         output = path.resolve(process.cwd(), output);

       let asObject = typeof arguments[1] !== "string", library = overrides.output.library
       if (asObject) {
         let parsed = path.parse(entry),outputName
         if (!overrides.output.path && !overrides.output.filename) {
            outputName = parsed.name+'-webpack-compiled'+parsed.ext
            output = path.resolve(entry.replace(path.basename(entry),''),outputName)
         } else 
           output = path.resolve(process.cwd(),overrides.output.path,overrides.output.filename)
         
         if (!library) {
          library = parsed.name
          if (library === 'index') library = path.basename(path.dirname(output))
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
      let compiler = require("../../../server/compiler").webpack
    
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

       return new Promise((res) => {
         compiler(conf,function callback(...arg) {
           let result
           if (asObject) {
             console.log('arg',arg)
             result = require(output)
             if (result.default && Object.keys(result).filter(key => key !== 'library').length === 1) result = result.default
           } else result = fs.readFileSync(output)
           console.log('result',result)
           cb(result, ...arg)
           res(result)
           return
         });
       });

     }.bind(thiss)
   };
  },
  dynamicImport(...arg) {
    return dynamicImport(...arg)
  }
});

function dynamicImport(script, id, callback) {
  let entry,dir, fs = require("fs"), path = require('path')
  let output = (typeof callback === 'string') ? arguments[2] : undefined
  if (output) callback = arguments[3]

  let parsed = require("path").parse(script)
  let newPath = require('path').resolve(process.cwd(),parsed.dir+'/'+id+'-dynamicImport'+parsed.ext)
  let isLocal = fs.existsSync(newPath)
  let isModule = isLocal && !!((function() { try { return !!(Object.keys(require(script)).length) } catch { return false } })())

  if (!output && !isModule) {
    if (process.env.PUBLIC_URL) dir = process.env.PUBLIC_URL
    else {
      Array('public','build','dist').forEach(dirName => {
        let stat = fs.statSync(path.resolve(process.cwd(),dirName))
        if (stat && stat.isDirectory()) {
          dir = dir || dirName
        }
      })
    }
    if (dir) output = path.resolve(dir,id+'-dynamicImport.js')
  } else output = path.resolve(process.cwd(),output)

  let dom = new (require("./DOM"))()
  let scriptTag = dom.create("script", {
    id,
    src: script,
    async: false
  });

  if (!output) return insertTag(scriptTag,callback)

  if (isURL(script)) {
    let fetchData = require('../../server/fetchData.js')
    return fetchData(script,(res) => {
      fs.writeFileSync(res,output,'utf-8')
      return dynamicImport(output,id,output,callback)
    })
  }
  let asyncRes, newProps;
  let overrides = {
    entry: entry || path.resolve(process.cwd(),script),
  }

  let filename = path.basename(output)
  let splitPath = output.split(filename)
  let thePath = splitPath[splitPath.length -2]
  overrides.output = { 
    path:thePath,
    filename,
    library:id,
    libraryTarget:'umd'
  }

  theMod.compile.webpack(overrides, (res) => {
    scriptTag.setAttribute('src',output)
    return insertTag(scriptTag,callback)
  })
  if (!callback)
    return new Promise((res) => {
      asyncRes = res;
    });
  function insertTag(script,cb=callback) {
    script.onload = loaded
    dom.head.insertBefore(script, dom.head.firstElementChild);
    function loaded(res) {
      console.log('locked and loaded')
      if (asyncRes) return asyncRes(script,res);
      return cb(script,res);
    }
  }
}

module.exports = new Proxy(theMod,{})
