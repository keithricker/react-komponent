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

let pv = new WeakMap();

let canUseJsdom;
try {
  canUseJsdom = require('jsdom')
  // canUseJsdom = require("jsdom");
} catch {
  canUseJsdom = false;
}

const jsdom = canUseJsdom
  ? require("jsdom")
  : { JSDOM: class JSDOM extends Object {} };
const JSDOM = jsdom.JSDOM;

class DOM extends JSDOM {
  constructor(...arg) {
    let superArgs = [...arg];
    if (!arg[1]) {
      let url;
      if (process && process.env && process.env.serverUrl)
        url = process.env.serverUrl + "/";
      if (globalType() === "window")
        url =
          _global.location.protocol + "//" + _global.location.hostname + "/";
      superArgs[1] = {
        url: url,
        contentType: "text/html",
        runScripts: "dangerously",
        resources: "usable"
      };
    }
    let _window, _document;
    if (
      arg.length === 1 &&
      arg[0].document &&
      (arg[0].document.constructor.name === "HTMLDocument" ||
        (arg[0].document.constructor.name === "Document" &&
          arg[0].document.defaultView))
    )
      _window = arg[0];
    else if (
      arg.length === 1 &&
      arg[0].constructor &&
      (arg[0].constructor.name === "HTMLDocument" ||
        (arg[0].constructor.name === "Document" && arg[0].defaultView))
    )
      _window = arg[0].defaultView;
    else if (!arg[0])
      superArgs[0] = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title></title></head><body></body></html>`;
    super(...(canUseJsdom ? superArgs : []));
    let self = this;
    let env = globalType();

    if (!_window) _window = (arg.length || env === "node") ? self.window : {document:_document};
    if (!_document) _document = _window.document;

    if (!canUseJsdom && !_document) {


      _document = new Document().implementation.createHTMLDocument();
      _window.document = _document

      let htmlString = typeof arg[0] === "string" ? arg[0] : superArgs[0];
      if (typeof arg[0] !== "string") {
        let { ReflectBind, clone } = require("./utils");
        
      
        Reflect.ownKeys(Document.prototype).forEach((key, desc) => {
          desc = ReflectBind.descriptor(
            Document.prototype,
            key,
            _document
          );
          if (desc.value) desc.value = document[key]
          if (typeof desc.value === "object")
            desc.value = clone(desc.value, true);
          Object.defineProperty(_document, key, desc);
        });
      }
      pv.set(this, {
        window: { document: _document },
        document: _document,
        arguments: superArgs
      });
      htmlString = document.documentElement.outerHTML || document.getElementsByTagName("html")[0].outerHTML
      this.html(htmlString)
    } else
      pv.set(this, {
        window: _window,
        document: _document,
        arguments: superArgs
      });

    const docHandler = {
      get(ob, prop, prox) {
        if (prop === "{{target}}") return self;
        let match = /^{{(.*)}}$/.exec(prop);
        if (match && match[1]) {
          prop = match[1];
          ob = self;
        }
        if (prop === "window")
          return new Proxy(_window, {
            get(obj, key) {
              if (key === "document") return prox;
              if (key in obj) return obj[key];
              if (key in self) return prox[key];
            }
          });
        if (prop in ob) {
          let prp = Reflect.get(ob, prop, ob);
          return typeof prp === "function" ? prp.bind(ob) : prp;
        }
        if (prop in DOM.prototype)
          return typeof self[prop] === "function"
            ? self[prop].bind(self)
            : self[prop];
        if (prop in self) return self[prop];
        let elem = ob.getElementsByTagName(prop);
        if (elem && elem.length === 1) elem = elem[0];
        if (typeof elem !== "undefined") return elem;
      }
    };
    let docProx = new Proxy(_document, docHandler);
    return docProx;
  }
  elements(key, val) {
    if (key === "class")
      return pv.get(this).document.getElementsByClassName(key);
    else if (key === "tag")
      return pv.get(this).document.getElementsByTagName(key);
    let query = (cb) =>
      [...pv.get(this).document.querySelectorAll("*")].filter((item) =>
        cb(item)
      );
    if (arguments.length === 1 && typeof key === "object") {
      return query((item) =>
        Object.keys(item).every((key) => item.getAttribute(key) === val)
      );
    }
    return query((item) => item.getAttribute(key) === val);
  }
  create(type, attributes, appendTo) {
    let newEl,text = type;

    /*
      let match = /^<([^ ]*?) .*?(?:>?)(.*)(?:<\/(?:[^ ].*)>|\/>)/gi.exec(text)
      */
    if (text.trim().split(" ").length > 1 && text.includes("<")) {
      
      if (typeof attributes === "object") {
        appendTo = attributes;
        attributes = undefined;
      }
      try {
        let tempEl = document.createElement("div");
        let tempId = "reactKomponentDOMTemporaryElement";
        tempEl.setAttribute("id", tempId);
        tempEl.innerHTML = text;
        newEl = tempEl.childNodes[0];
        tempEl.remove();
      } catch (err) {
        throw err;
      }
    }
    /*
    let pattern1 = `^<${type}.*?(?:>|.*?\/>)(.*?)(?:<?)\/(?:${type}?)`
    let pattern2 = `([^ ]*)=(?:["|'])([^ ]*?)["|']`
    */

    newEl = newEl || pv.get(this).document.createElement(type);

    if (attributes)
      Object.keys(attributes).forEach((key) =>
        newEl.setAttribute(key, attributes[key])
      );

    if (appendTo) appendTo.appendChild(newEl);


    Object.setPrototypeOf(
      newEl,
      Object.setPrototypeOf(
        {
          set(...arg) {
            this.setAttribute(...arg);
            return this;
          }
        },
        Object.getPrototypeOf(newEl)
      )
    );
    return newEl;
  }
  tags(name) {
    return pv.get(this).document.getElementsByTagName(name);
  }
  tag(name) {
    return this.tags(name)[0];
  }
  html(html) {
    if (!html) {
      if (_global.document && pv.get(this).document === _global.document)
        return (
          pv.get(this).document.documentElement.outerHTML ||
          pv.get(this).document.getElementsByTagName("html")[0].outerHTML
        );
      return pv.get(this).document.documentElement.outerHTML;
    }
    if (html instanceof DOM) html = html.outerHtml();
    /*
    let args = Array(html,pv.get(this).arguments[1]).filter(Boolean)
    */
    let newHtml = html;
    if (canUseJsdom) newHtml = new DOM(html).tag("html").innerHTML;
    else {
      let match = html.match(/<html.*?>(.*?)<\/html>/ims);
      newHtml = newHtml ? match[1] : newHtml;
    }
    this.tag("html").innerHTML = newHtml;
  }
  get outerHTML() {
    console.log("blablablablabla");
    let oh;
    if (
      this.window &&
      this.window.document === pv.get(this).document &&
      typeof pv.get(this).arguments[0] === "string"
    )
      oh = this.serialize
        ? this.serialize()
        : pv.get(this).document.documentElement.outerHTML;
    else oh = pv.get(this).document.documentElement.outerHTML;
    return oh;
  }
  query(search) {
    return pv.get(this).document.querySelector(search);
  }
  queryAll(search) {
    return pv.get(this).document.querySelectorAll(search);
  }
  static [Symbol.hasInstance](instance) {
    if (this.prototype.isPrototypeOf(instance)) return true;
    return !!(
      instance["{{target}}"] &&
      this.prototype.isPrototypeOf(instance["{{target}}"])
    );
  }
}

let DOMClass = DOM;
var domName = "DOM";
const theDom = {
  [domName]: function DOM(...arg) {
    // require('jsdom-global')()
    return new DOMClass(...arg);
  }
}[domName];
if (canUseJsdom) {
  Reflect.ownKeys(jsdom)
    .filter((key) => key !== "constructor")
    .forEach((key) => {
      Object.defineProperty(theDom, key, {
        get() {
          return jsdom[key];
        }
      });
    });
}
theDom.default = theDom;
module.exports = theDom;