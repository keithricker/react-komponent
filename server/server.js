const path = require('path')
const fs = require('fs')
const fetchData = require('./fetchData.js')
const theDirectory = __dirname
const appRoot = process.cwd()
const modulePath = path.resolve(theDirectory,'../')
const express = require('express');
const nodeEnv = process.env.NODE_ENV
Object.defineProperty(process.env,'NODE_ENV',{value:'development',writable:true})
const { commandLine,is } = require(modulePath+'/src/components/helpers/utilsCompiled.js')
const webpack = require(process.cwd()+'/node_modules/webpack')
const ReactServerHTMLPlugin = require(modulePath+'/config/react-server-html')
const MiniCssExtractPlugin = require(process.cwd()+'/node_modules/mini-css-extract-plugin')
const { merge, isClass } = require('../src/components/helpers/utilsCompiled')

const makeFunction = (func,props,pro) => { 
   if (pro) {
      if (isClass(func)) merge(func.prototype,pro)
      else func.prototype = pro 
   }
   return props ? merge(func,props) : func 
}

function reactServer(custom = {}) {
   
   custom.webpack = custom.webpack
   custom.webpack.SSR = {}
   let config = custom.webpack.config || require(process.cwd()+'/node_modules/react-scripts/config/webpack.config')('production')
   let port = custom.port || process.env.Port || process.env.PORT || 3000
   const app = express()
   let protocol = (port === 443 || (custom.https && custom.https.key && custom.https.cert)) ? 'https' : 'http'
   const options = (protocol === 'http') ? [app] : [custom.https,app]
   const server = require(protocol).Server(...options)
   const appEnv = app.get('env')
   const indexFile = custom.indexFile || path.resolve(appRoot,'./build/index.html')
   let indexPath = path.dirname(indexFile)
   const getHost = (url) => url.split('://')[1].split(':')[0]
   let host = custom.url ? getHost(custom.url) : 'localhost'
   let serverUrl = () => custom.url || `${protocol}://${host}:${port}`

   let distPath = custom.dist ? custom.dist[custom.dist.length-1] === '/' ? custom.dist.slice(0,-1) : custom.dist : 'dist'
   let customData = custom.data; let parsedData = is.json(customData) ? customData : undefined
   
   if (!custom.data) {
      let defaultPath = path.resolve(appRoot,distPath)+'/preloaded/data.json'
      if (fs.existsSync(defaultPath)) {
         customData = defaultPath
         parsedData = JSON.parse(fs.readFileSync(defaultPath))
      }
   }

   function getTheData(cb) {
      if (is.json(customData)) return cb ? cb(customData) : customData
      let dataPromise = (async () => await fetchData(customData))()
      if (!cb) return dataPromise
      dataPromise
      .then(parsed => {
         parsedData = parsed
         if (cb) cb(parsedData)
      })
   }

   getTheData((data) => parsedData = data)

   const modules = custom.modules || {
      get url() { return serverUrl() },
      get preloadedData() {
         return parsedData
      },
      freshData(cb) {
         return getTheData(cb)
      },
      SSR: makeFunction(function SSR(prepost=pre,cb) {
         modules.SSR.callbacks.push({function:cb,prepost})
      },{
         hooks: (function() { 
            let hooks = {}; let callbacks = {}
            Array('constructor','componentDidMount','render','window').forEach(key => {
               callbacks[key] = { temp:[],perm:[] }
               hooks[key] = 
               makeFunction(function(hook,perm=false) {
                  callbacks[key][perm ? 'perm' : 'temp'].push(hook)
               },
               { get callbacks() { return { temp:[...callbacks[key].temp], perm:[...callbacks[key].perm] }}})
            })
            return hooks
         })()
      })
   }
   if (!customData) {
      delete modules.preloadedData
      delete modules.freshData
   }

   modules.SSR.hooks.window((wind) => { wind.reactSSR = modules.SSR })

   const htmlPluginOptions = custom.webpack.SSR = { 
      enabled:true,
      protocol, host, port, modules,
      prepend: `<script>window.serverURL = '${serverUrl()}'</script>;`,
      windowPrerender: (wind) => {
         wind.reactServer = modules
      }
   }
   if (custom.url) htmlPluginOptions.url = custom.url


   let socket

   let defaults = {
      listen: [
         [port, () => {
            console.log(`Server is listening on port ${port}`);
         }]
      ],
      use: [
         [express.static(distPath)],
         [express.static("./build")],
         [express.static("./public")]
      ],
      get: [
         ['/',(req,res) => {
            res.sendFile(indexFile)
         }]
      ],
      set: [
         ['env',appEnv || 'development']
      ]
   }

   let calls = []
   let appServer = new Proxy(app,{
      get: function(ob,prop) {
         ob = app
         if (prop === 'modules') { return ob.modules || modules }
         if (prop === 'socket') {
            return function() {
               socket = require('socket.io')(server)
               htmlPluginOptions.socket = true
               // copy the client version of socket to the web root
               commandLine(`cp ${modulePath}/node_modules/socket.io-client/dist/socket.io.min.js dist/socket.io.min.js`)
               // commandLine(`mkdir -p ${indexPath}/react-komponent && cp ${modulePath}/node_modules/socket.io-client/dist/socket.io.min.js ${indexPath}/react-komponent/socket.io.min.js`)
               socket.on('connection', (sock) => {
                  sock.on('reducer', (reduced) => {
                     console.log('----------received via socket:----------',reduced)
                  });
               });
               return socket 
            }
         }
         if (prop !== 'start' && typeof ob[prop] !== 'function') return ob[prop]
         if (prop !== 'start' && prop !== 'listen') {
            return function(...arg) {
               if (prop == 'get' || prop === 'set') {
                  let getSet = prop === 'get' ? 'get' : 'set'
                  if (defaults[getSet][0][0] !== arg[0])
                     return ob[getSet](...arg)
               }
               if (prop === 'use') {
                  defaults.use.push(arg)
                  return ob.use(...arg)
               }
               return ob[prop](...arg)
            }
         }

         return function(...arg) {
            const realProp = prop
            if (prop === 'start') prop = 'listen'
            calls.push(prop)
            commandLine(`cd ${modulePath} && npm run-script babel-compile`)
            let cb = () => {}; 
            // if first argument isn't a port number then add the port number
            if (isNaN(arg[0])) arg.unshift(defaults.listen[0][0])
            arg.forEach((ar,ind) => { 
               if (typeof ar === 'function') { 
                  cb = ar; arg[ind] = listenCallback 
            }})

            function listenCallback(err) {
               cb(err)
               // commandLine(`rm -r ./dist/*`)
               let address = server.address()
               port = address.port
               host = custom.url ? getHost(custom.url) : (address.address === '::') ? 'localhost' : address.address
               let overrides = custom.webpack.overrides || {}
               config.module = config.module || {}
               if (parsedData) HtmlPluginOptions.data = parsedData
               config.plugins.push(new ReactServerHTMLPlugin(htmlPluginOptions))
               config.plugins = config.plugins.concat(overrides.plugins || [])
               config.output.path = overrides.outputPath || custom.SSR && path.resolve(custom.webpack.SSR.appRoot) || path.resolve('./dist')
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
               const build = webpack(config).run((err, stats) => {
                  if (err) {
                     console.error(err)
                  }
                  Object.defineProperty(process.env,'NODE_ENV',{value: nodeEnv || 'development',writable:true})
               })
            }
            
            if (arg.length) 
               delete defaults.listen
            else defaults.listen[0][1] = listenCallback
               
            let listening
            Object.keys(defaults).forEach(key => {
               if (!calls.includes(key)) {
                  defaults[key].forEach(props => {
                     if (key === 'listen')
                        listening = server.listen(...props)
                     else ob[key](...props)
                  })
               }
            })
            if (prop === 'listen' && !defaults.listen) return server.listen(...arg)
            return listening
         }
      }
   })
   return appServer
}

module.exports = reactServer