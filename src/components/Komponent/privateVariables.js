Object.defineProperty(exports, "__esModule", {
   value: true
});
const { randomString } = require('../helpers/utils')

const privs = new WeakMap();
const random = randomString()
const privateMap = function(obj,properties) {
   if (!privs.has(obj)) return privateMap.get(...arguments)
   if (!arguments.hasOwnProperty(1)) return privs.get(obj)
   return privs.set(...arguments)
 }
 Reflect.ownKeys(WeakMap.prototype).forEach(key => {
   privateMap[key] = typeof WeakMap.prototype[key] === 'function' ? WeakMap.prototype[key].bind(privs) : WeakMap.prototype[key]
 })
 privateMap.get = function(obj,properties) {
   let def = {}
   let props = () => arguments.hasOwnProperty(1) 
   if (!props() && privs.has(obj)) return privs.get(obj)
   if (!privs.has(obj)) privateMap.set(obj, props() ? properties : def)
   return props() ? properties : def
 }
 privateMap.set = function(obj,props) {
   if (!privs.has(obj)) privs.set(obj,new Proxy({},{
     get(ob,prop) { 
        return prop === 'randomString' ? random : (prop in props) ? props[prop] : undefined 
     },
     set(ob,prop,val) { 
        return props[prop] = val
     }
   }))
   else privs.set(obj,props)
 }

 exports.default = privateMap