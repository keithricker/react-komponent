const path = require('path')
const fs = require(fs) 
let webpack = require(process.cwd()+'/node_modules/webpack') || require("webpack")
const ReactServerHTMLPlugin = require("react-komponent/config/react-server-html")
const MiniCssExtractPlugin = require(process.cwd()+'/node_modules/mini-css-extract-plugin')


exports.webpack = function webpackCompiler(custom,cb) {

   // commandLine(`rm -r ./dist/*`)
   let config
   if (!custom.config && !custom.overrides && config.entry) {
      config = custom; custom = undefined
   }
   else config = custom.config || require(process.cwd()+'/node_modules/react-scripts/config/webpack.config')('production')

   Object.defineProperty(process.env,'NODE_ENV',{value:'development',writable:true})
   let SSR = custom.SSR
   let server = SSR && SSR.server
   let overrides = custom.overrides || {}
   let If = (exp,more) => { 
      if (!(more) && typeof exp === 'function') {
         let cb = (res) => res || undefined
         try { return exp(cb) } catch { return undefined }
      }
      return exp ? more(exp) : undefined 
   }

   if (SSR && SSR.enabled) {
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
      config.plugins.push(new ReactServerHTMLPlugin(SSR))
   }
   config.module = config.module || {}
   config.plugins = config.plugins.concat(overrides.plugins || [])
   config.output.path = overrides.outputPath || SSR && path.resolve(SSR.appRoot) 
   config.mode = overrides.mode || 'development'
   config.optimization.minimize = overrides.minimize || false
   config.module.rules = overrides.moduleRules || config.module.rules
   config.module.rules.forEach((rule,ind) => {
      if (rule.oneOf) {
         config.module.rules[ind].oneOf.unshift({
            test: /\.css$/i,
            use: [MiniCssExtractPlugin.loader, 'css-loader'],
         })
      }
   })
   let callback = function(...arg) { 
      if (!cb) cb = (err, stats) => { if (err) console.error(err) }
      let ran = cb(...arg)
      Object.defineProperty(process.env,'NODE_ENV',{value: nodeEnv || 'development',writable:true})
      return ran
   }
   return webpack(config).run(callback(err,stats))
}