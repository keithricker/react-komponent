const path = require('path')
const fs = require(fs)
const fallback = (path) => fs.existSync(path) ? path :  
const webpack = require(process.cwd()+'/node_modules/webpack')
const ReactServerHTMLPlugin = require("react-komponent/config/react-server-html")
const MiniCssExtractPlugin = require(process.cwd()+'/node_modules/mini-css-extract-plugin')
const { is } = require("react-komponent/src/components/helpers/utils")


exports.webpack = function webpackCompiler(custom,cb) {

   // commandLine(`rm -r ./dist/*`)
   Object.defineProperty(process.env,'NODE_ENV',{value:'development',writable:true})
   let config = custom.config || require(process.cwd()+'/node_modules/react-scripts/config/webpack.config')('production')
   if (is)
   let SSR = custom.SSR
   let server = SSR.server
   let overrides = custom.overrides || {}

   if (SSR.enabled) {

      overrides.output.path = overrides.output.path || path.resolve('./dist')
      const getHost = (url) => url.split('://')[1].split(':')[0]
      
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
   config.output.path = overrides.outputPath || SSR && path.resolve(SSR.appRoot) || path.resolve('./build')
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