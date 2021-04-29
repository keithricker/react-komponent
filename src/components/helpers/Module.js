
let thisMod = module;
let _global
function globalType() {
  try { 
    if (global && global.constructor && global.constructor.name.toLowerCase() === 'window') {
      _global = global
      return 'window'
    }
    if (window) {
      _global = window
      return 'window'
    }
    _global = global
    return 'node'
  } catch { _global = global; return 'node' }
}
globalType()

const fs = require("fs");
const ownProp = (ob,prop) => Reflect.ownKeys(ob).includes(prop)
const requireThis = () => (globalType() === 'node') ? require : _global.reactKomponent.require

/*
let params = '?path='+str
let url = window.location.protocol+"//"+window.location.host+'/require'+params 

let requiredModule = require('require-from-url/sync')(''+url)
return requiredModule;
*/

const resolve = function (reqString, base) {
  if (!base) base = this && this !== _global && this.id ? this.id : thisMod.id;
  let reslv = requireThis().resolve(
    require("path").resolve(require("path").dirname(base), reqString)
  )
  console.log('reslv!',reslv)
  return reslv;
};

let req = requireThis()("react-komponent/utils").require

req.base = require('path').resolve(process.cwd(),thisMod.id)
const getClone = (...arg) => req("./utilsCompiled").getClone(...arg);
const isURL = (...arg) => req("./utilsCompiled").isURL(...arg);
const merge = (...arg) => req("./utilsCompiled").merge(...arg);
const serverHooks = (name) => req("../../../server/ssrHooks.js").ssrHooks[name]
const postRequest = (...arg) => req("./utilsCompiled").postRequest(...arg)
let imports = new WeakMap([[dynamicImport, { imports: {} }]]);
const requireFromUrl = require('./utilsCompiled').requireFromUrl

function functionalImport(required) {
  let _mod = this;
  return new Proxy(
    {},
    {
      get(ob, prop) {
        let returnVal = function (...arg) {
          console.log('requireModz!',[required, _mod.id])
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
  let theArgs = [...arguments]
  if (!_module.exports) _module.exports = {};
  let thiss = this;
  let resolveThis = resolve.bind(this);
  let exportSets;
  let exportsProxy =
    arguments[1] === "single"
      ? undefined
      : new Proxy(_module.exports, {
          set(ob,key,val,prx) {
            let returnVal;
            if (key !== "__esModule")
              returnVal = !!Object.defineProperty(ob, key, { value: val });
            returnVal = !!Reflect.set(...theArgs);
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
      if (typeof theArgs[1] === "string") return theArgs[1];

      if (this.mode === "es") {
        if (ownProp(this[priv].exports, "default")) {
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
      if (!ownProp(exp, "default"))
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
              console.log('requireModder!',requireThis().resolve(this[priv].module.id))
              let requireMod = require(requireThis().resolve(this[priv].module.id));
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
                    let requireMod = require(requireThis().resolve(
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
              if (!ownProp(mod, name)) {
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
        importer.dynamic = dynamicImport.bind(thiss);
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
            required = this.compile.babel(resolveThis(mod,base),'object');
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
let Constructor = require("./Obj/helpersCompiled").Constructor;

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
       if (globalType() === 'node') {
         src = require("path").resolve(process.cwd(), src || thiss.id);
         return require('./babel-compiler')(src,path)
       }
       if (path === 'object')
         path = arguments[1] = undefined
      
       let params = '?src='+src
       if (path) params+='&path='+path
       let url = window.location.protocol+"//"+window.location.host+'/compile/babel'+params 

       if (!arguments[1]) {
         require('./babel-compiler')(src,path)
         return requireFromUrl(url)
       }
       
       return src;

     }.bind(thiss),
     webpack: function (entry, output, id, cb) {

      let args = [...arguments]
      cb = args.find((arg,ind) => { 
        if (typeof arg === "function") return args.slice(ind,1)
      }) || function (...arg) { console.log(arg); return arg };

      let config
      if (typeof entry === 'object') {
        config = entry; entry = undefined
      }

      function compileIt(custom,callback) {
        let earl = require('react-komponent/utils').Earl
        var url = earl()
        url.pathname = '/compile/webpack';
        return postRequest(url.toString(), custom, 'json', callback);
      }

      return new Promise(resolve => {
        const theCb = (res) => {
          if (id && global[id]) res.id = global[id]
          let returnVal = [res]
          if (cb) cb(...returnVal); resolve(...returnVal); 
        }
        let argus = config ? { config } : { input:entry,output,id }
        compileIt(argus,theCb)
      })

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
  callback = Array(...arguments).find(ar => typeof ar === 'function')
  let theWindow = (globalType() === 'node') ? { location: require('./utilsCompiled').Earl(process.env.serverUrl) } : _global
  let fetchit = require('./utilsCompiled').fetchit

  if (!isURL(script)) {
    if (!script.indexOf(process.cwd()) === 0) {
      if (script.indexOf('/') === 0) script = '.'+script
      script = require('path').resolve(process.cwd(),script)
    }
  }
  let params = {
    url: encodeURIComponent(script),
    format:'url',
    cache:'true'
  }

  if (arguments[1]) params.id = id
  if (output) params.output = encodeURIComponent(require('path').resolve(process.cwd(),output))

  let scriptArg = {
    id,
    src: script,
    async: false
  }
 
  let url = 'dynamicScript'
  let earl = req("./utilsCompiled").Earl

  if (!output) {
    params.format = 'file'
    scriptArg.src = earl.format({...theWindow.location,pathname:'/'+url,query:params})
    fetchit(url,params,theWindow,res => insertTag(callback)) 
    return 
  }

  return new Promise(resolve => {

    const cb = (res) => {
      let text = res.text()
      let eventHook = function(...arg) {  

        if (window[id]) arg.unshift(window[id])
        else arg.unshift(require('react-komponent/utils').browserRequire(scriptArg.src))
        let result = arg
        if (callback) {
          result = callback(...arg) 
          resolve(result)
          return result
        } 
        resolve(...arg) 
        return
      }
      scriptArg.src = text || output
      insertTag(eventHook)
    }
    let file = fetchit(url,params,window,cb)
  })

  function insertTag(cb=callback) {
    if (globalType() === 'node') {
      let hook = serverHooks('constructor')
      return hook(it,true)
    } 

    let domarg = Array(globalType() === 'window' ? document : undefined).filter(Boolean)
    return it(require("./DOMCompiled")(...domarg))
    
    function it(dom) {

      let theTag = dom.create("script", scriptArg);
      function loaded(res) {
        console.log('locked and loaded')
        if (global[id]) theTag = global[id]
        console.log('-----theRes---------',res)
        return cb(theTag,res);
      }
      theTag.onload = loaded
      dom.head.insertBefore(theTag, dom.head.firstElementChild);
      return theTag
    }

  }
}

module.exports = new Proxy(theMod,{})
