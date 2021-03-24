var path = require('path');
var fs = require('fs')
const { contract, asyncForEach } = require('../src/components/helpers/utilsCompiled');
const { sequence,mixin } = require('react-komponent/src/components/helpers/utilsCompiled');
const socketClient = path.resolve('../')+'/node_modules/socket.io-client/dist/socket.io.min.js'
const DOM = require('../src/components/helpers/DOM')

function ReactServerHTMLPlugin(options={}) {
   let self = this
	this.options = Object.assign({
        appRoot: "./dist",
        template: "./index.html",
        dataPath: "./json/data.json",
        url: "http://localhost",
        port: "3006",
        append: '',
        prepend: '',
        htmlPrerender: (html) => html,
        htmlModify: (html) => html,
        socketio: false,
        // windowPrerender: (wind) => wind,
        // webpackConfig
        // domPrerender: (dom) => dom,
        // domModify: (dom) => dom
        // modules: {}
    },options);
    // this.options.modules = this.options.modules || {}
}

ReactServerHTMLPlugin.prototype.apply = function(compiler) {

    const self = this;

    let { appRoot, modules, template, append, prepend, htmlPrerender, host, protocol,port  } = self.options
    if (self.options.server && self.options.server.address) {
       address = server.address().address
       port = server.address().port
    }
    let fullURL = `${protocol}://${host}:${port}/`
    console.log('url:',fullURL)
    self.options.url = fullURL
    
    compiler.hooks.emit.tapAsync('ReactServerHTMLPlugin', function(compilation, callback) {
	 // compiler.plugin("emit", function(compilation, callback) {
      const templ = compilation.assets[path.basename(template)]
      if (!templ) return callback()
    		
      let html = templ.source();
      // dataPath = path.resolve(appRoot,dataPath);
      // let rawdata = fs.readFileSync(dataPath);
      // let json = JSON.parse(rawdata);

      // var script = `<script>window.__PRELOADED_STATE__ = ${JSON.stringify(json).replace(/</g, '\\u003c')}</script>`
      // Add additional assets from configuration options

      const virtualConsole = new jsdom.VirtualConsole();
      virtualConsole.on("error", (err) => { console.error("ERror",err) });
      virtualConsole.sendTo(console);

      let jsdOptions = {
         url: fullURL,
         runScripts: "dangerously",
         resources: "usable"
      }

      let ssrHooks = (modules && modules.SSR) ? modules.SSR.hooks : {}
      
      let callbacks = Object.keys(ssrHooks).reduce((obj,key) => {
         obj[key] = ssrHooks[key].callbacks
         let mix = mixin(obj,{ fresh: () => ssrHooks[key].callbacks })
         return Object.setPrototypeOf(obj,mix)
      },{})
      const getCallbacks = (name) => callbacks[name].temp.concat(callbacks[name].perm)

      let windowCallbacks = getCallbacks('window')
      // let windowAlters = ssrHooks && ssrHooks.windowAlter && ssrHooks.windowAlter.callbacks
      let getRenderCallbacks = () => getCallbacks('render')
      let renderCallbacks = getRenderCallbacks()
      let componentDidMountCallbacks = getCallbacks('componentDidMount')
      let constructorCallbacks = getCallbacks('constructor')
      

      if (windowCallbacks.length) {
         jsdOptions.beforeParse = (win) => {
            let prerens = windowCallbacks.map(wp => {
               return () => { return wp(win) } 
            })
            return sequence(...prerens)
         }
      }

      let assets = compilation.assets
      
      Object.keys(assets).forEach(key => {
         if (path.extname(key) === '.js' || path.extname(key) === '.css') {
            let data = assets[key].source()
            const filePath = appRoot+'/'+key
            const dirname = path.dirname(filePath)
            fs.mkdirSync(dirname, { recursive: true })
            fs.writeFileSync(appRoot+'/'+key, data)
            delete compilation.assets[key]
         }
      })

      let dom; let doc; let modifiedHTML = html
      
      function HTMLPrerender() {
         html = htmlPrerender(html)
         ssrHooks.constructor((vdom) => {
            vdom.setHtml(
               vdom.html().replace(/<script src="\//gi,`<script src="${fullURL}`)
               .replace(/link href="\//gi, `link href="${fullURL}`)
               .replace(/(<link[^>]+rel=[^>]+href=\"\/)/gi,`$1${fullURL}`)
               .replace('<head>',`<head>${prepend}`)
               .replace('</head>',`${append}</head>`)
            )
         })
         // make initial dom
         return sequence(
            () => {
               if (constructorCallbacks && constructorCallbacks.length) {
                  return addHooks('constructor',new DOM(html))
               }
            },
            (jsd) => { if (jsd) html = jsd.html(); return html },
            (res) => makeDom(res),
            (res) => {
               modifiedHTML = res.html()
               doc.addEventListener('DOMContentLoaded',listener, false)
               return modifiedHTML
            }
         )
      }

      // if we have prerenderCallbacks then just start from scratch and redefine dom and doc.
      function makeDom(HTML=modifiedHTML) {

         if (!(renderCallbacks && renderCallbacks.length))
            return complete()

         let newDom = new DOM(HTML)
         return contract(addHooks('render',newDom),(res) => { 
            HTML = res.html()
            return complete() 
         })

         function complete() {
            dom = new DOM(HTML,jsdOptions)
            doc = dom.window.document
            return dom
         }
      }
      /*
      beforeParse(window) {
         window.document.childNodes.length === 0;
         window.someCoolAPI = () => { };
      }
      */
      /*
      return contract(preRen(newDom.window,HTML),(result) => {
      HTML = (typeof result === 'string') ? result : getHtml(newDom)
      if (ind === renderCallbacks.length-1)
         return complete()
      })
      */

      function addHooks(type,jsd) {
         console.log('type',type)
         let hooks = getCallbacks(type)
         if (!hooks || hooks.length === 0)
            return jsd
         const loopMods = () => {
            let HTML = jsd.html(); let modHTML = HTML
            return contract(asyncForEach((hooks,(hook,ind) => {
               return contract(
                  hook(jsd.window,modHTML),
                  (hooked) => {
                     if (typeof hooked === 'string')
                        modHTML = hooked
                     else if (hooked.constructor && hooked instanceof JSDOM) jsd = hooked
                     if (ind === hooks.length-1 && modHTML !== HTML)
                        jsd.html(modHTML)
                     return hooked
                  }
               )
            })),() => jsd)
         }
         if (type === 'componentDidMount') {
            jsd.addEventListener('DOMContentLoaded',() => {
               return loopMods()
            },false)
            return jsd       
         } else return loopMods()   
      }

      function listener(ev) {
         let before = renderCallbacks || []
         let after = getRenderCallbacks() || []
         if (before.length < after.length) {
            renderCallbacks = preRens
            return contract(makeDom(modifiedHTML),(res) => {
               dom.setHtml(res)
            })
         }
         // if prerenderCallbacks are there, it means they were added post-render, so we need to start over
         return contract(addHooks('componentDidMount',dom),finishUp)
      }

      function finishUp(jdom=dom) {
         let htmlJsd = new DOM(html)

         htmlJsd.query('#root').innerHTML = jdom.query('#root').innerHTML
      
         return contract(
            addHooks('componentDidMount',htmlJsd),
            (ret) => { 
               html = ret.html()
               compilation.assets[path.basename(template)] = {
                  source: function () {
                     return html;
                  },
                  size: function () {
                     return html.length;
                  }
               }
            }
         )
      }
      
      sequence(
         HTMLPrerender,
         makeDom,
         finishUp,
         callback
      )
      return

	});
}

module.exports = ReactServerHTMLPlugin;