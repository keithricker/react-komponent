import React from 'react'
import server from '../../server/modules'
import ReactDom from 'react-dom'
import ReactDOMServer from 'react-dom/SSR'
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
import { all, call } from 'redux-saga/effects' 
import { cloneProxy,dynamicImport,sequence } from './helpers/utilsCompiled'

import vars from './Komponent/privateVariables'
// import Component from './componentFunctionCompiled'
let url = window.location.href.slice(0,-1)

const persistConfig = { 
    key: 'primary',
    storage
};

const originalCreateStore = createStore
const originalApplyMiddleware = applyMiddleware
const originalCreateSagaMiddleware = createSagaMiddleware
let socketio 
let socketEvents = []

let domEvents = {
   appDidMount: new Event('appDidMount',{ bubbles:true }),
   appRender: new Event('appRender',{ bubbles:true })
}

class RootClass extends React.Component {
   constructor(props) {
        super(props)

        if (this.constructor.hasOwnProperty('extension')) {
            throw new Error("The "+this.constructor.name+" class is intended to be a root-level component."
            +" it is therefore not intended to have more than one instance. Try extending the "+this.constructor.name+
            " class (not guaranteed to be stable), or create a new RootComponent if you wish to have multiple instances.")
        }

        const rcVars = vars(RootClass)
        rcVars.extension = (cb) => cb(this.constructor)
        const classVars = vars(this.constructor)
        const thisVars = vars(this)

        if (rcVars.extensionCallbacks.length) 
           sequence(rcVars.extensionCallbacks.map(cb => {
              return () => cb(this.constructor)
           }))

        classVars.instances = classVars.instances || []
        classVars.instances.push(this)
        const thiss = this
        const proto = Object.getPrototypeOf(this)

        Object.keys(props).forEach(key => { 
           if (!proto[key]) thiss[key] = props[key] 
        }) 

        this.sagaMiddleware = this.sagaMiddleware || createSagaMiddleware()
        this.sagas = this.sagas || []

        let combinedProps = [ ...Reflect.ownKeys(Object.getPrototypeOf(this)), ...Object.keys(this) ]
        combinedProps.forEach(key => {
            if (!this.constructor[key]) {
                this.constructor[key] = Reflect.get(thiss,key,thiss)
            }
        })
        this.store = this.store || this.constructor.createStore()
        let originalGetState = this.store.getState.bind(this.store)
        this.store.getState = function getState(...arg) {
           try { return originalGetState(...arg) } catch { return RootClass.snapShot || {} }
        }
        RootClass.snapShot = this.store.getState() || RootClass.snapShot
        const unsubscribe = this.store.subscribe(() => { RootClass.snapShot = this.store.getState() || RootClass.snapShot })
        if (this.sagas.length) 
           this.constructor.runSaga()
   }
   register(komp) {
      let kompClasses = vars(this).KomponentClasses = vars(this).KomponentClasses || {}
      if (!kompClasses[komp.name])
         kompClasses[komp.name] = []
      kompClasses[komp.name].push(komp)
   }
   get komponents() { return { ...vars(this).Komponents } }
   get domNode() { 
      console.log('SEEEEEEEE',this.constructor.DOM)
      return this.constructor.DOM(this)
   }
   createEvent(name) {
      domEvents[name] = new Event(name,{ bubbles:true })
      return domEvents[name]
   }
   dispatchEvent(event) { 
      return this.domNode.dispatchEvent(event) 
   }
   componentDidMount() {
      dispatchEvent('appDidMount')
   }
   componentWillUnMount() {
      dispatchEvent('componentWillUnmount')
   }
   render() {
      let persistor = this.persistor || persistStore(this.store)
      this.dispatchEvent('appRender')
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
    static get extension() { return vars(this).extension }
    static get instances() { return vars(this).instances }
    static get combinedReducers() {
       return combineReducers(this.reducers)
    }
    static get configuredReducers() {
       return persistReducer(this.persistConfig || persistConfig, this.combinedReducers);
    }
    static get reducers() {
        let instances = vars(this).instances || []
        let theReducers = {}
        instances.forEach(inst => Object.assign(theReducers,inst.reducers))
        return theReducers
   }
   static connect(...arg) { return connectFunc(...arg) }
   static createStore(red,pc) {

      red = red || this.reducers
      if (typeof red !== 'function') {
         red = combineReducers(red)
      }
      pc = pc || this.persistConfig || persistConfig
      const smw = arguments[0] ? createSagaMiddleware() : this.sagaMiddleware 
    
      const configuredReducers = persistReducer(pc, red);
      const appliedMiddleware = applyMiddleware(thunkMiddleware,smw)
      
      let str = originalCreateStore(configuredReducers,appliedMiddleware)
      if (!arguments[0]) this.store = str
      return str
   }
   static createSagaMiddleware(...arg) { 
      return originalCreateSagaMiddleware(...arg)
   }
   static runSaga(sagas=[]) {
      const thiss = this
      if (typeof this.sagas === 'function') this.sagas = this.sagas()
      if (typeof sagas === 'function') sagas = sagas() 
      
      sagas = this.sagas.concat(sagas)
      sagas = sagas.map(sag => call(sag))
      this.sagaMiddleware.run( function* rootSaga() { yield all(sagas) } ) 
   }
   static applyMiddleware(...arg) { return originalApplyMiddleware(...arg) }
   static get server() { return window.reactSSR }
   static get socket() { 
      
      /*
      if (!socketio) dynamicImport('socket.io-client',(module) => {
         socketio = module.io(url)
         socketio.on('connect',() => {
            Array(...socketEvents).forEach(callback => callback())
            socketEvents = []
         })
      })
      */
      if (socketio && socketio.connected) return socketio
      return new Proxy(socketio || {},{ 
         get: function(sock,prop) {
            if (!socketio || typeof sock[prop] === 'function') { 
               return function(...arg) { 
                  sock = socketio || sock
                  if (!sock.connected) {
                     console.error('no socket connection')
                     socketEvents.push(() => {
                        if (typeof sock[prop] === 'function')
                           sock[prop](...arg)
                     })
                     return
                  } else {
                     console.log(`socket ${prop}'ing .............`,prop)
                     return sock[prop](...arg)
                  }
               }
            }
            return sock[prop]
         }
      }) 
   }
   static get DOM() { 
      let theHtml = vars(this).htmlDom
      if (!theHtml) theHtml = vars(this).htmlDom = document.getElementsByTagName('html')[0]
      let handler = {
         get(ob,prop) { 
            if (prop === 'events') return { ...domEvents } 
            return theHtml[prop] || ReactDom[prop]
         },
         set(ob,prop,val) { 
            theHtml[prop] = val; return true
         }
      } 
      let theDOM = vars(this).DOM 
      if (!theDOM) vars(this).DOM = new Proxy(function DOM() {
         let comp = args[0]
         if (vars(comp).domNode) return vars(comp).domNode 
         vars(comp).domNode = ReactDOM.findDOMNode(comp)
         let dE = vars(comp).domNode.dispatchEvent
         proto.set(proto.get())
         vars(comp).domNode.dispatchEvent = function(event) {
            event = (typeof event === 'string') ? domEvents[event] : event
            return dE.call(comp,event)
         }
         vars(comp).domNode.createEvent = function createEvent(name) {
            domEvents[name] = new Event(name,{ bubbles:true })
         }
         return vars(comp).domNode
      },handler)
      console.log(vars(this).DOM())
      throw new Error()
      return theDOM
   }
 }
 RootClass.snapShot = {}
 RootClass.preloadedState = server.preloadedData || window.__PRELOADED_STATE__ || {}
 vars(RootClass).extensionCallbacks = []
 vars(RootClass).extension = function(cb) {
    let cbs = vars(RootClass).extensionCallbacks
    cbs.push(cb)
 }

function RootComponent(props) {
   class Root extends RootClass {
      constructor(props) { super(props) }
   }
   return <Root { ...props}>{props.children} </Root>
}

export { RootComponent, RootClass }