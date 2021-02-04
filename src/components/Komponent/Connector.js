import React from 'react'
import { subscribeToStore } from '../helpers/subscriber'
import { getLevel,cloneFunc,clone } from '../helpers/utils'
import { createSelector } from 'reselect'
import KomponentClass from './class'
import privates from './privateVariables'

let rand = privates.randomString

const proto = { get:Object.getPrototypeOf, set: Object.setPrototypeOf }
const isClass = (ob) => ob.prototype instanceof React.Component

export default function customConnect(msp,mdp) {

    return function(Comp) {
       
      let Komponent = getLevel(Comp,lvl => lvl.name === 'Komponent') || KomponentClass
      let store = () => Komponent.store
      
      const selectors = Komponent.selectors
      let defaultMdp = (dispatch) => ({ dispatch })
      mdp = mdp || defaultMdp
      selectors.set(msp,selectors.get(msp) || msp)
      const selector = createSelector(selectors.get(msp),(items) => items)
      
      let clonedComp

      if (!isClass(Comp)) clonedComp = cloneFunc(Comp,function(props) {
         props = clonedComp.connectedProps(props); 
         let thiss = props[rand] || props.component || this 
         console.log('propsrand',thiss)
         if (!thiss || thiss === Window) {
            thiss = new React.Component(props);
            if (Comp.prototype instanceof React.Component)
               proto.set(thiss,Comp.prototype)
            else proto.set(thiss,proto.set(clone(Comp.prototype),React.Component.prototype))
         }
         subscribeToStore.call(thiss,store(),selector,selector,'customConnect')
         return Comp.call(thiss,props)
      })
/*
      if (!isClass(Comp)) clonedComp = cloneFunc(Comp,function(props) {
         let thiss = props[rand] || props.component || this
         props = connectedProps(props)
         if (!thiss || thiss === Window) {
            thiss = new React.Component(props)
            if (Comp.prototye instanceof React.Component) 
               proto.set(thiss,proto.get(this))
         }
         subscribeToStore.call(thiss,store(),selector,selector)
         return Comp.call(thiss,props)
      }) */

      else clonedComp = cloneFunc(Comp,function(props) {
         props = clonedComp.connectedProps(props)
         let theStore = Comp.store || store();
         let Con = this.constructor
         console.log('thister',this)
         let thiss = (!this || this === Window) ? new Con(props) : this
         subscribeToStore.call(thiss,theStore,selector,selector)
         return thiss
      })   
      Object.defineProperty(clonedComp,'name',{value:'Connected'+Comp.name})
      
      clonedComp.connectedProps = function(prps) {
         const mappedItems = () => selector(store().getState(),prps)
         const newProps = { ...prps,...mdp(store().dispatch) }
         Object.keys(mappedItems()).forEach(key => {
            Object.defineProperty(newProps,key,{ get: function() { return mappedItems()[key] },configurable:true })
         })
         return newProps
      }
      
      return clonedComp

       /*
       var newClassName = Comp.name+'Connector'

       const NewClass = {[newClassName]: function(props) {
          let Parent = proto.get(this.constructor)
          console.error('instantiating new Parent from NewClass in the Connector')
          const thiss = new Parent(updateProps({...props}))
          subscribeToStore.call(thiss,Parent.store,selector,selector)
          
          const unsub = Parent.store.subscribe(function() {
             thiss.props = updateProps({...thiss.props})
          }) 

          console.error('new Connector')
          console.log(thiss)
          return thiss
          
       }}[newClassName]
       proto.set(NewClass,Comp)
       proto.set(NewClass.prototype,Comp.prototype)
       Object.defineProperty(NewClass,'name',{ value: Comp.name+'Connector', writable:false})
       
       return NewClass
       */
    }
 }

