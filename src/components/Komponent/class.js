import React from 'react'
import { combineReducers } from 'redux'
import { all, call } from 'redux-saga/effects';
import { RootClass } from '../RootComponentCompiled'
import vars from './privateVariables'
import customConnect from './Connector'

let RCExtension;
RootClass.extension((ext) => RCExtension = ext)


const proto = {get: Object.getPrototypeOf, set: Object.setPrototypeOf}

let allReducers = () => RCExtension.reducers
const equivalent = (one,other) => {
   if (one === other) return true
   if (!Array.isArray(one) || !Array.isArray(other)) return false
   return one.every((item,ind) => item === other[ind])
}

export function getKomponentClass(Parent = React.Component) {
    class Komponent extends Parent {

        constructor(props) {
            super(props)
        }
        static get store() { return this.RCExtension.store }
        static stateFromStorage(...property) {
            property.push('persist:root')
            let storage = JSON.parse(JSON.stringify(localStorage))
            property.forEach(prop => { storage = storage ? storage[prop] : storage })
            return storage || {}  
        }
        static get reducer() {
            const Komp = this
            let key = Komp.name.toUpperCase()+'_STATE_CHANGE'
            
            return (state=null, action) => {
                switch(action.type) {
                case key:
                    return action.payload
                default:
                    return state
                }
            }
        }
        static get sagas() {
            let Komp = this
            let privs = vars.getSet(Komp,{})
            if (!privs.sagas)
                this.refreshSagas()
            privs.sagas = privs.sagas || {}
            return privs.sagas
        }
        static refreshSagas() {
            console.log('refreshing sagas')
            let Komp = this
            let sags = []
            let privs = vars.getSet(Komp,{})
            if (!privs.sagas) privs.sagas = {}
            let comp; let compSagas
            Object.keys(Komp.statefulComponents).forEach(key => {
                comp = Komp.statefulComponents[key]
                compSagas = typeof comp.sagas === 'function' ? comp.sagas() : comp.sagas
                if (compSagas) {
                   sags = [...sags, ...compSagas]
                   let thisSag = privs.sagas[comp.componentName]
                   if (!equivalent(thisSag,compSagas)) {
                      console.log('running the saga',compSagas)
                      this.runSaga(compSagas)
                   }
                   privs.sagas[comp.componentName] = compSagas
                }
            })
            return sags            
        }
        static runSaga(sagas) { this.RCExtension.runSaga(sagas) }
        static get rootSaga() {
           const sagas = this.sagas.map(sag => call(sag))
           if (sagas.length)
              return function* rootSaga() {
                 yield all(sagas)
              }
        }
        static addReducers(red) {
            let Komp = this
            let comb = { ...allReducers(), ...Komp.reducers, ...red }
            Komp.store.replaceReducer(combineReducers({ ...comb }))
        }
        static refreshReducers() {
            let Komp = this
            Komp.store.replaceReducer(combineReducers(this.allReducers))
        }
        static registerComponent(comp) {
            return vars(Komponent).stateFulComponents[comp.componentName] = comp              
        }
        static deregisterComponent(comp) {
            return delete vars(Komponent).stateFulComponents[comp.componentName]              
        }
        static get statefulComponents() {
            let sc = vars(Komponent).statefulComponents
            return Object.keys(sc).length < 1 ? undefined : {...sc}
        }
        // By default, reducers are collected by rounding up all of the reducer fields on each
        // instance of Komponent. The registerReducers function allows you to bypass this and
        // do it by specifying a list of reducers, the way redux normally does it.
        static registerReducers(red) {
            const Komp = this
            if (red) {
                // When manually specifying a list of reducers, if you just want redux to use what is provided
                // in the component's reducer field, then just put 'defeault.' This will put the component's reducer
                // on the white list (a map of reducers you want redux to use)
                Object.keys(red).forEach(key => {
                    if (red[key] === 'default') {
                        console.error('code red!')
                        delete red[key]
                        Komp.allowedList.push(key)
                    }
                })
                Komp.reducers = red
                Komp.customReducers = true
            } else {
                Komp.customReducers = false
            }
            if (RCExtension) {
                Object.keys(Komp.reducers).some(redu => {
                   if (!(redu in Komp.store.getState())) {
                      console.error('refreshing! '+redu)
                      Komp.refreshReducers()
                      return true
                   }
                })
            }
        }
        static get socket() { return this.RootClass.socket }

    }
    Komponent.customReducers = false
    Komponent.RootClass = RootClass
    Komponent.allowedList = []
    Komponent.selectors = new WeakMap
    Komponent.useSelectors = new WeakMap
    Komponent.subscriptions = new WeakMap
    Komponent.reducers = {}
    Komponent.customConnect = customConnect
    vars(Komponent).statefulComponents = {}
    
    return Komponent
}

let kompClass = getKomponentClass()
export default kompClass