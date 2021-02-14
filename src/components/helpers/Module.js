const klass = require('./klass')
const Type = (arg) => (({}).toString.call(arg))
const vars = new WeakMap([[Module,{}]]).get(Module)

function Module(_module,mode) {
    let exportsProxy
    let originalExports = _module.exports
    let priv = { module:_module }
    if (!_module.exports) _module.exports = priv.exports = {}

    this.imports = new Map()
    this.requirements = new Map()
    this.properties = {

       get mode() {
          return mode || this._exports.__esModule === true ? 'es' : 'common'
       },
       get exports() {
          let self = this
          if (exportsProxy) return exportsProxy
          exportsProxy = new Proxy(this._exports,{
 
             get(ob,prop) { 
                let props = { 
                   get default() { return (ob.hasOwnProperty('default') &&  self.mode === 'es') ? ob.default : (Object.keys(ob).length === 1 && ob.default) ? ob.default : ob },
                   get __esModule() { return mode ? mode === 'es' : ob.__esModule }
                }      
                return (prop in props) ? props[prop] : ob[prop] 
             }
          
          })
          return exportsProxy
       },
       _exports: originalExports,
       set exports(val) {
          exportsProxy = undefined
          if ('__esModule' in val || (('default' in val) && (typeof val === 'object' || typeof val === 'function')))
             return this._exports = val
       
          if (this.mode === 'es')
             return this._exports = { default: val}
       }
    } 
    this.static = {

        get import() {
            let importer = function(mod) {
              //  let env = (is.function(require) && is.defined(path) && is.defined(path.resolve) && is.defined(module)) ? 'npm' : 'browser'
              let resolved = (typeof mod === 'string') && require.resolve(mod)
              let fromCache = this.imports.has(mod)
              if (fromCache)
                 return fromCache.compiled || fromCache.exports
              let returnVal; let compiled
              let obj = (typeof mod === 'object') && mod
              if (!obj) {
                 try { 
                    obj = this.require(mod) 
                 } catch {
                    compiled = obj = this.compile.babel(resolved)
                 }
              }
     
              if (typeof obj === 'undefined') return
              returnVal = this.mode !== 'es' ? obj : (obj && obj.__esModule) ? obj : { default: obj }
     
              let modl = (typeof mod === 'string') ? resolved : mod
              this.imports.set(modl,{ exports:returnVal,compiled })
     
              return returnVal
           }.bind(this)
           return importer
         },
         get dynamicImport() { return dynamicImport.bind(this) },
         dynamicImportSync(mod) { return (function() { return require(mod) })() },
         get imports() {  
            let imports = vars.imports = new Map()
            return Array.from(imports.entries).map(ent => ent[0])
         },
         require(mod) {
            let required = typeof mod === 'string' ? require(mod) : mod
            if (mod.__esModule && mod.default && Object.keys(mod.default).length ===1) required = mod.default
            this.requirements.set(mod,required); 
            return required
         },
         compile: {
            // for transforming es to common
            get babel() { 
               return function babel(src,path) {
                  src = require("path").resolve(process.cwd(),src || self.id)
                  let processed
         
                  let asString = require('fs').readFileSync(src)
                  processed = require("@babel/core").transformSync(asString,{
                     presets: ["@babel/preset-react”,”@babel/preset-env"],
                     plugins: ["@babel/plugin-transform/react-jsx"]
                  }); 
         
                  if (!path) return require('require-from-string')(processed)
                  let dest = require("path").resolve(process.cwd(),path)
                  require('fs').writeFileSync(dest,asString)
               }  
            },
            get webpack() {
               return function webpack(entry,output,cb) { 
                  let config = [...arguments].find(arg => typeof arg === 'object')
                  cb = [...arguments].find(arg => typeof arg === 'function') || function() {}
                  if (typeof entry === 'string') 
                     entry = require("path").resolve(process.cwd(),entry)
                  if (typeof output === 'string') 
                     output = require("path").resolve(process.cwd(),output)
                  
                  let asObject = (typeof output !== 'string')
                  if (asObject) output = require("path").resolve('./')

                  let overrides = { 
                     target: config && config.target || 'web',
                     entrypoint: config ? config.entrypoint : entry,
                     output: config && config.output ? config.output : { path: require("path").dirname(output),filename: require("path").basename(output) }
                  } 
                  
                  conf = { config, overrides }
                 
                  return new Promise(res => {
                     require('../../../server/compiler')(function callback(...arg) {
                        if (asObject) {
                           let result = require(output)
                           cb(result,require("fs").readFileSync(output),...arg) 
                           res(result)
                        }
                        cb(...arg)
                     })
                  })

               } 
            }                  
         }        
    }
    Object.keys(module).filter(key => key !== 'exports' && key !== 'id').forEach(key => {
       try { 
       Object.defineProperty(this,key,{ 
          get() {
             return _module[key]
          },
          set(val) { try { return _module[key] = val } catch { return true } },
          enumerable:true, configurable:true
       }) } catch {}
    })
    vars.set(this,priv)
    return this
 }
 Module = klass(Module)

let imports = new WeakMap([[dynamicImport,{imports:{}}]]).get(dynamicImport)
function dynamicImport(script,id,callback) {

   let scriptTag = new require("./DOM").tag.create('script',{ id,src:script,async:false })

   let asyncRes; newProps

   let options = { 
      overrides:  {
         entrypoint: src,
         library: id
      }
   }
   if (typeof outputPath === 'string') options.outputPath = outputPath
   
   Module.compile.webpack(options,(res) => {
      imports[id] = res
      document.head.insertBefore(scriptTag,head.firstElementChild)     
      scriptTag.addEventListener("load", loaded, false)

      function loaded() {
         if (asyncRes) return asyncRes(res)
         callback(res)
      }

   })

   if (!callback) return new Promise(res => {
      asyncRes = res
   })

}
 