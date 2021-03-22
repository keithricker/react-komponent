const path = require('path')
const fs = require('fs')
const { webpack } = require('./compiler.js')
const fetchData = require('./fetchData.js')
const theDirectory = __dirname
const appRoot = process.cwd()
const modulePath = path.resolve(theDirectory,'../')
const express = require('express');
const { commandLine,isJSON } = require(modulePath+'/src/components/helpers/utilsCompiled.js')
const { merge, isClass } = require('../src/components/helpers/utilsCompiled')

const makeFunction = (func,props,pro) => { 
   if (pro) {
      if (isClass(func)) merge(func.prototype,pro)
      else func.prototype = pro 
   }
   return props ? merge(func,props) : func 
}

function reactServer(custom = {}) {
   
   let config = custom.webpack && custom.webpack.config ? custom.webpack.config : require(process.cwd()+'/node_modules/react-scripts/config/webpack.config')('production')
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
   let customData = custom.data; let parsedData = isJSON(customData) ? customData : undefined
   
   if (!custom.data) {
      let defaultPath = path.resolve(appRoot,distPath)+'/preloaded/data.json'
      if (fs.existsSync(defaultPath)) {
         customData = defaultPath
         parsedData = JSON.parse(fs.readFileSync(defaultPath))
      }
   }

   function getTheData(cb) {
      if (isJSON(customData)) return cb ? cb(customData) : customData
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

   custom.webpack = custom.webpack || {}
   const htmlPluginOptions = custom.webpack.SSR = custom.webpack.SSR || { 
      enabled:true,
      server, protocol, host, port, modules,
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
               fs.copyFileSync(`${modulePath}/node_modules/socket.io-client/dist/socket.io.min.js`, 'dist/socket.io.min.js')
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

            const Mod = require('../src/components/helpers/Module')
            let dir = '../src'
            let entry = path.resolve(__dirname,dir,'./components/helpers/theObj/src/index.js')
            


            Mod.dynamicImport(entry,'objectify',(res) => { 
               console.log('res',res); 
               throw new Error 
            })
            
            function compileDir(dir) {
              let dirPath = path.resolve(__dirname,dir)
              let files = fs.readdirSync(''+dirPath)
              files.forEach(function (file, ind) {
                let filePath = path.resolve(dirPath,file)
                let stat = fs.statSync(filePath)
                if (stat && stat.isDirectory()) {
                   compileDir(filePath)
                   return
                }
                let parsed = path.parse(file)
                if (parsed.ext !== '.js' && parsed.ext !== '.jsx') return
                let pSplit = parsed.name.split('Compiled')
                if (pSplit.length === 2 && pSplit[1] === "") return
                const src = filePath
                const dest = path.resolve(dirPath,parsed.name+'Compiled'+parsed.ext)
                Mod.compile.babel(src,dest)
              })
            }
            
            const realProp = prop
            if (prop === 'start') prop = 'listen'
            calls.push(prop)
            compileDir(dir)
            let cb = () => {}; 




            // if first argument isn't a port number then add the port number
            if (isNaN(arg[0])) arg.unshift(defaults.listen[0][0])
            arg.forEach((ar,ind) => { 
               if (typeof ar === 'function') { 
                  cb = ar; arg[ind] = listenCallback 
            }})

            console.log('listening ....')


            function listenCallback(err) {
               cb(err)
               // commandLine(`rm -r ./dist/*`)
               config.module = config.module || {}
               if (parsedData) HtmlPluginOptions.data = parsedData
               /* const build = webpack(config,(err, stats) => {
                  if (err) {
                     console.error(err)
                  }
               }) */
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