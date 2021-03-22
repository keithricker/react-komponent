let _global
try { _global = global } catch { global = window }

const DOM = module.exports = function DOM(...arg) {
    // require('jsdom-global')()
    const jsdom = require("jsdom")
    const { JSDOM } = jsdom
    class DOM extends JSDOM {
       constructor(...arg) {
          if (!arg[1]) arg[1] = { runScripts: "dangerously" }
          if (!arg[0]) arg[0] = `<!doctype html>
          <html lang="en">
          <head>
            <meta charset="utf-8">
            <title></title>
          </head>
          <body>
          </body>
          </html>`
          super(...arg)
          let self = this
          let env = (_global.document && _global.document.constructor.name === 'HTMLDocument') ? 'web' : 'node'
          let _window = (arguments.length || env === 'node') ? self.window : window
          let _document = _window.document
         
          const docHandler = {
            get(ob,prop,prox) {
               if (prop === '{{target}}') return ob
               let match = (/^{{(.*)}}$/.exec(prop))
               if (match && match[1]) {
                  prop = match[1]
                  ob = self
               }
               if (prop === 'window') return new Proxy(_window,{
                  get(obj,key) { 
                     if (key === 'document') return prox
                     if (key in obj) return obj[key]
                     if (key in self) return prox[key] 
                  }
               })
               if (ob.hasOwnProperty(prop))
                  return ob[prop]
               if (prop in DOM.prototype)
                  return typeof self[prop] === 'function' ? self[prop].bind(self) : self[prop]
               if (prop in self) return self[prop]
               let elem = ob.getElementsByTagName(prop) 
               if (elem && elem.length === 1) elem = elem[0]
               if (typeof elem !== 'undefined') return elem
            }
         }
         let docProx = new Proxy(_document,docHandler)
         return docProx
       }
       elements(key,val) {
          if (key === 'class') return this.getElementsByClassName(key)
          else if (key === 'tag') return this.getElementsByTagName(key)
          let query = (cb) => [...document.querySelectorAll("*")].filter(item => cb(item))
          if (arguments.length === 1 && typeof key === 'object') {
             return query((item) => Object.keys(item).every(key => item.getAttribute(key) === val))
          }
          return query((item) => item.getAttribute(key) === val)
       }
       create(type,attributes,appendTo) {
         let newEl, text=type

            /*
            let match = /^<([^ ]*?) .*?(?:>?)(.*)(?:<\/(?:[^ ].*)>|\/>)/gi.exec(text)
            */

         if (text.trim().split(" ").length > 1 && text.includes('<')) {
            if (typeof attributes === 'object') {
               appendTo = attributes
               attributes = undefined
            }
            try {
               let tempEl = document.createElement('div');
               let tempId = 'reactKomponentDOMTemporaryElement'
               tempEl.setAttribute("id", tempId);
               tempEl.innerHTML = text
               newEl = tempEl.childNodes[0]
               tempEl.remove()
            }
            catch(err) { throw err }
         }
         /*
         let pattern1 = `^<${type}.*?(?:>|.*?\/>)(.*?)(?:<?)\/(?:${type}?)`
         let pattern2 = `([^ ]*)=(?:["|'])([^ ]*?)["|']`
         */
         
         newEl = newEl || this.window.document.createElement(type)
         if (attributes)
            Object.keys(attributes).forEach(key => newEl.setAttribute(key,attributes[key])) 
         if (appendTo) appendTo.appendChild(newEl)
         
         Object.setPrototypeOf(newEl,Object.setPrototypeOf({ set(...arg) { this.setAttribute(...arg); return this } },Object.getPrototypeOf(newEl)))
         return newEl  
       }
       tags(name) { return this.getElementsByTagName(name) }
       tag(name) {
         return this.tags(name)[0]
       }
       html(html) { 
           if (!html) {
             let prop = (_global.document && this === _global.document) ? 'outerHTML' : 'innerHTML'  
             this.getElementsByTagName('html')[prop] = html
             return this.tag('html').outerHTML
           }
           let newJdom = html instanceof DOM ? html : new DOM(html); 
           let newHTML = this.tag('html').innerHTML = newJdom(html).tag('html').innerHTML; 
           return newHTML
       }
       query(search) { return this.querySelector(search) }
       queryAll(search) { return this.querySelectorAll(search) }
       static [Symbol.hasInstance](instance) {
          return instance['{{constructor}}'].prototype instanceof this
       } 
    }
    return new DOM(...arg)
}
DOM.default = DOM