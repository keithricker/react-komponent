var path = require('path');
var fs = require('fs')
const { contract, asyncForEach } = require('react-komponent/src/components/helpers/utilsCompiled');
const { sequence,simpleMixin } = require('react-komponent/src/components/helpers/utilsCompiled');
const theDOM = require('react-komponent/src/components/helpers/DOM')

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
  },options);
}

ReactServerHTMLPlugin.prototype.apply = function(compiler) {

  const self = this;

  let { appRoot, modules, template, append, prepend, htmlPrerender, host, protocol,port  } = self.options

  if (self.options.server && self.options.server.address) {
    host = self.options.server.address().address
    if (host === '::') host = 'localhost'
    port = self.options.server.address().port
  }
  let fullURL = `${protocol}//${host}:${port}/`
  console.log('url:',fullURL)
  self.options.url = fullURL
  
  compiler.hooks.emit.tapAsync('ReactServerHTMLPlugin', function(compilation, callback) {
    // compiler.plugin("emit", function(compilation, callback) {

    const templ = compilation.assets[path.basename(template)]

    if (!templ) return callback()
    let html = templ.source();
    html = html.replace(/%PUBLIC_URL%/g,'')

    // dataPath = path.resolve(appRoot,dataPath);
    // let rawdata = fs.readFileSync(dataPath);
    // let json = JSON.parse(rawdata);

    // var script = `<script>window.__PRELOADED_STATE__ = ${JSON.stringify(json).replace(/</g, '\\u003c')}</script>`
    // Add additional assets from configuration options

    const virtualConsole = new theDOM.VirtualConsole();
    virtualConsole.on("error", (err) => { console.error("ERror",err) });
    virtualConsole.sendTo(console);


    function DOM(...arg) {

      let withOptions = typeof arg[1] === 'boolean' ? arg[1] : undefined, dommer
      if (withOptions === false) arg.splice(1,1)

      if (typeof arg[0] !== 'string' || !withOptions)
      return theDOM(...arg)


      let jsdOptions = {
        url: fullURL,
        runScripts: "dangerously",
        resources: "usable"
      }

      let wcbs = cbs.window || []
      wcbs = wcbs.concat(
        (wind) => {
          wind.addEventListener('load', (event) => {
            
            let cdms = cbs.componentDidMount.concat(finishUp)
            return sequence(cdms.map(cb => { return () => cb(dommer) }))

          })
        }
      )

      jsdOptions.beforeParse = (win) => {
        let prerens = wcbs.map(wp => { return () => wp(win) })
        return sequence(...prerens)
      }

      dommer = theDOM(arg[0],jsdOptions)
      return dommer

    }


    let ssrHooks = (modules && modules.SSR) ? modules.SSR.hooks : {}

    const getCallbacks = (name) => {
      return ssrHooks[name].callbacks.temp.concat(ssrHooks[name].callbacks.perm)
    }

    const cbs = {
      refresh() { 
        Object.keys(this).forEach(key => { this[key] = getCallbacks[key] }) 
      },
      window: getCallbacks('window'),
      render: getCallbacks('render'),
      componentDidMount: getCallbacks('componentDidMount'),
      _constructor: getCallbacks('_constructor')
    }

    let newHooks = {}, end = false

    
    Object.keys(cbs).forEach(key => {
      if (!ssrHooks[key]) return
      ssrHooks[key].callbacks.push = function(...arg) {
        if (!newHooks[key]) newHooks[key] = []
        newHooks[key].push(...arg)
      }
    })

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

    let dom; let modifiedHTML = html
    
    function HTMLPrerender() {
      html = htmlPrerender(html)
      ssrHooks._constructor((vdom) => {
        vdom.html(
          vdom.html().replace(/<script src="\//gi,`<script src="${fullURL}`)
          .replace(/link href="\//gi, `link href="${fullURL}`)
          .replace(/(<link[^>]+rel=[^>]+href=\")/gi,`$1${fullURL}`)
          .replace('<head>',`<head>${prepend}`)
          .replace('</head>',`${append}</head>`)
        )
        return vdom
      })
      // make initial dom
      return makeDom(html)
    }

    // if we have prerenderCallbacks then just start from scratch and redefine dom and doc.
    function makeDom(HTML=modifiedHTML) {
      if (!(cbs.render && cbs.render.length) && !(cbs._constructor && cbs._constructor.length))
        return DOM(HTML,true)

      let newDom = DOM(HTML,true)
      return sequence(
        () => addHooks('_constructor',newDom),
        (nd) => addHooks('render',nd)
      )
    }

    function addHooks(type,jsd) {
      let hooks = cbs[type].concat(newHooks[type] || [])
      if (!hooks || !hooks.length)
        hooks = cbs[type]
      if (!hooks || !hooks.length)
        return jsd

      return contract(asyncForEach(hooks,(hook,ind) => {
        return contract(
          hook(jsd),
          (hooked) => {
            if (hooked instanceof require('jsdom').JSDOM || hooked instanceof DOM) jsd = hooked
            return hooked
          }
        )
      }),() => jsd)
    }

    function finishUp(ev) {

      if (!end && Object.keys(newHooks).length) {
        end = true
        ev.html('')
        return makeDom(html)
      }

      let newHTML = ev.outerHTML

      let theRoot = ev.query('#root').innerHTML
      console.log('theRoot',theRoot)
    
      html = newHTML.replace('<body>;','<body>')
      console.log('thehtml',html)
      global.window = ev.window
      compilation.assets[path.basename(template)] = {
        source: function () {
          return html;
        },
        size: function () {
          return html.length;
        }
      }
      console.log('calling back')
      return callback()
    }
    return HTMLPrerender()
	});
}

module.exports = ReactServerHTMLPlugin;