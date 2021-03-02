import {boundProperties} from './Obj'

let or = (thing,...conditions) => conditions.some(cond => thing === cond)
let _typeof = (ob) => window[({}).toString.call(ob).split('[object ')[1].split("]")[0]]

 
 function entries(obj) {
   return Reflect.ownKeys(obj).map(key => {
      let ent = [key,'']; Object.defineProperty(ent,1,Object.getOwnPropertyDescriptor(obj,key))
      return ent
   })
 }

 let bindIt = (ob,prop,bnd) => {
   bnd = (arguments.length === 2) ? prop : bnd
   let fetched = (arguments.length === 2) ? ob : Reflect.get(...[ob,prop,...bnd].filter(Boolean))
   return typeof fetched === 'function' ? typeof bnd !== 'undefined' ? fetched.bind(bnd) : fetched : fetched 
 }

 const _typeof = (ob) => ({}).toString.call(ob).split('[object ')[1].split("]")[0]
 _typeof.class = (ob) => _global[_typeof(ob)]

 
 const _Map = (function() {
   let keyz = vars(_Map).keys = new WeakMap()
   function keys(ob) {
      if (!keyz.has(ob)) {
         let def = new Map()
         keyz.set(ob,def)
         return def
      }
      return keys.get(ob)
   }  
   class mapKey {
      constructor(object,key,text) {
         let mapKey = Symbol(text || key.name || key.constructor.name || 'mapKey')
         keys(object).set(key,mapKey)        
         return mapKey 
      }    
    }
    class _Map extends Map {
       constructor(...arg) {
          let entr;let obj
          if (arg.length) {
             if (arg.length === 1 && typeof arg[0] === 'object' && !Array.isArray(arg[0])) {
               entr = entries(arg[0])
               obj = arg[0]
             } else if (arg[0] instanceof Map) 
               entr = [...arg[0]]
             else entr = arg[0]
          }
          super(entr)
          Object.defineProperty(this,'_entries',{get:() => {
             if (!priv(this).newTarget) {
                entrs = entries(priv(this).object)
                entrs.forEach(([key,val]) => {
                   if (key instanceof mapKey)
                     entr[0] = this.keyFromSymbol(priv(this).object,key)
                })
             }
             return entrs
          }})
          let object
          Object.defineProperty(priv(this),'object',{ 
             get() { 
                object = (obj && !priv(this).newTarget) ? obj : this.asObject()
                priv(object).map = this
                return object
             }, configurable:true
          })
       }
       clear() { 
          Map.prototype.clear.call(this); 
          this._entries = []; 
          if (!this.newTarget)
             Reflect.ownKeys(priv(this).object)
              .forEach(key => delete priv(this).object[key])  
       }
       delete(key) { 
         if (key instanceof mapKey)
            key = this.keyFromSymbol(key)
          Map.prototype.delete.call(this,key); 
          this.entries.splice(this._entries.findIndex(item => item[0] === key),1); 
          if (!this.newTarget) delete priv(this).object[key] 
       }
       forEach(cb,ths) { 
          let newCb = function([key,val]) {
             return cb(val,key)
          }
          return this._entries.forEach(newCb,ths) 
       }
       get(key) { 
         if (key instanceof mapKey)
            key = this.keyFromSymbol(key)
         if (!this._entries) return Map.prototype.get.call(this)
         return this._entries.find(item => item[0] === key) 
       }
       set(key,val,alt) { 
          if (key instanceof mapKey)
             key = this.keyFromSymbol(key)
          let mapSet = Map.prototype.set.call(this,...arguments)
          if (!this._entries) return mapSet
          let entry = this.get(key)
          if (entry) this.delete(key)
          let newEntry = arguments.length === 1 && Array.isArray(arguments[1]) 
          ? arguments[1]
          : (arguments.length === 3 && typeof key === 'string') ? Object.defineProperty([key,''],1,Object.getOwnPropertyDescriptor(arguments[1],arguments[2]))
          : [key,val]
          this._entries.push(newEntry)
          if (!this.newTarget) {
            key = (typeof key === 'string' || typeof key === 'symbol') ? key : new mapKey(...[priv(this).object,key,typeof alt === 'string' && alt].filter(Boolean))
            Object.defineProperty(priv(this).object,key,Object.getOwnPropertyDescriptor(newEntry,1))
          } 
         return Map.prototype.set(key,val)
       }
       has(key) {
         if (key instanceof mapKey)
         key = this.keyFromSymbol(key)
         return Map.prototype.has.call(this,key)
       }
       keys() { return this._entries.map(ent => ent[0]) }
       values() {
          let vals = []
          this._entries.forEach((ent,ind) => { 
             Object.defineProperty(vals,ind,Object.getOwnPropertyDescriptor(ent,1))
          })
          return vals
       }
       entries() { 
          let thiss = this._entries
          let iterator = {
             current: 0,
             last: thiss.length-1,
          
             // 3. next() is called on each iteration by the for..of loop
             next() {
                // 4. it should return the value as an object {done:.., value :...}
                if (iterator.current <= iterator.last) {
                  return { done: false, value: thiss[iterator.current++] };
                } else {
                  return { done: true };
                }
             }
          }
          return iterator
       }
       get[Symbol.iterator]() {
          return this.entries
       }
       asObject(prototype = Object.prototype) {
          if (!priv(this).newTarget) return priv(this).object
          let constructor = prototype.constructor
          if (constructor !== Object) 
          let obj = constructor === Object ? {} : undefined
          if (!obj) {
            let pro = Object.create(constructor.prototype); let curr = pro
            while(curr = Object.getPrototypeOf(curr)) {
               if (!obj)
                  try { obj = new curr.constructor() } catch {}
               else return
            }
            let objConstructor = _typeof(obj)
            let argus = []
            if (objConstructor.prototype[Symbol.iterator])
               argus = (Array.isArray(obj)) ? [obj] : [[...obj]]
            
            if (objConstructor === constructor) {
               obj = new constructor(...argus)
            }
            else try { 
               obj = new constructor()
               if (obj[Symbol.iterator]) 
                  Object.defineProperties(obj,Object.getOwnPropertyDescriptors(this._entries)) } 
            catch { obj = new objConstructor(...argus) }
          }
          Object.setPrototypeOf(obj,Object.setPrototypeOf(boundProperties(Map.prototype,this),prototype))

          if (!obj[Symbol.iterator]) {
             let newDescs = {}
             this._entries.forEach(ent => {
                let key = ent[0]
                key = (typeof key === 'string' || typeof key === 'symbol') ? key : new mapKey(obj,key)
                newDescs[key] = Object.getOwnPropertyDescriptor(ent,1)
             })
             Object.defineProperties(obj,newDescs)
          }
          priv(obj).map = this
          return obj
       }
       symbolFromKey(ob,key) {
         if (arguments.length === 1) {
            key = ob
            ob = priv(this).object
         }
         return keys(ob).get(key)
       }
       keyFromSymbol(ob,sym) {
         if (arguments.length === 1) {
            sym = ob
            ob = priv(this).object
         }
         return [...keys(ob)].find(([key,val]) => (val === sym) ? key : undefined)
       }  
    }
    let map = _Map
    let _Map = function(...arg) {
        let newMap = new map(...arg)
        priv(newMap).newTarget = new.target
    };
    Object.defineProperties(_Map,Object.getOwnPropertyDescriptors(map))
    Object.setPrototypeOf(_Map,map)

 })()