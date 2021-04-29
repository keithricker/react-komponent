const nodeEnv = process.env.NODE_ENV || 'production'

Object.defineProperty(process.env,'NODE_ENV',{value:'development',writable:true,enumerable:true,configurable:true})
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

exports.webpack = function webpackCompiler(options,cb) {
   let configCallback
   if (typeof options.configCallback === 'function') {
     configCallback = options.configCallback
     delete options.configCallback
   }
   let custom = {...options}
   let path = require('path')

   let confg
   const customOptions = function(option,val) {
     if (typeof options !== 'object') return
     confg = confg || options.config || options.overrides || options
     if (!arguments.length) return confg
     if (typeof option === 'string') {
       if (arguments.length === 2)
         return !!(confg[option] = val)

       if (confg.hasOwnProperty(option)) return confg
       return
     }
     if (typeof option === 'function') {
       try { return option(confg) } catch { return }
     }
  }

   let config = custom.config
   if (!custom.config && !custom.overrides && custom.entry) {
      config = custom; custom = {config}
   }
   let overrides = custom.overrides || { output: {} }
   overrides.output = overrides.output || {}

   let version = Array(config,overrides).filter(Boolean).some(con => !!(con.output && con.output.library) || !!(con.target === 'node')) ? '_webpack' : 'oldWebpack'
   
   version = '_webpack'

   const webpack = require(`../src/${version}`).webpack
   const ReactServerHTMLPlugin = (ssr) => new (require(`../src/oldWebpack/config/react-server-html`))(ssr)
   let MiniCssExtractPlugin = require(`../src/${version}/node_modules/mini-css-extract-plugin`)
   let IgnorePlugin = require(`../src/${version}`).webpack.IgnorePlugin

   let useDefault = false

   if (!config) {
      useDefault = true
      config = require(`../src/${version}`).config('production')
   }

   if (custom && !custom.config) custom.config = config
   else if (!custom) custom = {config}

   Object.defineProperty(process.env,'NODE_ENV',{value:'development',writable:true})
   let SSR = custom.SSR
   let server = SSR && SSR.server

   let If = (exp,more) => { 
      if (!(more) && typeof exp === 'function') {
         let cb = (res) => res || undefined
         try { return exp(cb) } catch { return undefined }
      }
      return exp ? more(exp) : undefined 
   }

   overrides.plugins = overrides.plugins || []
   config.plugins = config.plugins || []
   let constructors = overrides.plugins.map(or => or.constructor && or.constructor.name).filter(Boolean)
   config.plugins = config.plugins.filter(plug => { if (!plug.constructor) return true; return !constructors.includes(plug.constructor.name) }).concat(overrides.plugins)

        
   if (SSR && SSR.enabled) {
      const path = require('path')
      overrides.output.path = path.resolve(process.cwd(),overrides.output.path || './dist')
      const getHost = (url) => If(/:\/\/([^ ^:]*)/.exec(url),(res) => res[1])
      
      let address = server && server.address()
      if (address) {
         SSR.port = SSR.port || address.port
         SSR.host = SSR.host || custom.url ? getHost(custom.url) : (address.address === '::') ? 'localhost' : address.address
      } 
      if (!SSR.protocol)
         SSR.protocol = (SSR.port === 443 || !!(custom.https && custom.https.key && custom.https.cert)) ? 'https' : 'http'
      SSR.port = SSR.port || process.env.Port || process.env.PORT || 3000
      SSR.host = SSR.host || custom.url ? getHost(custom.url) : 'localhost'
      config.plugins.push(ReactServerHTMLPlugin(SSR))
   }

   config.entry = overrides.entry || config.entry
   if (typeof config.entry === 'string') config.entry = path.resolve(process.cwd(),config.entry)
   else if (Array.isArray(config.entry)) config.entry = config.entry.map(ent => path.resolve(process.cwd(),ent))
   else if (typeof entry === 'object') Object.keys(entry).forEach(key => config.entry[key] = path.resolve(process.cwd(),config.entry[key]))

   if (!config.module) config.module = {}  
   if (config.module.rules && config.module.rules.length && overrides.module && overrides.module.rules && overrides.module.rules.length)
     config.module.rules = [{oneOf: overrides.module.rules.concat(config.module.rules)}]
   else config.module.rules = customOptions(cust => cust.module.rules) || config.module.rules || []

   if (version === 'oldWebpack' && !useDefault) {
    useMiniCss = {
      test: /\.css$/i,
      use: [MiniCssExtractPlugin.loader, require.resolve('css-loader')]
    }
    let cssPushed = false
    config.module.rules.forEach((rule,ind) => {   
      if (rule.oneOf && !cssPushed) {
        cssPushed = true
        config.module.rules[ind].oneOf.unshift(useMiniCss)         
      }
    })
    if (!cssPushed)
      config.module.rules = config.module.rules.filter(rule => {
        let test = rule.test;
        if (!Array.isArray(test)) test = [test]
        return !(test.some(test => test.test('file.css') && !test.test('file.xyzabcpqdqeevjaoseyvn')))
      }).unshift(useMiniCss)
   }

   let defaultBabel = {
     test: /\.(js|mjs|jsx|ts|tsx)$/, 
     exclude: /node_modules/,
     use: {
      loader: require.resolve(`../src/${version}/node_modules/babel-loader`) 
     }   
   } 
   
   let optionsLibrary = customOptions(con => con.output.library)
   if (!config.output) config.output = {}
   if (optionsLibrary) {
     config.output = customOptions().output
     config.output.globalObject = config.output.globalObject || 'this'
     config.output.publicPath = config.output.publicPath || global.SSR.publicPath
     if (config.output.libraryTarget === 'umd') {
      config.output.umdNamedDefine = true

      let rules = config.module.rules.map(rule => rule.oneOf).find(rule => !!rule) || config.module.rules
      let theRule = rules.find(rule => rule.use && rule.use.loader && rule.use.loader.includes('babel-loader'))

      if (!theRule) {
        theRule = defaultBabel
        rules.unshift(theRule)
      }
      theRule.use = theRule.use || {}
      theRule.use.options = theRule.use.options || {}
      theRule.use.options.presets = theRule.use.options.presets || []
      let presets = theRule.use.options.presets, theArray, theOptions

      presets.forEach((pre,ind) => {
        if (Array.isArray(pre) && pre.filter(pre => typeof pre === 'string').length === 1 && typeof pre[0] === 'string' && pre[0].includes('preset-env'))
          return !!(theArray = presets[ind])
        if (pre.includes('preset-env')) {
          theArray = [presets[ind]]
          presets[ind] = theArray
        }
      })
      if (!theArray) {
        theArray = ["@babel/preset-env"]
        presets.push(theArray)
      }
      let hasOptions = typeof theArray[1] === 'object'
      theOptions = hasOptions ? theArray[1] : {}
      if (!hasOptions) theArray.push(theOptions)
      theOptions.loose = true; theOptions.modules = 'umd'
     }
   }
   else config.output = Object.assign(config.output,overrides.output)

   config.output.path = SSR && SSR.appRoot ? path.resolve(process.cwd(),SSR.appRoot) : overrides.output.path ? path.resolve(process.cwd(),overrides.output.path) : path.resolve(process.cwd(),'dist')  
   
   config.mode = overrides.mode || 'development'
   config.optimization = Object.assign(config.optimization || {},overrides.optimization || {})
   config.optimization.minimize = customOptions(cust => cust.optimization.minimize) || false

   config.module = Object.assign(config.module || {},overrides.module || {}) 
   config.module.rules = [...config.module.rules || [],...overrides.module && overrides.module.rules || []]

   config.node = overrides.node || config.node
   config.target = overrides.target || config.target || 'web'
   
   if (config.target === 'node') {

      config.externals = [require('webpack-node-externals')()]

      let babelPushed = false
      config.module.rules.forEach((rule,ind) => {   
        if (rule.oneOf && !babelPushed) {
          babelPushed = true
          config.module.rules[ind].oneOf.unshift(defaultBabel)         
        }
      })
      if (!babelPushed)
        config.module.rules = config.module.rules.filter(rule => {
          let test = rule.test;
          if (!Array.isArray(test)) test = [test]
          return !(test.some(test => (test.test('file.js') || test.test('file.jsx')) && !test.test('file.jbyxyzpzpabcxyz') ))
        }).unshift(defaultBabel)      

      config.module.rules.unshift(defaultBabel)
   }

  /*
   let externals = [{webpack:'webpack',['react-komponent']:'react-komponent'}]
   Array(config,overrides).forEach(ex => { 
     if (!ex.externals) return
     externals = externals.concat(ex.externals)
   })
   config.externals = externals
  */



   let ignores = customOptions().ignore
   if (!ignores && !useDefault) ignores = customOptions().ignore = [[/^\.\/locale$/, /moment$/]]
   if (ignores && ignores.length) {
        
    config.plugins.push(new IgnorePlugin({
      checkResource(request,context) {
        let ignoreThis = false
        let fullPath = path.resolve(context,request)

        let igTest = function(ig,match=fullPath) { 
          if (Array.isArray(ig) && ig.length > 1) 
            return igTest(ig[0],request) || igTest(ig[1],context)
        
          if (ig instanceof RegExp) return ig.test(match)

          if (arguments.length > 1 && match === context)  
            return context === ig || require('path').resolve(process,cwd(),ig) === require('path').resolve(context)

          if (!ig.includes('/')) {
            try { ig = require.resolve(ig) || ig } catch {}
          }
          if (!ig.includes('/')) return request === ig

          if (!request.includes('/')) {
            try { request = require.resolve(request) || fullPath } catch {
              request = fullPath
            }
          } else request = fullPath              
          let split = request.split(ig)
          return !!(split.length > 1 && split[0] === '')
        }
        ignoreThis = ignores.some(ig => igTest(ig))

        if (ignoreThis) return true
      }
    }))
    delete customOptions().ignore
   }
   


   if (!customOptions(con => con.devtool)) delete config.devtool

   let configMods = config.resolve && config.resolve.modules
   if (configMods || (overrides.resolve && overrides.resolve.modules)) {
    config.resolve = {
      ...config.resolve || {},
      ...overrides.resolve || {},
      modules: [
        ...configMods || [], 
        ...(overrides.resolve && overrides.resolve.modules) ? overrides.resolve.modules : [],
        path.resolve(__dirname,'../src/components'), path.resolve(__dirname,'../node_modules'), path.resolve(process.cwd(),'node_modules')
      ]
    }  
   }

   /* if (config.target === 'web' && !config.output.library)
     config.resolve.modules.push(path.resolve(__dirname,"../src/oldWebpack/node_modules")) */

   Reflect.ownKeys(overrides).forEach(key => { if (typeof config[key] === 'undefined') config[key] = overrides[key] })

   if (typeof config.entry === 'object' && !Array.isArray(config.entry))
     config.entry.runtimeChunk = true

   if (config.target === 'node' || SSR || config.output.library) {
     delete config.optimization.splitChunks
     delete config.optimization.runtimeChunk
     config.optimization.minimize = false
     
     if (!useDefault)
      config.plugins.unshift(
          new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1
          })
      )
     delete config.output.chunkFilename
   }

   if (config.target === 'web' && version === '_webpack' && ((!useDefault) || customOptions(con => con.output.library))) {

      let template = SSR ? SSR.htmlTemplate : config.htmlTemplate || overrides.htmlTemplate || path.resolve(process.cwd(),'public/index.html')
     
      let templateOptions = {
        inject: true,
        template,
        filename:'index.html',
       // publicPath: process.env.PUBLIC_URL || process.env.ASSET_PATH || path.resolve(process.cwd(),'./public'),
      }
      if (config.mode === 'production') templateOptions.minify = {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: false,
        minifyCSS: false,
        minifyURLs: true,
      }
      config.plugins.some((plug,ind) => {
        if (plug.constructor && plug.constructor.name === 'HtmlWebpackPlugin') {
          config.plugins.splice(ind,1)
          return true
        }
        return false
      })
      if (customOptions(op => op.output.plugins.find(plug => plug.constructor && plug.constructor.name === 'HtmlWebpackPlugin')) || !customOptions(op => op.output.library))
        config.plugins.unshift(new HtmlWebpackPlugin(templateOptions))
   }
   if (config.mode === 'production') 
   if (!useDefault)
    config.plugins.push(new MiniCssExtractPlugin())

  config.plugins = Array(...config.plugins).filter(Boolean)
  if (config.target === 'node' || customOptions(cust => cust.output.library)) {
    let toss = ['manifestplugin','webpackmanifestplugin','htmlwebpackplugin']
    if (config.target === 'node') toss = toss.concat(['minicssextractplugin','interpolatehtmlplugin','inlinechunkhtmlplugin'])
    let plugs = customOptions(conf => conf.plugins)
    if (plugs) {
      toss = toss.filter(toss => !plugs.find(plug => !!(plug.constructor && plug.constructor.name.toLowerCase() === toss)))
    }
    config.plugins = config.plugins.filter(plug => !(plug.constructor && toss.includes(plug.constructor.name.toLowerCase())))
  }
   delete config.htmlTemplate

   let callback = function(...arg) { 
      if (!cb) cb = (err, stats) => { if (err) console.error(err) }
      Object.defineProperty(process.env,'NODE_ENV',{value: nodeEnv || 'development',writable:true})
      if (config.output.library && globalType() === 'window' && window[config.output.library])
         arg.push(window[config.output.library])
      let ran = cb(...arg)
      return ran
   }
   let confResFall = config.resolve && config.resolve.fallback
   if (confResFall) {
     Object.keys(confResFall).filter(key => confResFall[key] && confResFall[key].includes('browserify')).forEach(key => {
       let filePath = require('../src/_webpack/browser-node').paths[key]
       if (require('fs').existsSync(filePath))
         confResFall[key] = filePath
     })
     if (!process.env.webpack) process.env.webpack = {}
     process.env.webpack.config = config
   }
   if (configCallback) config = configCallback(config) || config
   console.log(config)
   if (!cb) return new Promise(res => {
     webpack(config).run((...arg) => { callback(...arg); res(...arg) })
   })
   return webpack(config).run(callback)
}
exports.babel = function (src,path) {
  return require('../src/components/helpers/babel-compiler')(src,path)
}