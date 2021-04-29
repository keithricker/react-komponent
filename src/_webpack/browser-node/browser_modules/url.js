Object.defineProperty(module,'exports',{
   get() {
     var url = require('react-komponent/node_modules/url')
     try { url.URL = url.URL || URL } catch {}
     return url
   }
})
