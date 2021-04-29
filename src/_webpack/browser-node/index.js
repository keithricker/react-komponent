let _glob
function globalType() {
  try { 
    if (global && global.constructor && global.constructor.name.toLowerCase() === 'window') {
      _glob = global
      return 'window'
    }
    if (window) {
      _glob = window
      return 'window'
    }
    _glob = global
    return 'node'
  } catch { _glob = global; return 'node' }
}
let _global = () => { globalType(); return _glob }
globalType()

let modEx = {

  get console() { return require('console-browserify') },
  get constants() { return require('constants-browserify') },
  get crypto() { return require('crypto-browserify') },
  get fetch() { return require('./browser_modules/fetch.js')},
  get fs() { return require('browserify-fs') },
  get http() { return require('./browser_modules/http') },
  get https() { return require('https-browserify') },
  get os() { return require('os-browserify') },
  get path() { return require('path-browserify') },
  get stream() { return require('stream-browserify') },
  get vm() { return require('vm-browserify') },
  get util() { return require('./browser_modules/util.js') },
  get zlib() { return require('browserify-zlib') },
  get buffer() { return require('./browser_modules/buffer.js') },
  get jsdom() { return require('./browser_modules/jsdom/jsdom-src.js') },
  get url() { return require('./browser_modules/url.js') },
  get events() { return require('../node_modules/events') },
  get process() { return modEx.dynamic.process },
  get react() { return require('react-komponent/node_modules/react') }, 

  paths: {
    get console() { return require.resolve('console-browserify') },
    get constants() { return require.resolve('constants-browserify') },
    get crypto() { return require.resolve('crypto-browserify') },
    get fetch() { 
      return require.resolve('./browser_modules/fetch.js')
    },
    get fs() { return require.resolve('browserify-fs') },
    get http() { return require.resolve('./browser_modules/http') },
    get https() { return require.resolve('https-browserify') },
    get os() { return require.resolve('os-browserify') },
    get path() { return require.resolve('path-browserify') },
    get stream() { return require.resolve('stream-browserify') },
    get vm() { return require.resolve('vm-browserify') },
    get util() { return require.resolve('./browser_modules/util') },
    get zlib() { return require.resolve('browserify-zlib') },
    get buffer() { return require.resolve('./browser_modules/buffer.js') },
    get jsdom() { return require.resolve('./browser_modules/jsdom/jsdom-src.js') },
    get url() { return require.resolve('./browser_modules/url.js') },
    get TextEncoder() { return require.resolve('./browser_modules/TextEncoder.js') },
    get TextDecoder() { return require.resolve('./browser_modules/TextDecoder.js') },
    get process() { return require.resolve('./browser_modules/process.js') },
    get react() { return require.resolve('react-komponent/node_modules/react') },
    get ['react-komponent']() { return require.resolve('react-komponent') },
    get tty() { return require.resolve('tty-browserify') },
    get events() { return require.resolve('../node_modules/events') }
  },

  dynamic: {
    get console() { 
      if (globalType() === 'node') return require('console')
      if (_global.reactKomponent) return _global().reactKomponent.require('console')
      return require('console-browserify') 
    },
    get constants() { 
      if (globalType() === 'node') return require('constants')
      if (_global.reactKomponent) return _global().reactKomponent.require('constants')
      return require('constants-browserify') 
    },
    get crypto() { 
      if (globalType() === 'node') return require('crypto-browserify')
      if (_global.reactKomponent) return _global().reactKomponent.require('crypto')
      return require('crypto-browserify')  
    },
    get fetch() { 
      if (globalType() === 'node') return require('node-fetch')
      if (_global.reactKomponent) return _global().reactKomponent.require('fetch')
      return require('./browser_modules/fetch')  
    },
    get fs() { 
      if (globalType() === 'node') return require('fs')
      if (_global.reactKomponent) return _global().reactKomponent.require('fs')
      return require('browserify-fs')  
    },
    get http() { 
      if (globalType() === 'node') return require('http')
      if (_global.reactKomponent) return _global().reactKomponent.require('http')
      return require('./browser_modules/http') 
    },
    get https() { 
      if (globalType() === 'node') return require('https')
      if (_global.reactKomponent) return _global().reactKomponent.require('https')      
      return require('https-browserify') 
    },
    get os() { 
      if (globalType() === 'node') return require('os')
      if (_global.reactKomponent) return _global().reactKomponent.require('os')
      return require('os-browserify') 
    },
    get path() { 
      if (globalType() === 'node') return require('path')
      if (_global.reactKomponent) return _global().reactKomponent.require('path')
      return require('path-browserify') 
    },
    get stream() { 
      if (globalType() === 'node') return require('stream')
      if (_global.reactKomponent) return _global().reactKomponent.require('stream')
      return require('stream-browserify') 
    },
    get vm() { 
      if (globalType() === 'node') return require('vm')
      if (_global.reactKomponent) return _global().reactKomponent.require('vm')
      return require('vm-browserify') 
    },
    get util() { 
      if (globalType() === 'node') return require('util')
      if (_global.reactKomponent) return _global().reactKomponent.require('util')
      return require('./browser_modules/util.js') 
    },
    get zlib() { 
      if (globalType() === 'node') return require('zlib')
      if (_global.reactKomponent) return _global().reactKomponent.require('zlib')
      return require('browserify-zlib') 
    }, 
    get buffer() { 
      if (globalType() === 'node') return global.Buffer
      if (_global.reactKomponent) return _global().reactKomponent.Buffer
      return require('./browser_modules/buffer.js') 
    },   
    get jsdom() { 
      if (globalType() === 'node') return require('jsdom')
      if (_global.reactKomponent) return _global().reactKomponent.require('jsdom')
      return require('./browser_modules/jsdom/jsdom-src.js') 
    }, 
    get process() { 
      if (globalType() === 'node') return process
      if (_global.reactKomponent) return _global().reactKomponent.process
      return require('./browser_modules/process.js') 
    }, 
    get url() { 
      if (_global.reactKomponent) return _global().reactKomponent.require('url')
      return require('./browser_modules/url.js') 
    }, 
    get react() { return require('react-komponent/node_modules/react') },
    get ['react-komponent']() { return require('react-komponent') },
    get tty() { 
      if (_global.reactKomponent) return _global().reactKomponent.require('tty')
      return require('tty-browserify') 
    },
    get events() { 
      if (_global.reactKomponent) return _global().reactKomponent.require('events')
      return require('../node_modules/events') 
    } 

  },
  globals: {
    get React() { return modEx.react },
    get $() { return global['jquery'] },
    get jQuery() { return global['jquery'] },
    get React() { return modEx.react },
    get reactKomponent() { return global.reactKomponent },
    get regeneratorRuntime() { require('regenerator-runtime/runtime') },
    get process() { return modEx.dynamic.process },
    get TextEncoder() { return modEx.dynamic.TextEncoder },
    get TextDecoder() { return modEx.dynamic.TextDecoder },
    get Buffer() { modEx.dynamic.buffer }
  }

}
module.exports = modEx