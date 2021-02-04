import React from 'react'
import { Sub,getLevel,tie,ReflecTie,getProp,WeakerMap,getDefinition,contract } from '../helpers/utils'
import privates from '../Komponent/privateVariables'
import {combineReducers} from 'redux'

const proto = { get: Object.getPrototypeOf, set: Object.setPrototypeOf}
const initializations = new WeakerMap

export default function inheritMethods(comp) {
   let thisProto = proto.get(proto.get(comp))
   alterProps(thisProto)
}

const safe = (ob,prop,binder) => {
   binder = binder || ob
   const theProp = getProp(ob,prop);
   if (!theProp) return
   return prop.originalValue ? prop.originalValue(binder) : Reflect.get(ob,prop,binder)
}

export function callIt(obj,func,Bind,...arg) {
   if (typeof func === 'string') {
      let def = getDefinition(obj,func)
      if (!def) return
      func = def.get || def.value
      if (typeof func !== 'function') return
      func = func.bind(Bind)
   }
   if (arguments[1] === 'componentDidMount') {
      console.log('funcher',func)
      // throw new Error('finch')
   }

   let trg = Bind
   const priv = privates.getSet(trg,{})
   console.log('the error func name',func.name)
   try { priv.caller = obj } finally { try { return func(...arg) } finally { if (priv.caller === obj) priv.caller = trg } }
}

function register(comp) {
   if (!comp.constructor.statefulComponents) {
      console.log('comper womper',comp)
      throw new Error(`This component doesn't appear to be a descendant of Komponent class.`)
   }
   if (!comp.constructor.statefulComponents[comp.componentName])
   comp.constructor.registerComponent(comp)
}

export const onSets = {
   initialize() {
      let self = this
      const componentName = safe(this,'componentName')
      console.log('componentName',componentName)
      const Parent = this.constructor
      register(this)
      
      if (!Parent.reducers.hasOwnProperty(componentName)) {
         Parent.RootClass.extension(ext => {
            let rootReducer = ext.reducers || null
            if (rootReducer && !rootReducer.hasOwnProperty(componentName) && !self.initialized)
            onSets.reducer.call(self)
         })
      }
      if (('sagas' in this) && !Parent.sagas[componentName])
         Parent.refreshSagas() 
   },
   reducer() {
      const componentName = safe(this,'componentName')
      register(this)
      const thiss = this
      const Parent = this.constructor
      let allowed = Parent.allowedList.includes(componentName)
      if ((!Parent.customReducers) || allowed) {
         Parent.reducers[componentName] = safe(this,'reducer')
         Parent.RootClass.extension(ext => {
            Parent.store.replaceReducer(combineReducers({ ...ext.reducers, ...Parent.reducers }))
         })
      }
   },
   sagas() { register(this); this.constructor.refreshSagas() }
}

export function gB(obj,thiss) {
   return new Sub(thiss,{

      get: function(ob,prop) {
         if (prop === 'original') {
            let level = proto.get(obj)
            return new Sub(level,{
               get: function(o,p) {
                  let levl = getLevel(level,lvl => lvl.hasOwnProperty(p)) || level
                  let bindThiss = new Sub(thiss,{
                     get: function(src,key) {
                        if (key === 'original') {
                           return new Sub(proto.get(levl),{
                              get: function(thing,name) {
                                 let newBnd = new Sub(thiss,{
                                    get: function(ob,prop) {
                                       if (prop === 'original') return bindThiss.original 
                                       let retVal = Reflect.get(thiss,prop,newBnd)
                                       return (typeof retVal === 'function' && name !== 'constructor') ? retVal.bind(newBnd) : retVal
                                    }
                                 })
                                 let ret = Reflect.get(thing,name,newBnd)
                                 return (typeof ret === 'function' && name !== 'constructor') ? ret.bind(newBnd) : ret
                              }
                           })
                        }
                        let ret = Reflect.get(src,key,bindThiss)
                        return (typeof ret === 'function' && key !== 'constructor') ? ret.bind(bindThiss) : ret
                     }
                  })
                  let retVal = Reflect.get(levl,p,bindThiss)
                  return (typeof retVal === 'function' && p !== 'constructor') ? retVal.bind(bindThiss) : retVal
               }
            })   
         }
         return Reflect.get(ob,prop)
      }

   })
}

export const getBind = (start,thiz) => {
   let newProx = new Sub(thiz,{
      get: function(o,p) {
         return thiz[p]
      }
   })
   return newProx
}

export function alterProps(obj,cb) {
   Reflect.ownKeys(obj).filter(key => key !== 'constructor' && key !== 'original').forEach(key => {
      let def = Object.getOwnPropertyDescriptor(obj,key)
      def.configurable = true
      let type = def.hasOwnProperty('get') ? 'get' : 'value';
      const backup = def[type]
      if (backup.defined) return
      if (typeof backup !== 'function') return

      if (cb) {
         let defn = cb(Object.defineProperty({},key,def),key,def)
         type = defn.hasOwnProperty('get') ? 'get' : 'value';
         defn[type].defined = true
         return Object.defineProperty(obj,key,defn)
      }
      
      var propName = key+'Caller'
      def[type] = {[propName]: function() {
         obj = protoFromProp(this,key,def[type])
         const thiss = this['{{target}}'] || this
         let arg = [...[arguments]]
         console.error('calling ',key)
         console.log('this in '+key,this)
         // let Bind = getBind(obj,this)
         let prop = backup.bind(this)
         let propCall = callIt(obj,prop,thiss,...arg) 
         
         if ((key === 'mapStateToProps' || key === 'mapDisPatchToProps' || type === 'get') && typeof propCall === 'function' && arg.length) {
            return callIt(obj,propCall,thiss,...arg)
         }
         return propCall
         
      }}[propName]

      def[type].defined = true
      Object.defineProperty(obj,key,def) 
   })
}

export function protoFromProp(thiss,key,prop) {
   return getLevel(thiss,lvl => {
      const def = Object.getOwnPropertyDescriptor(lvl,key)
      if (!def) return false
      const type = def.hasOwnProperty('get') ? 'get' : 'value'
      return def && (def[type] === prop)
   })
}

export function alterKompProto(object) { 
   const callback = (obj,key,def) => {
      const type = def.hasOwnProperty('get') ? 'get' : 'value'
      def = { configurable:true }
      var propName = key+'Caller'
      def.get = {[propName]: function() {
         let thiss = this['{{target}}'] || this
         console.log('key',key)
         console.log('this in '+key,thiss);
         const thisMap = initializations.getSet(thiss,new WeakerMap)
         const propMap = thisMap.get(def.get)

         if (!propMap) {
            thisMap.set(def.get,true)
            if (!thiss.connector) onSets.initialize.call(thiss) 
         }

         console.error('calling ',key)
         console.log('this in '+key,thiss)
         const ob = protoFromProp(thiss,key,def.get)
         if (!ob) { console.log('obj',obj); console.log('this',thiss); throw new Error(); }
         Object.defineProperty(def.get,'name',{value:ob.constructor.name+'__'+key+'__'})
         // const Bind = getBind(ob,thiss)
         let prop = Reflect.get(obj,key,thiss)
         if (typeof prop !== 'function') return prop
         prop = ReflecTie(obj,key,thiss)
         return function(...arg) { 
            let propCall = callIt(ob,prop,thiss,...arg) 
            if ((key === 'mapStateToProps' || key === 'mapDisPatchToProps') && typeof propCall === 'function')
               return callIt(ob,propCall,thiss,...arg)
            return propCall
         }.bind(thiss)
      }}[propName]
      def.get.originalProp = getProp(obj,key)
      def.get.originalValue = (binder) => tie(Reflect.get(obj,key,binder),binder)
      def.get.defined = true
      return def    
   }
   return alterProps(object,callback)
}