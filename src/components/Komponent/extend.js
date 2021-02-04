import React from 'react'
import KomponentClass from './class'
import privateVars from './privateVariables'
import { clone,merge,isClass,lowerFirst,Sub, getLevel, cloneFunc } from '../helpers/utils'

const proto = { set: Object.setPrototypeOf, get: Object.getPrototypeOf }
const rand = privateVars.randomString

const rxProxy = new Sub(React.Component,{ 
   get: function(ob,prop) { 
      if (prop === 'variant') return 'rxProxy'
      return (prop === 'prototype') ? React.Component.prototype : KomponentClass[prop] 
   },
})
const exProxy = (ex) => new Sub(ex,{ 
   get: function(ob,prop) { 
      if (prop === 'variant') return 'exProxy'
      return (prop === 'prototype') ? ex.prototype : (prop in ex) ? ex[prop] : KomponentClass[prop] 
   },
})
 
export default function Komponent(comp,cb,prps) {
    var extensionName = comp.name

    if (isClass(comp)) {

      let target = getLevel(comp,lvl => proto.get(lvl) === React.Component)
      console.log('target',target)
      let newComp = cloneFunc(React.Component,function(pr) {
         let instance = pr[rand] || this
         console.log('instance',instance)
         return instance
      })

       var compClassName = comp.name
       const Extended = {
          [compClassName]: class extends comp {
             constructor(props) {
                props = prps ? prps(props) : props
                let thiss = props[rand] = props[rand] || new comp(props)
                if (cb) thiss = props[rand] = cb.call(thiss,props)
                let backup = proto.get(target)
                proto.set(target,newComp)
                super(props)
                proto.set(target,backup)
                
                // Object.defineProperty(thiss,'componentName',{value:lowerFirst((thiss.props && thiss.props.component) ? thiss.props.component.constructor.name : thiss.constructor.name),configurable:true,writable:true,enumerable:true})
                /*
                Constructor.call(thiss,props)
                */

                return thiss

             }
          }
       }[compClassName]

       proto.set(Extended,exProxy(comp))
       if (!comp.prototype instanceof React.Component) {
          proto.set(Extended.prototype,clone(comp.prototype,true))
          proto.set(proto.get(Extended.prototype),React.Component.prototype)
       }
       Extended.prototype.constructor = Extended
       Object.defineProperty(Extended,'name',{value:comp.name})
       Object.defineProperty(Extended.prototype,'componentName',{
          get: function() { 
             return lowerFirst((this.props && this.props.component) ? this.props.component.constructor.name : this.constructor.name)
          },configurable:true,enumerable:true
       })   

       return Extended
    }

    const extension = {
    [extensionName]: function(props) {

       let thiss = props[rand] || props.component || this
       let Super = proto.get(thiss.constructor)
       if (isClass(Super) && thiss === this) thiss = new Super(props)
       else Super.call(thiss,props)

       proto.set(thiss,proto.get(this))
       Object.defineProperty(thiss,'componentName',{value:lowerFirst((thiss.props && thiss.props.component) ? thiss.props.component.constructor.name : thiss.constructor.name),configurable:true,writable:true,enumerable:true})   
       thiss.initialized = thiss.initialized || false
       privateVars.getSet(thiss,{})
       
       if (cb) return cb.call(thiss,props)
          return thiss

    }}[extensionName]

    proto.set(extension,rxProxy)
    merge(extension.prototype,clone(comp.prototype),['constructor'])
    proto.set(extension.prototype,React.Component.prototype)
    proto.get(extension.prototype).constructor = extension
    Object.defineProperty(extension,'name',{value:comp.name})

    return extension
 }