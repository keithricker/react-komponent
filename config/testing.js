const { Obj, is } = require('react-komponent/src/components/helpers/utils')

const swapProxy = function(reference,handler={}) {

   merge(handler,{ get target() { return reference() } })
   handlerSetup(handler)
   let newProxy = new Proxy(ob,handler)
   return { proxy: newProxy, swap: function(newTarget) {
      reference = newTarget
   }}
   function handlerSetup(handler,trg,src=Reflect) {
      let target = () => trg || handler.target
      Obj(src).forEach((key,val) => {
         handler[key] = function(...arg) { arg[0] = target(); return val(...arg) }
      })
   }   
}

const Module = (function() {
    const requiresInterop = (mod) => Reflect.ownKeys(mod).filter(key => !key.split('__')[0] === '').length === 1
    class Module {
      constructor(mod,mode='common') {
         priv = vars(this)
         ext = Obj(this)
         priv.module = mod

         priv.mode = mode || mod.exports && mod.exports.__esModule ? 'es' : 'common'

         let self = this
         if (!mod.exports) mod.exports = {}
         this.imports = mapFunc(new Map())
         this.requirements = mapFunc(new Map())
         let init = priv.initialize = initialize.bind(this)
         init()

         let exportsHandler = {
            get target() { return mod.exports },
            get(ob,prop) {
               ob = this.target
               if (prop === '__esModule')
                  return priv.mode === 'es'

               if (prop === 'default')
                  return ob.hasOwnProperty('default') ? ob.default : ob

               return ob[prop]
            },
            set(ob,prop,val) { 
               if (prop === '__esModule')
                  if (val === true) priv.mode = 'es'
               return ob[prop] = val
            }
         }

         const { proxy:exportsProxy,swap } = swapProxy(() => { return mod.exports },exportsHandler)
         ext.define('exports', {
            get() { 
               if (mod.exports.default) return mod.exports.default
               if (!mod.exports.__esModule) return mod.exports
               return exportsProxy
            },
            set(val) { mod.exports = val },
            configurable:true
         })

         let thisProxy = new Proxy(mod,{
            get(ob,prop) { return (prop in self) ? self[prop] : ob[prop] }
         })

         return thisProxy

      }
      import(mod) {
         let obj = typeof mod === 'object' ? mod : require(mod)
         let returnVal
         if (obj.__esModule) 
            returnVal = this.compile.babel(require.resolve(mod))
         returnVal = obj.default || obj
         try { this.imports.set(mod,returnVal); return returnVal } catch(err) { throw new Error(err) }
      }
      require(mod) {
         let required = require(mod)
         try { this.requirements.set(required,returnVal); return returnVal } catch(err) { throw new Error(err) }
      }
      compile() {}
      get mode() {
         let priv = vars(this)
         if (!priv.mode) priv.mode = (priv.module.exports && priv.module.exports.__esModule) ? 'es' : 'common' 
         return priv.mode
      }
      set mode(mood) { 
         let priv = vars(this)
         priv.mode = mood; 
         if (priv.module.exports) Obj(priv.module.exports).define('__esModule',mood) 
         return true
      }
    }
    let comp = Module.prototype.compile
  
    comp.babel = function(src,pth) {
       let fileId = randomString()
       src = path.resolve(process.cwd(),src || this.id)
       if (!pth) pth = src+'.'+fileId+'.compiled'
       let moduleDirectory = path.resolve(__dirname,'../../../')
       let dest = !arguments[0] ? pth : path.resolve(process.cwd(),pth)
       
       let command = `cd ${moduleDirectory} && babel ${src} --out-file ${dest} --copy-files`
       
       /* uncomment this! */
       commandLine(command)
  
       if (!arguments[1]) {
          let required = require(pth)
          require('fs').unlinkSync(pth)
          return required
       }
    }
    comp.webpack = require('../../../server').webpack
  
    return Module
  })()