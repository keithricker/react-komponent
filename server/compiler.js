const nodeEnv = process.env.NODE_ENV || 'production'
Object.defineProperty(process.env,'NODE_ENV',{value:'development',writable:true,enumerable:true,configurable:true})
const ReactServerHTMLPlugin = (ssr) => new (require("react-komponent/config/react-server-html"))(ssr)
const MiniCssExtractPlugin = require(process.cwd()+'/node_modules/mini-css-extract-plugin')
const HtmlWebpackPlugin = require(process.cwd()+'/node_modules/html-webpack-plugin')
let _global
try { _global = window } catch { _global = global }

exports.webpack = function webpackCompiler(custom,cb) {
   
   let path = require('path')
   let config = custom.config
   let isDefault = false
   if (!custom.config && !custom.overrides && custom.entry) {
      config = custom; custom = {config}
   }
   let webpack = require("webpack")
   if (!config) {
      config = require(process.cwd()+'/node_modules/react-scripts/config/webpack.config')('production')
      isDefault = true
   }
   if (custom && !custom.config) custom.config = config
   else if (!custom) custom = {config}

   Object.defineProperty(process.env,'NODE_ENV',{value:'development',writable:true})
   let SSR = custom.SSR
   let server = SSR && SSR.server
   let overrides = custom.overrides || { output: {} }

   let If = (exp,more) => { 
      if (!(more) && typeof exp === 'function') {
         let cb = (res) => res || undefined
         try { return exp(cb) } catch { return undefined }
      }
      return exp ? more(exp) : undefined 
   }

   if (SSR && SSR.enabled) {
      const path = require('path')
      overrides.output.path = path.resolve(process.cwd(),overrides.output.path || './dist')
      const getHost = (url) => If(/:\/\/([^ ^:]*)/.exec(url),(res) => res[1])
      
      let address = server && server.address()
      if (address) {
         SSR.port = SSR.port || address.port
         SSR.host = SSR.host || custom.url ? getHost(custom.url) : (address.address === '::') ? 'localhost' : address.address
      } 
      SSR.protocol = SSR.protocol || (SSR.port === 443 || (custom.https && custom.https.key && custom.https.cert)) ? 'https' : 'http'
      SSR.port = SSR.port || process.env.Port || process.env.PORT || 3000
      SSR.host = SSR.host || custom.url ? getHost(custom.url) : 'localhost'
      config.plugins.push(ReactServerHTMLPlugin(SSR))
   }
   config.entry = overrides.entry || config.entry
   if (typeof config.entry === 'string') config.entry = path.resolve(process.cwd(),config.entry)
   else if (Array.isArray(config.entry)) config.entry = config.entry.map(ent => path.resolve(process.cwd(),ent))
   else if (typeof entry === 'object') Object.keys(entry).forEach(key => config.entry[key] = path.resolve(process.cwd(),config.entry[key]))
   config.module = config.module || {}
   overrides.optimization = overrides.optimization || {}
   config.plugins = config.plugins.concat(overrides.plugins || [])
   config.output.path = SSR && SSR.appRoot ? path.resolve(process.cwd(),SSR.appRoot) : (overrides.output && overrides.output.path) ? overrides.output.path : path.resolve(process.cwd(),'dist')  
   if (overrides.output) config.output = Object.assign(config.output,overrides.output)
   
   config.mode = overrides.mode || 'development'
   config.optimization.minimize = false
   config.optimization = Object.assign(config.optimization,overrides.optimization)
   config.module.rules = overrides.moduleRules || config.module.rules
   config.module.rules.forEach((rule,ind) => {
      if (rule.oneOf) {
         config.module.rules[ind].oneOf.unshift({
            test: /\.css$/i,
            use: [MiniCssExtractPlugin.loader, 'css-loader'],
         })
      }
   })
   if (isDefault) config.node = { global: true, __filename: true, __dirname: true }
   config.node = overrides.node || config.node
   config.target = overrides.target || config.target || 'web'
   if (!config.resolve && overrides.resolve) 
     config.resolve = overrides.resolve 
   else if (config.resolve && overrides.resolve) {
      let resmods
      if (config.resolve.modules && overrides.resolve.modules) 
        resmods = [...config.resolve.modules,...overrides.resolve.modules]
      config.resolve = {...config.resolve,...overrides.resolve,modules:resmods}
   }
   delete config.output.jsonpFunction
   delete config.output.futureEmitAssets


   config.plugins.forEach((plug,ind) => { 
     if (plug.constructor.name === 'IgnorePlugin' || plug.constructor.name === 'ManifestPlugin' || (config.target === 'node' && plug.constructor.name === 'HtmlWebpackPlugin')) 
       delete config.plugins[ind]
     else if (plug.constructor.name === 'IgnorePlugin') 
       config.plugins[ind] = new webpack.IgnorePlugin({ resourceRegExp:/^\.\/locale$/, contextRegExp:/moment$/ })
   })
   Reflect.ownKeys(overrides).forEach(key => { if (typeof config[key] === 'undefined') config[key] = overrides[key] })

   config.entry.runtimeChunk = true
   
   if (config.target === 'node' || SSR) {
     delete config.optimization.splitChunks
     delete config.optimization.runtimeChunk
     config.optimization.minimize = false,
     config.plugins.unshift(
        new webpack.optimize.LimitChunkCountPlugin({
           maxChunks: 1
        })
     )
     config.plugins.forEach((plug,ind)=> {
        if (plug instanceof HtmlWebpackPlugin)
           config.plugins.splice(ind,1)
     })
     delete config.output.chunkFilename
   }

   config.plugins = Array(...config.plugins).filter(Boolean)
   
   console.log('config',config)
   console.log('overrides',overrides)

   config = overrides

   let callback = function(...arg) { 
      if (!cb) cb = (err, stats) => { if (err) console.error(err) }
      Object.defineProperty(process.env,'NODE_ENV',{value: nodeEnv || 'development',writable:true})
      let globalType = _global.constructor.name.toLowerCase() === 'window' ? 'window' : 'global'
      if (config.output.library && globalType === 'window' && window[config.output.library])
         arg.push(window[config.output.library])
      let ran = cb(...arg)
      return ran
   }
   return webpack(config).run(callback)
}