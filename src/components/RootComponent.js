import React from 'react'
import { combineReducers } from 'redux'
import { connect as connectFunc } from 'react-redux'

import { createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'

import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/es/integration/react';
import { applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import Component from './componentFunctionCompiled'

const persistConfig = { 
    key: 'primary',
    storage
}; 

class RootComponent extends React.Component {
   constructor(props) {
        super(props)

        const thiss = this
        Object.keys(props).forEach(key => { 
           if (key !== 'reducers') thiss[key] = props[key] 
        })      

        this.sagaMiddleware = this.sagaMiddleware || createSagaMiddleware()
        this.store = this.store || this.createStore(this.reducers,this.persistConfig || persistConfig)

        let combinedProps = [ ...Reflect.ownKeys(Object.getPrototypeOf(this)), ...Object.keys(this) ]
        combinedProps.forEach(key => {
            if (!RootComponent[key]) {
                Object.defineProperty(RootComponent,key,{ 
                    get: function() { return Reflect.get(thiss,key,thiss) }
                })
            }
        })
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
   get combinedReducers() {
      return combineReducers(this.reducers)
   }
   get reducers() {
       let pr = (this.props && this.props.reducers) ? this.props.reducers : {}
       let cr = Component.reducers || {}
       return { ...pr, ...cr}
   }
   createStore(reducers, pc) {
       this.props = { ...this.props, reducers: reducers || this.props.reducers }
       pc = pc || this.persistConfig || persistConfig
       this.configuredReducers = persistReducer(pc, this.combinedReducers);
 
       console.log('configuredReducers',this.configuredReducers)
       console.log('args thunkMiddleware',thunkMiddleware)
       console.log('args sagaMiddleware',this.sagaMiddleware)
       console.log('applyMiddlewear',applyMiddleware(thunkMiddleware,this.sagaMiddleware))
       this.store = createStore(this.configuredReducers,applyMiddleware(thunkMiddleware,this.sagaMiddleware))
       
       return this.store
   }
   connect(...arg) { return connectFunc(...arg) }
 }

module.exports = RootComponent