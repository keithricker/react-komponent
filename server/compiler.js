const webpack = require(process.cwd()+'/node_modules/webpack')
const ReactServerHTMLPlugin = require(modulePath+'/config/react-server-html')
const MiniCssExtractPlugin = require(process.cwd()+'/node_modules/mini-css-extract-plugin')

exports.webpack = function webpackCompiler(custom,cb) {
   // commandLine(`rm -r ./dist/*`)
   Object.defineProperty(process.env,'NODE_ENV',{value:'development',writable:true})
   let config = custom.config || require(process.cwd()+'/node_modules/react-scripts/config/webpack.config')('production')
   let htmlPluginOptions = custom.SSR
   let server = custom.SSR.server
   let overrides = custom.overrides || {}

   if (custom.SSR.enabled) {

      overrides.output.path = overrides.output.path || path.resolve('./dist')
      const getHost = (url) => url.split('://')[1].split(':')[0]
      
      let address
      if (custom.SSR.server) address = custom.SSR.server.address()
      if (address) {
         custom.SSR.port = custom.SSR.port || address.port
         custom.SSR.host = custom.SSR.host || custom.url ? getHost(custom.url) : (address.address === '::') ? 'localhost' : address.address
      } 
      custom.SSR.protocol = custom.SSR.protocol || (custom.SSR.port === 443 || (custom.https && custom.https.key && custom.https.cert)) ? 'https' : 'http'
      custom.SSR.port = custom.SSR.port || process.env.Port || process.env.PORT || 3000
      custom.SSR.host = custom.SSR.host || custom.url ? getHost(custom.url) : 'localhost'
      config.plugins.push(new ReactServerHTMLPlugin(htmlPluginOptions))
   }
   config.module = config.module || {}
   config.plugins = config.plugins.concat(overrides.plugins || [])
   config.output.path = overrides.outputPath || custom.SSR && path.resolve(custom.SSR.appRoot) || path.resolve('./build')
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
   let newcb = function(...arg) { 
      let ran = cb(...arg)
      Object.defineProperty(process.env,'NODE_ENV',{value: nodeEnv || 'development',writable:true})
      return ran
   }
   return webpack(config).run(newcb(err,stats))
}