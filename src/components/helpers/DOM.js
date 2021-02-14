export default function DOM(...arg) {
    const Global = suppress(() => window,global)
    require('jsdom-global')()
    const jsdom = require("jsdom");
    const { JSDOM } = jsdom
    class DOM extends JSDOM {
       constructor(...arg) {
          super(...arg)
          let self = this
          if (!arg.length) {
            const docHandler = {
               get(ob,prop,prox) {
                  if (prop === '{{target}}') return ob
                  let match = (/^{{(.*)}}$/.exec(prop))
                  if (match && match[1]) {
                     prop = match[1]
                     ob = self
                  }
                  if (prop === 'window') return new Proxy(window,{
                     get(ob,prop) { 
                        if (prop === 'document') return prox
                        return ob[prop] 
                     }
                  })
                  if (prop in self) {
                     if (this.hasOwnProperty(prop))
                        return self[prop]
                     return typeof self[prop] === 'function' ? self[prop].bind(ob) : self[prop]
                  }
                  return ob[prop]
               }
            }
            let docProx = new Proxy(window.document,docHandler)
            return docProx
          }
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
         
         newEl = newEl || self.window.document.createElement(type)
         if (attributes)
            Object.keys(attributes).forEach(key => newEl.setAttribute(key,attributes[key])) 
         if (appendTo) appendTo.appendChild(newEl)
         
         simpleMixin(newEl,{ set(...arg) { this.setAttribute(...arg); return this } })
         return newEl  
       }
       tags(name) { return this.getElementsByTagName(name) }
       tag(name) {
         return self.tags(name)[0]
       }
       html(html) { 
           if (!html) {
             let prop = (this === window.document) ? 'outerHTML' : 'innerHTML'  
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