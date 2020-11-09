import React from 'react'
import {store} from './componentFunction'
import {combined as combinedReducers} from '../reducers/index'
import {combineReducers} from 'redux'
import { useSelector } from 'react-redux'
import { connect } from 'react-redux'

let combined = combinedReducers

function lowerFirst(word) {
   console.log('word!',word)
   return word.charAt(0).toLowerCase() + word.slice(1);
}

let previous = []

export default class Component extends React.Component {
    constructor(props) {
        super(props)
        console.log("in the constructor!!!!!!!!!!!!!!",this.constructor.name)
        let reducers = combined
        const dispatch = store.dispatch
        const componentName = this.constructor.name
        this.componentName = lowerFirst(componentName)
        this.originalSetState = this.setState
        this.initialized = false
        this.originalComponentDidMount = this.componentDidMount
        const thiss = this; 
        let component = this.props.component

        const stateFromStorage = Component.stateFromStorage

        const getState = () => store.getState()

        if (props.st) { 
           console.log('propsST',props.st)
        }

        this.actions = { 
            setState: (payload,comp=this.componentName) => {
                const type = comp.toUpperCase()+'_STATE_CHANGE'
                return {
                    type: type,
                    payload
                }
            },
            fetchData: (endpoint,name='fetchedData',callback,comp=thiss.componentName) => {
               return (dispatch) => {
                  dispatch(thiss.actions.fetchDataStart(comp))
                  console.log('endpoint',endpoint);
                  fetch(endpoint)
                     .then((response) => response.json())
                     .then((json) => { 
                        console.log('JSON:',json)
                        dispatch(thiss.actions.fetchDataComplete(json,callback,name))
                     })
                     .catch(error => console.log(error))
               }
            },
            fetchDataStart: (comp=thiss.componentName) => {  
               return { type: comp.toUpperCase()+'_FETCH_DATA_START' }
            },
            fetchDataComplete: (data, callback=null, name='fetchedData', comp=thiss.componentName) => {
               return { type: comp.toUpperCase()+'_FETCH_DATA_COMPLETE', payload: { [name]: data, callback } }
            }
        }

        if (!Component.customReducers)
           Component.reducers[this.componentName] = this.reducer

        if (thiss.state && !Component.statefulComponents[thiss.componentName])
            Component.statefulComponents[thiss.componentName] = thiss

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
           this.useDispatch(this.actions.setState(stateFromStorage()[key],key))
        })
        
        this.setState = function(...args) {
           let cb = () => {}
           if (arguments.length === 2 && typeof arguments[1] === 'function') {
               cb = args.pop()
           }
           // console.log('before',getState())
           thiss.originalSetState(arguments[0],(st) => {
               cb(st)
               thiss.suppressSetState = false
               console.log('doing the thing!!!!')
               this.useDispatch(thiss.actions.setState(arguments[0]))
               // console.log('New State from setState',getState())
               console.log('New State from setState',thiss.state)
           })
        }

        this.componentWillMount = (...args) => {
            console.log('------------- component WILL mount!!!! -------------')
            if (!thiss.initialized && thiss.state && Object.keys(thiss.state).length > 1) {
               const storeState = getState()[thiss.componentName] || {}
               const fetchedState = (Object.keys(storeState).length < 1) ? thiss.state : storeState
               if (JSON.stringify(thiss.state) !== JSON.stringify(storeState)) {
                  thiss.setState(fetchedState)
               }
            }
            thiss.initialized = true

            if (thiss.originalComponentDidMount)
               thiss.originalComponentDidMount(...args)
            
        }

        if (!reducers[thiss.componentName] && Component.reducers[thiss.componentName])
           Component.registerReducers()

    } 
    
    useSelector(cb) { 
       const theState = store.getState()
       const thiss = this
       const select = cb
       const us = this.useSelector
       const theSelected = select(theState)

       if (!us.subscriptions)
          us.subscriptions = new WeakMap

       if (us.subscriptions.has(select)) {
          return theSelected
       }

       if (theState === theSelected || theSelected === theState[this.componentName])
          return theSelected

       // return theState

       store.subscribe(state => {

         let newStore = store.getState()
         let newSelected = select(newStore)

         // console.log('NEWSTORE FROM SUBSCRIBE',newStore)

         let oldState = newSelected

         if (us.subscriptions.has(select))
            oldState = us.subscriptions.get(select)

         // console.log("NEW STATE from Subscribe",newSelected); console.log("OLD STATE from Subscribe",oldState)
        
          if (JSON.stringify(newSelected) !== JSON.stringify(oldState)) {
             console.log('HolA!!!!!')
             // Subscriber actions here == Update state!!
             thiss.setState({ ...thiss.state })
          }
       })
       us.subscriptions.set(select,theSelected)
       return theSelected
    }

    useDispatch(...args) {

      const reactComponentMethods = [
         'componentDidMount',
         'componentWillMount',
         'render',
         'constructClassInstance'
      ]

       const st = this.getStackTrace()
       const instance = st[0]
       const prevInstance = args[1] || st[1]
       let reactMethod
       st.some(s => {
         console.log('s',s)
         return reactComponentMethods.some(cm => {
            if (s.includes('.'+cm)) {
              reactMethod = cm
              return true
            }
         })
      })
       console.log('react method!!!!',reactMethod)
       previous.forEach((prev,ind) => previous[ind] = {...prev})
       console.log('previous',previous)
       console.log('instance!!!',instance)
       console.log('previoussss',prevInstance)
       const inLoop = this.inLoop()
       console.log('in loop',inLoop)
       console.log(this.getStackTrace())
       console.log(instance)

       const inPrevious = previous.some(prev => (prev.arg === args[0].toString()) && (prev.instance === instance) && (prevInstance === prev.prevInstance) && (reactMethod === prev.reactMethod))
       console.log('STATE',this.props)
       console.log('THIS',this)
       console.log('STORE',store.getState())
       if (inLoop || inPrevious) {
          console.log(previous)
          return
          console.log('in loop',inLoop)
          console.log('in previous',inPrevious)
          console.log('yuuueeeeppp!!!!')
       }

       previous.push({ arg:args[0].toString(), instance, prevInstance, reactMethod })
       console.log(inLoop);


      this.suppressSetState = false

      if (this.dispatches && this.dispatches.key === args[0]) {
         return
      }

      this.wrapped = this.wrapped || []

      if (this.suppressDispatch === args[0]) {
         this.suppressDispatch = false
         return
      }
       
       try { store.dispatch(args[0]) } catch(err) { console.log(err); }
       
       this.dispatches = {}
       this.suppressSetState = true

       // this.dispatching.splice(this.dispatching.indexOf(arguments[0]))
    }

    fetchData(name,endpoint,callback) {
       console.log('----------fetchData!!!--------------')
       this.useDispatch(this.actions.fetchData(endpoint,name,callback))
    }

    get reducer() {
       const thiss = this
       let dispatches
       let suppressSetState = thiss.suppressSetState
       const reducerFunction = (state=thiss.state,action) => { 


          this.reducing = true
          if (this.dispatches) {
             this.dispatches.value = action
             dispatches = this.dispatches
          }
          console.log('in the reducer !!!!!!!')
          console.log('constructor: ',this.constructor.name)
          console.log('ACTION TYPE: ',action.type)


          if (action.type === thiss.componentName.toUpperCase()+'_STATE_CHANGE') 
             return { ...state, ...action.payload }
          else if (action.type === thiss.componentName.toUpperCase()+'_FETCH_DATA_START')
             return { ...state, fetching:true }
          else if (action.type === thiss.componentName.toUpperCase()+'_FETCH_DATA_COMPLETE') {
             const callback = action.payload.callback; delete action.payload.callback
             try { 
                const newState = { ...state, fetching:false, ...action.payload } 
                console.log('setting state from FETCH_DATA_COMPLETE',newState)
                return newState
             } finally { 
                if (typeof callback === 'function') {
                   callback(action.payload)
                } 
             }
          }
          else if (thiss.customReducer)
             return thiss.customReducer(state,action)
          return state || Component.stateFromStorage(thiss.componentName) || null
        } 

        return (state=thiss.state,action) => {
           if (this.dispatching) {
              console.log('dispatching thing',this.dispatching)
              console.log('dispatches things',this.dispatches.key)
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
              thiss.originalSetState(newState)
           } else {
              console.log('SETTING STATE SUPPRESSED!!!!!!')
           }
           // thiss.originalSetState(newState,() => { throw new Error })
           return newState
        }     
    }

    getStackTrace() {
      var obj = {};
      Error.captureStackTrace(obj, this.getStackTrace);
      let stackTrace = obj.stack.split("\n    at ")
      stackTrace.forEach((st,ind) => stackTrace[ind] = st.split(' (')[0].split('http://')[0].split('https://')[0])
      stackTrace.shift()
      return stackTrace.filter(ti => ti !== "")
   }

   inLoop() { 
      const st = this.getStackTrace()
      return st.filter((s,i) => i !== 0).includes(st[0]) 
   }

    set reducer(newReducer) {
       this.customReducer = newReducer
    }

    static stateFromStorage(component) {
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
    static statefulComponents = {}
    static reducers = {}
    static get reducer() {
       console.log('hey',this)
       let key = lowerFirst(this.name)
       return (state=null, action) => {
         switch(action.type) {
            case key.toUpperCase()+'_STATE_CHANGE':
               return action.payload
            default:
               return state
         }
       }
    }
    
    static addReducers(red) {
        let comb = { ...combined, ...red }
        store.replaceReducer(combineReducers({ ...comb }))
    }
    static refreshReducers() {
       store.replaceReducer(combineReducers({ ...combined, ...Component.reducers }))
    }
    static registerReducers(red) {
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
}

export const Komponent = (Com) => {

   class ByThing extends React.Component {
      constructor(props) {
         super(props)
      }
      render() {
         const msp = (state) => {
            const ms = { mapState: {} }
            Object.keys(state).forEach(st => ms.mapState[st] = state[st])
            return ms
         }
         // let Connected = connect(msp)(Com)
         // Object.defineProperty(Connected,'name',{ value: Com.name, writable:false})
         return <Component component={Com} {...this.props}></Component>
      }
   }
   return ByThing
   
}
