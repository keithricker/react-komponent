const fetchData = require('./fetchData.js')
const { isJSON, merge, isURL, Earl, isClass } = require('react-komponent/utils')
const ssrHooks = require('./ssrHooks')

const makeFunction = (func,props,pro) => { 
   if (pro) {
      if (isClass(func)) merge(func.prototype,pro)
      else func.prototype = pro 
   }
   return props ? merge(func,props) : func 
}

function reactServer(custom = {}) {
   const path = require('path')
   const theDirectory = __dirname
   const modulePath = path.resolve(theDirectory,'../')
   const appRoot = process.cwd()
   const fs = require('fs')
   custom.webpack = custom.webpack || {}
   let config = custom.webpack.config

   if (!config) {
     config = custom.webpack.overrides || {}
     custom.webpack.overrides = custom.webpack.overrides || config
   }
   config.optimization = config.optimization || {}; config.optimization.minimize = config.optimization.minimize || false
   config.ignore = [path.resolve(__dirname),...config.ignores || []]

   let port,protocol
   if (custom.url) {
      let split = custom.url.split(':')
      if (split.length > 1) port = split[split.length -1]
      split = custom.url.split('https')
      if (split.length > 1) protocol = 'https:'
      else if (custom.url.split('http').length > 1) protocol = 'http:'
   }
   port = port || custom.port || process.env.Port || process.env.PORT || 3000
   const express = require('express');
   const app = express()
   if (!protocol) protocol = (port === 443 || (custom.https && custom.https.key && custom.https.cert)) ? 'https' : 'http'
   const options = (protocol === 'http:') ? [app] : [custom.https,app]
   const server = require(protocol.slice(0,protocol.length-1)).Server(...options)
   const appEnv = app.get('env')
   const indexFile = custom.indexFile || path.resolve(appRoot,'./build/index.html')
   const htmlTemplate = custom.htmlTemplate || path.resolve(process.cwd(),'public/index.html')
   const getHost = (url) => url.split('://')[1].split(':')[0]
   let host = custom.url ? getHost(custom.url) : 'localhost'
   let listeningApp
   function serverUrl() {
      if (listeningApp) {
         let addy = listeningApp.address().address
         if (addy !== '::') host = addy
         port = listeningApp.address().port
      }
      return custom.url || `${protocol}//${host}:${port}`
   }
   let theEarl = Earl('http://www.website.com')
   Object.keys(theEarl).forEach(key => {
     Object.defineProperty(serverUrl,key,{ get() {
       return Earl(serverUrl())[key]
     }})
   })

   let distPath = custom.dist ? custom.dist[custom.dist.length-1] === '/' ? custom.dist.slice(0,-1) : custom.dist : 'dist'
   distPath = path.resolve(process.cwd(),distPath)
   let customData = custom.data; let parsedData = isJSON(customData) ? customData : undefined

   if (!custom.data) {
      let defaultPath = path.resolve(appRoot,distPath)+'/preloaded/data.json'
      if (fs.existsSync(defaultPath)) {
         customData = defaultPath
         parsedData = JSON.parse(fs.readFileSync(defaultPath,{encoding:'utf8'}))
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
      }
   }
   if (!customData) {
      delete modules.preloadedData
      delete modules.freshData
   }

   if (!custom.webpack.SSR) custom.webpack.SSR = { 
      enabled:true,
      distPath,
      get publicPath() { return custom.publicPath ? path.resolve(process.cwd(),custom.publicPath) : require('../src/_webpack/node_modules/react-scripts/config/paths').appPublic },
      indexFile,
      hooks: ssrHooks,
      webpack: { config },
      serverURL: serverUrl,
      get url() { return serverUrl() },
      get protocol() { return serverUrl.protocol }, 
      get host() { return serverUrl.host }, 
      get port() { return serverUrl.port },
      get server() { return listeningApp },
      modules,
      prepend: `<script>window.serverURL = '${serverUrl()}'</script>;`,
      windowPrerender: (wind) => {
         wind.reactServer = modules
      }
   }
   const htmlPluginOptions = modules.SSR = custom.webpack.SSR

   htmlPluginOptions.htmlTemplate = htmlTemplate
   config.module = config.module || {}
   if (parsedData) htmlPluginOptions.data = parsedData

   let requireThis = require
   const reactKomponent = require('../src/_webpack/global/reactKomponent')

   reactKomponent.add({require: requireThis, webpack: { config },process, Buffer, paths:require("../src/_webpack").paths, jsdom:require('jsdom') })
   reactKomponent.modules.node.add({
      require: requireThis,
      requireFromUrl: require('require-from-url/sync'),
      requireFromString: require('require-from-string'),
      webpack: { config },
      require: requireThis,
      get serverUrl() { return serverUrl() }
   })
   reactKomponent.modules.add('server',modules.SSR)  

   modules.SSR.hooks.window((wind) => { 
     wind.reactSSR = modules.SSR 
     wind.reactKomponent = reactKomponent
   },true)
   global.SSR = modules.SSR
   global.reactKomponent = reactKomponent








   const dynamicScripts = new Map()
   const requires = new Map()
   const webpackCompiles = new Map()
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
         [express.static("./public")],
         [require("body-parser").urlencoded({ extended: false })],
         [require("body-parser").json()]
      ],
      get: [
         ['/',(req,res) => {
           res.sendFile(indexFile)
         }],
         ['/requireFile',(req,res) => {
            let reqHost = req.get('host')
            let serverHost = require('react-komponent/utils').Earl(serverUrl()).host
            if (reqHost !== serverHost) return
            let path = decodeURIComponent(req.query.path)
            res.sendFile(path)
         }],
         ['/serveFile',(req,res) => {
            let reqHost = req.get('host')
            let serverHost = require('react-komponent/utils').Earl(serverUrl()).host
            if (reqHost !== serverHost) return
            let path = decodeURIComponent(req.query.path)
            res.sendFile(path)
         }],
         ['/require',(req,res,next) => {
            let reqHost = req.get('host')
            let serverHost = require('react-komponent/utils').Earl(serverUrl()).host
            if (reqHost !== serverHost) return
            let toStr = JSON.stringify(req.query)
            if (requires.has(toStr)) return requires.get(toStr)

            let thePath = decodeURIComponent(req.query.path)
            let format = req.query.format || 'file'
            let base = req.query.base ? decodeURIComponent(req.query.base) : undefined
            let compile = req.query.compile || true

            let resolved = resolveIt()
            if (!resolved) return next('Could not resolve module using: '+thePath)
            if (format === 'file') return res.sendFile(resolved)
            res.setHeader('content-type', 'text/plain')
            let returnObj = { path:resolved,parsed:path.parse(resolved) }

            if (format !== 'resolve') {
              let code = fs.readFileSync(resolved, 'utf8') 
              if (compile) {
                const transform = require('./compiler.js').babel
                code = transform(code,'string')
              }
              returnObj = {code,path:resolved,parsed:path.parse(resolved)}
            }
            res.send(JSON.stringify(returnObj))

            function resolveIt() {
              if ((thePath.indexOf('.') !== 0 && thePath.indexOf('/') !== 0 && !path.basename(thePath).includes('.'))
              || (thePath.indexOf(process.cwd() === 0)))
                try { return require.resolve(thePath) } catch {}
              else if (base && thePath.indexOf(base) === 0)
                try { return require.resolve(path.resolve(path.resolve(base),thePath)) } catch {
                  try { return require.resolve(path.resolve(require.resolve(base),thePath)) } catch {}
                }

              if (!base) 
                return resolver(process.cwd())
              return resolver(base)

              function resolver(theBase) {
                try { if (require.resolve(thePath) || thePath.indexOf(theBase) === 0) return require.resolve(thePath) } catch {}
                if (thePath.indexOf('/') === 1) resolved = path.resolve(theBase,'.'+thePath)
                else if (!thePath.indexOf('.') === 1) resolved = path.resolve(theBase,'./'+thePath)
                try { if (require.resolve(resolved)) return require.resolve(resolved) } catch {}
                try { if (require.resolve(path.resolve(thePath))) return require.resolve(path.resolve(thePath)) } catch {}
                return thePath
              }
            }

         }],

         ['/browserify',(req,res) => {
            
            return require('./utility').browserify.express(req,res)

         }],






          ['/resolver',(reqr,res,next) => {

            /*
            let theScript = `console.log('in the script'); var dynamicScriptResult = window.dynamicScriptResult = 'what up?'`

            res.setHeader('content-type','text/javascript; charset=UTF-8');
            res.setHeader('access-control-allow-origin', '*')
            res.setHeader('Feature-Policy', 'sync-request *')
            res.attachment("filename.js")
            return res.send(theScript); 
            */
           res.sendFile(require('path').resolve(process.cwd(),'public/finkerPinker-dynamicImport.js'))







            /*
            let appRoot = require("../src/_webpack").paths.appPath
            let pth = require("path")
            let req = require
            let theBase = reqr.query.base, path = reqr.query.path, type = req.query.type || 'require'

            if (theBase) theBase = decodeURIComponent(theBase)
            if (path) path = decodeURIComponent(path)

            let originalBase= theBase, newBass, resolved
            if (pth.basename(theBase).includes('.')) theBase = pth.dirname(theBase)
            theBase = pth.resolve(theBase)
            if (theBase.indexOf("/") === 0 && theBase.indexOf(appRoot) !== 0)
              theBase = theBase.replace('/',appRoot)

            result = {code:result,newBase:newBass,resolved:theResolve(path,base)}
            if (type === 'require') result.code = theRequire()
            res.setHeader('content-type', 'text/plain')
            return res.send(JSON.stringify(result))

            function theResolve(path,base) {
              console.log("received", path);
              console.log("referrerer", theRequire.referrer);
              console.log("the base", base);
              let alternate = base

              if (
                path.indexOf("/") === 0 &&
                String(path)[1] !== "/" &&
                path.indexOf(appRoot) !== 0 && 
                (!originalBase || path.indexOf(originalBase) !== 0)
              )
                try { 
                  path = path.replace("/", appRoot);
                  req.resolve(path);                    
                } 
                catch { path = '.'+path }
              if (
                path.indexOf(appRoot) === 0 ||
                path.indexOf(alternate) === 0
              ) {
                newBass = pth.dirname(path);
                path = pth.basename(path);
                console.log({ newBass, path });
                Array(newBass, alternate).some((str) => {
                  try {
                    resolved = pth.resolve(str, path);
                    req.resolve(resolved);
                  } catch (err) {
                    console.error(err);
                  }
                });
                console.log("resolved!", resolved);
              }
              if (
                (!resolved &&
                path.indexOf(".") !== 0 &&
                path.indexOf("/") !== 0 &&
                !pth.basename(path).includes("."))
                || thePath.indexOf(process.cwd() === 0)
              ) {
                console.log("about to try", path);
                try {
                  console.log("trying", path);
                  if (req.resolve(path)) {
                    resolved = req.resolve(path);
                    newBass = pth.dirname(resolved);
                    path = pth.basename(resolved);
                  }
                } catch {}
              } else if (base && thePath.indexOf(base) === 0)
                try { resolved = require.resolve(path.resolve(path.resolve(base),thePath)) } catch {
                  try { resolved = require.resolve(path.resolve(require.resolve(base),thePath)) } catch {}
                }
              if (!resolved && path.indexOf("/") === 0 && !path.indexOf(appRoot) === 0)
                path = "." + path;
              if (!resolved) {
                let bass = newBass || base;
                resolved = pth.resolve(bass, path);
              } else resolved = resolved || path;
          
              if (
                resolved.indexOf(process.cwd()) === 0 &&
                !resolved.indexOf(appRoot) === 0
              ) {
                resolved = resolved.replace(process.cwd(), appRoot);
              }
              if (resolved) console.log("resolved", resolved);
              return resolved
            }

            function theRequire() {

              let code = require("fs").readFileSync(resolved, { encoding: "utf-8" });
          
              let imgFormat = Array(".jpg", ".jpeg", ".gif", ".png").find((formt) => {
                return formt === pth.parse(path).ext;
              });
          
              if (imgFormat) {
                if (imgFormat === ".jpg") imgFormat = ".jpeg";
                imgFormat = imgFormat.slice(1, imgFormat.length);
                return (
                  `data:image/${imgFormat};base64, ` +
                  new Buffer(require("fs").readFileSync(resolved)).toString("base64")
                );
              }
          
              if (Array(".scss",".sass").includes(pth.parse(path).ext)) {
                var sass = require("node-sass");
                code = sass.renderSync({
                  data: code
                });
              }
              
              if (Array(".css", ".scss", ".sass").includes(pth.parse(path).ext)) {   
                return `var style = document.createElement("style");
                style.innerHTML = ${code}
                document.head.appendChild(style)
                return`
              }
          
              if (
                Array(".js", ".mjs", ".jsx", ".ts", ".tsx").includes(pth.parse(path).ext)
              ) {
                let importExp = /(?: i|\ni|\ri|^i)mport\s+?(?:(?:(?:[\w*\s{},]*)\s+from\s+?)|)(?:(?:".*?")|(?:'.*?'))[\s]*?(?:;|$|)/
                let exportExp = /(?: e|\ne|\re|^e)xport\s+?[^=].*?$/
                let exportsExp = /(?:=e|.e| e|\ne|\re|^e)xports(?:\s|\.|\n|\=).*?/

                if (!importExp.test(code) && !exportExp.test(code)) {

                  let babelConfig = {
                    simple: { plugins: 'transform-modules-commonjs'},
                    advanced: { presets: ["react","env"],plugins:["transform-runtime", "transform-async-to-generator"]},
                  }

                  let profile = exportsExp.test(code) ? babelConfig.simple : babelConfig.advanced

                  const babel = require("@babel/core")
                  const transform = babel.transform
                  code = transform(code, profile).code

                }

              }
              return code
            
            }
            */
         }],






         ['/dynamicScript',(req, res) => {
           let reqHost = req.get('host')
           let serverHost = serverUrl.host
           if (reqHost !== serverHost || !req.query.url) return
           Array('output','url').filter(key => req.query[key]).forEach(key => req.query[key] = decodeURIComponent(req.query[key]))
           let {id,format,cache,url,output} = req.query
           let reqString = ''
           cache = !!(cache !== false && cache !== 'false')
           Array(url,id,output).filter(Boolean).forEach(par => reqString+=par)
           if (cache && dynamicScripts.has(reqString)) {
              let result = dynamicScripts.get(reqString)
              if (Array('path','string','text').includes(format)) {
                res.setHeader('content-type', 'text/plain')
                res.send(result)
              }
              else res.sendFile(result.path)
              return
           }
           function fetchIt() {
            return new Promise(reslv => {
               require('./webpackCompile.js')(url,output,id,(result) => {
                  reslv(result)
               })
            })
           }
           return fetchIt().then(result => {

             let sendText = (txt) => { 
               if (cache) dynamicScripts.set(reqString,txt)
               res.setHeader('content-type', 'text/plain'); res.send(txt) 
             }
             if (Array('path','string','text','url','json').includes(format)) {
              if (format === 'url') 
                return sendText(result.url)
              if (format === 'json')
                return sendText(JSON.stringify(result))
              return sendText(result.path)
             }
             if (cache) dynamicScripts.set(reqString,result)
             res.sendFile(result)
             return result.path
           })
         }],

         ['/compile/babel',(req, res) => {   
            let src = req.query.src, dest = req.query.path
            if (!dest) {
              let parsed = path.parse(src);
              dest = `${parsed.dir}/${parsed.name}-Module-babel-compiled.${parsed.ext}`;
            }
            dest = path.resolve(process.cwd(),dest)
            dest = require('./compiler.js').babel(src,dest)
            if (req.query.return === 'path') {
              res.setHeader('content-type', 'text/plain')
              res.send(dest)
            }           
            else res.sendFile(dest)
          }],
      ],

 


      post: [
         ['/compile/webpack',(req, res, next) => {

           let reqHost = req.get('host')
           let serverHost = serverUrl.host
           
           if (reqHost !== serverHost)
             next(new Error('no cross origin'))

           if (!req.body.config && !req.body.input)
             next(new Error('webpack: cannot complete request without an entry point or a configuration file'))

           let { config, input, output, id,  cache, format } = req.body
           let args = config ? [config] : [input,output,id]

           cache = !!(cache === true || cache === 'true')

           if (cache) {
             let cacheString = JSON.stringify(custom)
             if (cacheString && dynamicScripts.has(cacheString)) {
               let result = dynamicScripts.get(cacheString)
               if (Array('path','string','text','json').includes(format)) {
                 res.setHeader('content-type', 'text/plain')
                 return res.send(result)
               }
               else {
                 if (typeof result === 'object') result = result.path
                 res.sendFile(result)
               }
               return
            }
          }
          
          function fetchIt() {
            return new Promise(reslv => {
              args.push((result) => {
                reslv(result)
              })
              return require('./webpackCompile.js')(...args)
            })
          }

          return fetchIt().then(result => {
            let sendText = (txt) => { 
              if (cache) dynamicScripts.set(reqString,txt)
              res.setHeader('content-type', 'text/plain'); res.send(txt) 
            }
            if (Array('path','string','text','url','json').includes(format)) {
              if (result[format]) return sendText(result[format])
              return sendText(result.path)
            }
        
            if (cache) dynamicScripts.set(reqString,result)
            res.sendFile(typeof result === 'object' ? result.path : result)
            return result
          })
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
               fs.copyFileSync(`${modulePath}/node_modules/socket.io-client/dist/socket.io.min.js`, require('path').resolve(process.cwd(),'dist/socket.io.min.js'))
               // commandLine(`mkdir -p ${indexPath}/react-komponent && cp ${modulePath}/node_modules/socket.io-client/dist/socket.io.min.js ${indexPath}/react-komponent/socket.io.min.js`)
               socket.on('connection', (sock) => {
                  sock.on('reducer', (reduced) => {
                     console.log('----------received via socket:----------',reduced)
                  });
               });
               return socket 
            }
         }
         if (prop === 'listeningApp') return listeningApp
         if (prop === 'url') {
           return serverUrl()
         }
         let yearl = Earl(serverUrl())
         if (yearl.hasOwnProperty(prop)) return yearl[prop]
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

            function compileDir(dirPath) {

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
                const babelCompile = require('./compiler.js').babel
                babelCompile(src,dest)
              })
            }
            
            const realProp = prop
            if (prop === 'start') prop = 'listen'
            calls.push(prop)

            compileDir(path.resolve(__dirname,'../src/components'))

            // if first argument isn't a port number then add the port number
            if (isNaN(arg[0])) arg.unshift(defaults.listen[0][0])
          
            let listenCb = arg.find(ar => typeof ar === 'function')

            function listenCallback(err) {

              
               return new Promise(res => {
                  const build = require('./compiler').webpack(custom.webpack,(err, stats) => {
                    if (err) {
                      res(err)
                      if (listenCb) return listenCb(err)
                      throw new Error(err)
                    }
                    res(undefined,stats)
                    if (listenCb) return listenCb()
                  }) 
               })
            }
            if (arguments.length) delete defaults.listen
            let hascb
            arg = arg.map(ar => { if (typeof ar === 'function') { hascb = true; return listenCallback } else return ar })
            if (!hascb) arg[1] === listenCallback 

            Object.keys(defaults).forEach(key => {
               if (!calls.includes(key)) {
                  defaults[key].forEach(props => {
                     if (key === 'listen')
                        listeningApp = server.listen(...props)
                     else ob[key](...props)
                  })
               }
            })

            if (!defaults.listen) {
              listeningApp = server.listen(...arg)
              if (realProp !== 'start' && arguments.length)
                return listeningApp
            }





            listenCallback().then(thing => {

   
    
              let newrequire = require('./utility').require(require.resolve('jsdom'),null,'node')

              console.log('required',newrequire)

              throw new Error()








            })











            return listeningApp

         }
      }
   })
   process.env.serverUrl = serverUrl()
   return appServer
}
reactServer.hooks = ssrHooks

module.exports = { get reactServer() { return reactServer } }
