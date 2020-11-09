import React from 'react'
import { combined as combinedReducers } from '../reducers/index'
import { combineReducers } from 'redux'
import { createSelector } from 'reselect'
import { connect } from 'react-redux'
import FetchingPage from './fetchingOverlayCompiled'

import '../index.css';
import { createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { all, call, put, takeEvery, takeLatest, takeLeading } from 'redux-saga/effects';

import allReducers from '../reducers'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/es/integration/react';
import { applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'

const persistConfig = {
   key: 'primary',
   storage
};

const configuredReducers = persistReducer(persistConfig, allReducers);
const sagaMiddleware = createSagaMiddleware()
export const store = createStore(configuredReducers,applyMiddleware(thunkMiddleware,sagaMiddleware))
const persistor = persistStore(store)

let combined = combinedReducers

function lowerFirst(word) {
   console.log('word!',word)
   return word.charAt(0).toLowerCase() + word.slice(1);
}

function toHash(obj) {      
   if (!obj) return 0
   let string = JSON.stringify(obj)
   var hash = 0; let char; let i
     
   if (string.length == 0) return hash; 
     
   for (i = 0; i < string.length; i++) { 
       char = string.charCodeAt(i); 
       hash = ((hash << 5) - hash) + char; 
       hash = hash & hash; 
   } 
   return hash; 
} 

const classInherit = (komp) => {
   let comp = Object.setPrototypeOf({},komp)
   while (comp = Object.getPrototypeOf(comp)) {
      if (Object.getPrototypeOf(comp) === Component)
         break
      if (Object.getPrototypeOf(comp) === React.Component) {
         Object.setPrototypeOf(comp, Component)
         break
      }
   }
}

const objInherit = (komp) => {
   let comp = Object.setPrototypeOf({},komp)
   while (comp = Object.getPrototypeOf(comp)) {
      console.log(comp.constructor.name)
      if (Object.getPrototypeOf(comp) && Object.getPrototypeOf(comp).constructor === Component)
         break
      if (Object.getPrototypeOf(comp) && Object.getPrototypeOf(comp).constructor === React.Component) {
         Object.setPrototypeOf(comp, Component.prototype)
         break
      }
   }
}

let previous = []


function Component(props) {

   let newProto = {}
   let thiss = this
   Object.setPrototypeOf(newProto,Object.getPrototypeOf(this))

   Reflect.ownKeys(Component.prototype).forEach(prop => {

      let desc = Object.getOwnPropertyDescriptor(Component.prototype,prop)
      if ('get' in desc) {
         let newDesc = { ...desc,get:desc.get.bind(thiss)}
         Object.defineProperty(newProto,prop,newDesc)
      } else if (prop !== 'constructor' && typeof Component.prototype[prop] === 'function')
         newProto[prop] = Component.prototype[prop].bind(this)

   })

   Object.setPrototypeOf(this,newProto)

   let component = props.component
   this.originalRender = this.render
   this.originalSetState = this.setState.bind(this)

   if (!props.passThrough && this.constructor !== Component) {

      let Cons = this.constructor
      let Connected = Komponent(Cons,true)

      thiss.render = function() { 
         
         let renderedComp = <Cons passThrough={true} {...props}></Cons>
         let renderThis = () => (!renderedComp._self || !renderedComp._self.state) ? renderedComp : <Connected passThrough={true} {...props}></Connected>
         let returnThis = renderThis()
         return returnThis
         return <FetchingPage component={renderThis}></FetchingPage>
      }

      Object.setPrototypeOf(thiss,React.Component.prototype)
      return thiss
      
   }



   
   if (component) {
      if (!component.registerReducers) {
         classInherit(component)
         objInherit(component.prototype)
      }
      
      component = new component(props)

      Reflect.ownKeys(component).forEach(key => {
         if (key === 'state')
            thiss.state = { ...component.state}
         else if ('key' === 'setState') {}
         else try { thiss[key] = component[key] } catch {}
      })
      Object.setPrototypeOf(thiss,Object.getPrototypeOf(component))
   }
   
   console.log("in the constructor!!!!!!!!!!!!!!",thiss.constructor.name)
   let reducers = combined
   const componentName = component ? component.constructor.name : thiss.constructor.name
   thiss.componentName = thiss.componentName || lowerFirst(componentName)

   thiss.originalComponentWillUnmount = thiss.componentWillUnmount || function() {}
   thiss.initialized = false
   thiss.originalComponentDidMount = thiss.componentDidMount 

   const stateFromStorage = Component.stateFromStorage
   const getState = () => props.selectors || props.mapState || store.getState() 

   thiss.actions = thiss.actions || { 
      setState: (payload,comp=thiss.componentName) => {
         const type = comp.toUpperCase()+'_STATE_CHANGE'
         return {
            type: type,
            payload
         }
      },
      fetchData: (endpoint,name='fetchedData',callback,comp=thiss.componentName) => {
         return async (dispatch) => {
            dispatch(thiss.actions.fetchDataStart(comp))
            console.log('endpoint',endpoint);
            let json
            if (window.__PRELOADED_STATE__[name]) {
               json = window.__PRELOADED_STATE__[name]
               console.error('we have preloaded state!')
               throw new Error
            }  else { 
               json = await fetch(endpoint)
               json = await json.json()
            }
            console.log('JSON:',json)
            setTimeout(
               () => {
                  let res = dispatch(thiss.actions.fetchDataComplete(json,callback,name))
                  if (typeof callback === 'function') callback(res)
               },5000
            )
         }
      },
      fetchDataStart: (comp=thiss.componentName,callback=null) => {  
         let name = comp
         return { type: comp.toUpperCase()+'_FETCH_DATA_START', callback, name }
      },
      fetchDataComplete: (data, callback=null, name='fetchedData', comp=thiss.componentName) => {
         console.log('in the fetch complete')
         return { type: comp.toUpperCase()+'_FETCH_DATA_COMPLETE', payload: { [name]: data, callback } }
      }
   }

   if (!Component.customReducers)
      Component.reducers[thiss.componentName] = thiss.reducer

   if (!Component.statefulComponents[thiss.componentName]) {
      Component.statefulComponents[thiss.componentName] = thiss
      if (thiss.sagas) {
         sagaMiddleware.run(Component.rootSaga)
      }
   }  

   let fromLocal = stateFromStorage(); let fromStore = getState()

   let untracked = {}; let replenish = {}
   Object.keys(fromLocal).forEach(key => {
      if (!fromStore[key]) replenish[key] = fromLocal[key]
      if (!fromStore[key] && !Component.reducers[key]) {
         console.log('got one',key,fromLocal[key])
         untracked[key] = (state=null, action) => {
            switch(action.type) {
               case key.toUpperCase()+'_STATE_CHANGE':
                  return action.payload
               default:
                  return state
            }
         }
      }
   })
   
   if (Object.keys(untracked).length > 1) {
      console.log('untracked!', untracked)
      combined = { ...combined, ...untracked }
      store.replaceReducer(combineReducers({ ...combined, ...Component.reducers }))
      console.log('store from untracked:',store.getState())
   }

   Object.keys(replenish).forEach(key => {
      thiss.useDispatch(thiss.actions.setState(stateFromStorage()[key],key))
   })
   
   thiss.setState = function(...args) {
      let cb = () => {}
      if (arguments.length === 2 && typeof arguments[1] === 'function') {
         cb = args.pop()
      }
      // console.log('before',getState())
      thiss.originalSetState(arguments[0],(st) => {
         cb(st)
         thiss.suppressSetState = false
         console.log('setting state from originalsetstate',arguments[0])
         thiss.useDispatch(thiss.actions.setState(arguments[0]))
         // console.log('New State from setState',getState())
         console.log('New State from setState',thiss.state)
      })
   }

   thiss.componentWillUnmount = function() {
      thiss.originalComponentWillUnmount()            
      const subs = thiss.useSelector.subscriptions
      if (!subs) return
      const unsubs = subs.get(thiss) || []
      unsubs.forEach(unsub => unsub())
   }

   thiss.componentDidMount = (...args) => {
      console.log('------------- component DID mount!!!! -------------')
      console.log('getstat',thiss)

      console.log('thiss component in Component Did Mount',thiss)
      console.log('component',Object.create(Component))
      if (!thiss.initialized && thiss.state && Object.keys(thiss.state).length > 1) {
         const storeState = props.selectors || props.mapState || getState()[thiss.componentName] || {}
         const fetchedState = (Object.keys(storeState).length < 1) ? thiss.state : storeState
         if (JSON.stringify(thiss.state) !== JSON.stringify(storeState)) {
            thiss.setState(fetchedState,() => console.log('things!!!!!!!!!!'))
         }
      }
      thiss.initialized = true

      if (thiss.originalComponentDidMount)
         thiss.originalComponentDidMount(...args)
   }

   thiss.render = function() {


      

      let Rendered = thiss.originalRender.bind(thiss)
      return <FetchingPage component={Rendered} fetching={(thiss.state && thiss.state.fetching) ? true : false}></FetchingPage>



      
   }

   if (!reducers[thiss.componentName] && Component.reducers[thiss.componentName])
      Component.registerReducers()

}
Component.prototype.getState = function() { 
   const thiss = this
   return thiss.props.selectors || thiss.props.mapState || store.getState()
}
Component.prototype.useState = function(initial) {
   let nextKey = 0
   if (this.state) {
      Object.keys(this.state).forEach(key => {
         if (typeof key === 'number')
            nextKey = key+1
      })
   }
   let stateMirror = { nextKey:initial }
   setTheState(initial)

   function setTheState(newState) {
      let thisState = this.state ? {...this.state} : {}
      stateMirror[nextKey] = newState
      this.setState(...thisState, ...stateMirror)
   }
   
   return [stateMirror[nextKey],setTheState]
}
Component.prototype.useSelector = function(...cb) { 
   const thiss = this
   const theState = thiss.props.selectors || thiss.props.mapState || store.getState() 
   const select = cb[0]

   let selector = createSelector(...cb,(things) => things)
   return selector(theState)

   const us = this.useSelector
   const theSelected = select(theState)

   if (!us.subscriptions)
      us.subscriptions = new WeakMap

   if (us.subscriptions.has(select))
      return theSelected

   if (theState === theSelected || theSelected === theState[this.componentName])
      return theSelected

   // return theState

   const unsub = store.subscribe(state => {

      let newStore = thiss.props.mapState || store.getState()
      let newSelected = select(newStore)

      // console.log('NEWSTORE FROM SUBSCRIBE',newStore)

      let oldState = newSelected

      if (us.subscriptions.has(select))
         oldState = us.subscriptions.get(select)

      // console.log("NEW STATE from Subscribe",newSelected); console.log("OLD STATE from Subscribe",oldState)
      if (toHash(newSelected) !== oldState) {
         console.log('HolA!!!!!')
         // Subscriber actions here == Update state!!
         thiss.setState({ ...thiss.state })
         us.subscriptions.set(select,toHash(newSelected))
      }
   })
   const unsubs = us.subscriptions.get(thiss) || []
   us.subscriptions.set(thiss,[...unsubs,unsub])
   us.subscriptions.set(select,toHash(theSelected))
   return theSelected
}

Component.prototype.useDispatch = function(...args) {

   const thiss = this.component || this
   const reactComponentMethods = [
      'componentDidMount',
      'componentWillMount',
      'componentWillUnmount',
      'render',
      'constructClassInstance'
   ]

   const st = thiss.getStackTrace()
   const instance = st[0]
   const prevInstance = args[1] || st[1]
   let reactMethod
   st.some(s => {
      return reactComponentMethods.some(cm => {
         if (s.includes('.'+cm)) {
            reactMethod = cm
            return true
         }
      })
   })

   previous.forEach((prev,ind) => previous[ind] = {...prev})
   const inLoop = thiss.inLoop()
   console.log('in loop',inLoop)
   console.log(instance)

   const inPrevious = previous.some(prev => (prev.arg === args[0].toString()) && (prev.instance === instance) && (prevInstance === prev.prevInstance) && (reactMethod === prev.reactMethod))
   console.log('STATE',thiss.props)
   console.log('THIS',thiss)
   try { console.log('STORE',store.getState()) } catch {}
   if (inLoop || inPrevious) {
      console.log('stuck in a loop - getting out ...')
      throw new Error
      console.log(previous)
      return
   }

   previous.push({ arg:args[0].toString(), instance, prevInstance, reactMethod })
   console.log(inLoop);

   thiss.suppressSetState = false

   if (thiss.dispatches && thiss.dispatches.key === args[0]) {
      console.log('already dispatching this -- bailing ...')
      return
   }

   thiss.wrapped = thiss.wrapped || []

   if (thiss.suppressDispatch === args[0]) {
      console.log('suppressing dispatch ...')
      thiss.suppressDispatch = false
      return
   }

   let dispatch = thiss.props.dispatch || store.dispatch
   
   console.log(args[0])
   try { dispatch(args[0]) } catch(err) { 

      console.log(err); 
      console.log(this.getStackTrace())
   }
   
   thiss.dispatches = {}
   thiss.suppressSetState = true

   // this.dispatching.splice(this.dispatching.indexOf(arguments[0]))
}

Component.prototype.fetchData = function(name,endpoint,callback) {
   const thiss = this
   console.log('----------fetchData!!!--------------')
   thiss.useDispatch(thiss.actions.fetchData(endpoint,name,callback))
}

Component.prototype.selector = function(...selectorFuncs) {
   const thiss = this; let state; let props=this.props
   if (typeof arguments[0] === 'object') 
      state = selectorFuncs.shift()
   if (typeof arguments[0] === 'object')
      props = selectorFuncs.shift()
   
   selectorFuncs = (selectorFuncs && selectorFuncs.length > 0) ? selectorFuncs : [(items) => items]
   const defaultSelector = (defState) => defState[thiss.componentName]

   let selector = createSelector(
      defaultSelector,
      ...selectorFuncs
   )
   return state ? selector(state,props) : selector
}

Object.defineProperty(Component.prototype,'reducer',{ 
   get: function() {
      const thiss = this
      let dispatches
      let suppressSetState = thiss.suppressSetState
      const reducerFunction = (state=thiss.state,action) => { 

         thiss.reducing = true
         if (thiss.dispatches) {
            thiss.dispatches.value = action
            dispatches = thiss.dispatches
         }
         console.log('in the reducer !!!!!!!')
         console.log('constructor: ',thiss.constructor.name)
         console.log('ACTION TYPE: ',action.type)

         if (action.type === thiss.componentName.toUpperCase()+'_STATE_CHANGE') 
            return { ...state, ...action.payload }
         else if (action.type === thiss.componentName.toUpperCase()+'_FETCH_DATA_START')
            return { ...state, fetching:true }
         else if (action.type === thiss.componentName.toUpperCase()+'_FETCH_DATA_COMPLETE') {
            console.log('here we are!')
            delete action.payload.callback
            const newState = { ...state, fetching:false, ...action.payload } 
            console.log('setting state from FETCH_DATA_COMPLETE',newState)
            return newState
         }
         else if (thiss.customReducer)
            return thiss.customReducer(state,action)
         return state || Component.stateFromStorage(thiss.componentName) || null
      } 

      return (state=thiss.state,action) => {
         if (thiss.dispatching) {
            console.log('dispatching thing',thiss.dispatching)
            console.log('dispatches things',thiss.dispatches.key)
            console.log('--------------------------------')
         }
         console.log('REDUCER FUNCTION START!!!!')
         console.log('original state')
         const newState = reducerFunction(state,action)
         console.log("REDUCER FUNCTION COMPLETE!!!!!",newState)
         console.log("EQUAL", thiss.state === newState)
         console.log('state',thiss.state, 'new',newState)

         suppressSetState = ((newState === thiss.state) || (action.type.includes('@@'))) ? true : false

         if (dispatches) {
            console.log('supress dispatch:')
            thiss.suppressDispatch = dispatches.key
         }
         if (!suppressSetState) {
            console.log('NO SUPPRESS SETSTATE -- ORIGINAL SET STATE')
            console.log('before',thiss.state)
            console.log('newState',newState)
            thiss.originalSetState.call(thiss,newState, () => { console.log('after',thiss.state); })
         } else {
            console.log('New = Old', newState === thiss.state);
            console.log('action type', action.type)
            console.log('SETTING STATE SUPPRESSED!!!!!!')
         }
         // thiss.originalSetState(newState,() => { throw new Error })
         return newState
      }     
   },
   set: function(newReducer) {
      this.customReducer = newReducer
   }
})

Component.prototype.saga = {}
Component.prototype.saga.takeLatest = takeLatest
Component.prototype.saga.takeEvery = takeEvery
Component.prototype.saga.takeLeading = takeLeading
Component.prototype.saga.call = call
Component.prototype.saga.put = put

Component.prototype.getStackTrace = function() {
   const thiss = this
   let stackTrace; let stack
   stack = new Error().stack
   stackTrace = stack.split("\n")
   stackTrace.forEach((st,ind) => {
      let returnVal = st.split('@')[0]
      if (returnVal.includes(' (')) returnVal = returnVal.split(' (')[0]
      if (returnVal.includes('    at ')) returnVal = returnVal.split('    at ')[1] 
      stackTrace[ind] = returnVal
   })
   stackTrace.shift(); stackTrace.pop()
   if (stackTrace[0].includes('getStackTrace')) stackTrace.shift()
   return stackTrace.filter(ti => ti !== "")
}

Component.prototype.inLoop = function() { 
   const thiss = this
   console.log('thisssssssssss',thiss)
   const st = thiss.getStackTrace()
   return st.filter((s,i) => i !== 0).includes(st[0]) 
}

Component.stateFromStorage = function(component) {
   let storageState = localStorage.getItem('persist:root')
   try {
      storageState = storageState ? JSON.parse(storageState) : null
   } catch { return {} }

   if (!storageState) return {}
   
   let returnState = {}
   Object.keys(storageState).forEach(item => { 
      try {
            returnState[item] = JSON.parse(storageState[item])
      } catch { returnState[item] = {} }
   })  
   if (component) return returnState[component]
   return returnState        
}
Component.statefulComponents = {}
Component.reducers = {}
Object.defineProperty(Component,'reducer',{ 
   get: function() {
      const thiss = this
      let key = lowerFirst(thiss.name)
      return (state=null, action) => {
         switch(action.type) {
            case key.toUpperCase()+'_STATE_CHANGE':
               return action.payload
            default:
               return state
         }
      }
   }
})

Object.defineProperty(Component,'mapStateToProps',{ 
   get: function() {
      let mapStates = []
      let comp
      Object.keys(Component.statefulComponents).forEach(key => {
         comp = Component.statefulComponents[key]
         if (comp.mapStateToProps)
            mapStates = comp.mapStateToProps.concat(mapStates)
      })
      if (mapStates.length > 0)
         return mapStates
   }
})

Object.defineProperty(Component,'rootSaga',{ 
   get: function() {
      const sagas = []
      let comp
      console.log('hey!!!',Component.statefulComponents)
      Object.keys(Component.statefulComponents).forEach(key => {
         comp = Component.statefulComponents[key]
         if (comp.sagas)
            comp.sagas().forEach(sag => sagas.push(call(sag)))
      })
      if (sagas.length > 0)
         return function* rootSaga() {
            yield all(sagas)
         }
   }
})
Component.addReducers = function(red) {
   let comb = { ...combined, ...red }
   store.replaceReducer(combineReducers({ ...comb }))
}
Component.refreshReducers = function() {
   store.replaceReducer(combineReducers({ ...combined, ...Component.reducers }))
}
Component.registerReducers = function(red) {
   if (red) {
      Component.reducers = red
      Component.customReducers = true
   } else {
      Component.customReducers = false
   }
   try {
      Object.keys(Component.reducers).some(redu => {
         if (!store.getState()[redu])
            Component.refreshReducers()
      })
   } catch {}
}
Object.setPrototypeOf(Component.prototype,React.Component.prototype)
Object.setPrototypeOf(Component,React.Component)

function Komponent(Com,bypassInherit=false) {
   const thiss = Com
   
   if (!bypassInherit) {
      classInherit(Com)
      objInherit(Com.prototype)
   }

   const msp = (state,prps) => {
      const ms = { 
         mapState: {},
         selectors: {}
      }
      Object.keys(state).forEach(st => { 
         ms.mapState[st] = state[st]
         ms.selectors[st] = createSelector(sta => sta[st],(s) => s)(state)
      })
      if (thiss.mapStateToProps) {
         Reflect.ownKeys(thiss.mapStateToProps).forEach(key => { 
            ms.mapState[key] = createSelector(thiss.mapStateToProps[key],(items) => items)(state,prps)
         })
      }    
      return ms
   }
   const mdp = thiss.mapDispatchToProps || null
   let Connected = mdp ? connect(msp,mdp)(Com) : connect(msp)(Com)
   Object.defineProperty(Connected,'name',{ value: Com.name, writable:false})

   return Connected

}

const RootComponent = (props) => {
   return (
      <React.StrictMode>
         <BrowserRouter>
            <Provider store={store}>
            <PersistGate persistor={persistor}>
               {props.children}
            </PersistGate>
            </Provider>
         </BrowserRouter>
      </React.StrictMode>
   );
 }

 export { Component, RootComponent }