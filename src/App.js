import React from 'react';
import logo from './logo.svg';
import './App.css';
import { add,increment,decrement } from './actions'
import { Route, Switch } from 'react-router-dom'
import User from './components/signIn'

import { Component } from './components/componentFunction'

export class Posts extends Component {
   constructor(props) {
      super(props)
      const thiss = this
      this.state = {
         posts: [{title:'fun'},{title:'fun'}]
      }
   }
   fetchPosts(callback) {
      let dispatch = this.props.dispatch || this.useDispatch
      dispatch(this.actions.fetchDataStart('posts',callback))
   }
   componentDidMount() {
      const thiss = this
      console.log('---------component did mount----------')
      console.log('thiz',this)
      this.fetchPosts(() => thiss.setState({posts:[{title:'Another cool post!'}, ...thiss.state.posts]}, () => { console.log('the state after fetching',thiss.state);  }))
      console.log('next function call !!!!!!!!!!!!!!!!!')
      // throw new Error
   }
   sagas() { 
      const thiss = this
      function* fetchDataAsync(action) {
         let callback = action.callback
         let name = action.name || thiss.componentName
         console.log('trying ....')
         const delay = (ms) => new Promise(res => setTimeout(res, ms))
         
         let data
         try {
            if (window.__PRELOADED_STATE__[name]) {
               data = window.__PRELOADED_STATE__[name]
               console.error('we have preloaded state!')
            } else {
               const fetchedData = yield thiss.saga.call(fetch,'https://jsonplaceholder.typicode.com/posts')
               data = yield fetchedData.json()
            }
            yield delay(5000)
            let res = yield thiss.saga.put(thiss.actions.fetchDataComplete(data,callback,name))
            if (callback) action.callback()
            return res
         } catch (error) {
            console.error(error.message)
         }       
      }
      return [
         function* fetchDataStart() {
            yield thiss.saga.takeLatest('POSTS_FETCH_DATA_START', fetchDataAsync);
         }         
      ]
   }
   render() { 
      let thiss = this
      
      console.log('-------------render------------------')
      console.log('this component at render',thiss)
      if (this.props.mapState) console.log('THEEPOSTS',this.props.mapState.posts)
      let posts = this.state.posts || this.state.posts.posts || []
      console.log("SELECTOR",this.selector())
      

      return ( 
         <div>
            <h1>Post Titles:</h1>
            { console.log('STATE POSTS IN RENDER',thiss.state.posts) }
            { 
            // console.log('GET STATE IN RENDER',store.getState()) 
            }
            {
               posts.map(post => { return <h2>{post.title}</h2> })
            }
            {  }
         </div>
      )
   }
}


class App extends Component {
   constructor(props) {
      super(props)
   }
   render() { 
      let thiss = this
      // const staatee = this.useSelector(state => state)
      const counter = this.useSelector(state => state.counter)
      const user = this.useSelector(state => state.user)
      const isLogged = user && user.dbUser ? true : false
      const collections = this.useSelector(state => state.collections)

      console.log('collections',collections)

      const hatsPage = (props) => {
         let wildcard = props.match.params ? props.match.params.wildcard : null
         if (wildcard) wildcard = wildcard.charAt(0).toUpperCase()+wildcard.slice(1)
         return (
            <div className="App">
               <h1>Many, many {wildcard}!</h1>
            </div>
         )
      }

      const wankPage = (props) => {
        return (
           <div className="App">
              <h1>Many wanks! {props.match.params.wanker}</h1>
           </div>
        )
      }

      const Main = (pr) => { 
        return (
        <div className="App">
          <header className="App-header">
            <Posts></Posts>
            <h2>Counter: {counter}</h2>
            {isLogged ? <h3>Information for logged-in user only.</h3> : ''}
            <button onClick={() => thiss.useDispatch(add({name:'anotherOne',id:4}))}>ADD</button>
            <button onClick={() => thiss.useDispatch(increment())}>+</button>
            <button onClick={() => thiss.useDispatch(decrement())}>-</button>
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
        </div>
      )};

      return (
      <div>
            <Route path="/hats/:wildcard" exact component={hatsPage}></Route>
            <Route exact path="/" render={(pr) => <Main {...pr}></Main>}></Route>
            <Route exact path="/user" component={User}></Route>
            <Route path="/wank/:wanker" component={wankPage}></Route>
      </div>

   )}
}

Component.registerReducers({ user: User.reducer, posts: Posts.reducer })
export default App;
