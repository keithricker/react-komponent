import React from 'react'
import { combineReducers } from 'redux'
import { connect as connectFunc } from 'react-redux'

import { createStore } from 'redux'
import createSagaMiddleware, { runSaga } from 'redux-saga'

import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/es/integration/react';
import { applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { call } from 'redux-saga/effects'
import Component from './componentFunctionCompiled'

console.log('component!',Component)
throw new Error

const persistConfig = { 
    key: 'primary',
    storage
}; 

const originalCreateStore = createStore
const originalApplyMiddleware = applyMiddleware
const originalCreateSagaMiddleware = createSagaMiddleware

class RootClass extends React.Component {
   constructor(props) {
        super(props)

        if (this.constructor.hasOwnProperty('extension')) {
            throw new Error("The "+this.constructor.name+" class is intended to be a root-level component."
            +" it is therefore not intended to have more than one instance. Try extending the "+this.constructor.name+
            " class (not guaranteed to be stable), or create a new RootComponent if you wish to have multiple instances.")
        }
        RootClass.extension = this.constructor
        const thiss = this.constructor.instance = this
        const proto = Object.getPrototypeOf(this)

        Object.keys(props).forEach(key => { 
           if (!proto[key]) thiss[key] = props[key] 
        })      

        let combinedProps = [ ...Reflect.ownKeys(Object.getPrototypeOf(this)), ...Object.keys(this) ]
        combinedProps.forEach(key => {
            if (!this.constructor[key]) {
                this.constructor[key] = Reflect.get(thiss,key,thiss)
            }
        })

        this.store = this.store || this.constructor.createStore(this.constructor.reducers,this.persistConfig || persistConfig)
        this.constructor.store = this.store
        if (this.sagas) this.constructor.runSaga()

   }
   render() {
      let persistor = this.persistor || persistStore(this.store)
      return (
         <React.StrictMode>
            <BrowserRouter>
               <Provider store={this.store}>
                 <PersistGate persistor={persistor}>
                    {this.props.children}
                 </PersistGate>
               </Provider>
            </BrowserRouter>
         </React.StrictMode>
      )
   }

   static createStore(reducers, pc) {
       reducers = reducers || this.reducers
       pc = pc || this.persistConfig || persistConfig
       this.store = createStore(this.configuredReducers,applyMiddleware(thunkMiddleware,this.sagaMiddleware))
       
       return this.store
   }
    static get combinedReducers() {
        return combineReducers(this.reducers)
    }
    static get configuredReducers() {
        return persistReducer(this.persistConfig || persistConfig, this.combinedReducers);
    }
    static get reducers() {
        let pr = (this.instance && this.instance.reducers) ? this.instance.reducers : {}
        let cr = Component.reducers || {}
        return { ...pr, ...cr}
    }
   static connect(...arg) { return connectFunc(...arg) }
   static createStore(red,pc) {
      red = red || this.reducers; pc = pc || this.persistConfig || persistConfig
      const smw = this.sagaMiddleware || createSagaMiddleware()
      const configuredReducers = persistReducer(pc, red);
      return this.store = originalCreateStore(configuredReducers,applyMiddleware(thunkMiddleware,smw))
   }
   static createSagaMiddleware(...arg) { 
       return originalCreateSagaMiddleware(...arg)
   }
   static runSaga(sagas) {
      sagas = sagas || this.sagas || []
      this.sagas = Component.sagas.concat(sagas.map(sag => call(sag)))
      sagaMiddleware.run( function* rootSaga() { yield all(sagas) } )
   }
   static applyMiddleware(...arg) { return originalApplyMiddleware(...arg) }
 }


function RootComponent(props) {
   class Root extends RootClass {
      constructor(props) { super(props) }
   }
   return <Root { ...props}>{props.children}</Root>
}

module.exports = { RootComponent, RootClass }