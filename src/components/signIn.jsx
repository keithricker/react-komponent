import React from 'react'
import { auth } from '../firebase/firebase'
import { signInWithGoogle, createUserProfileDocument, firestore } from '../firebase/firebase'
import Component from '../components/component'

const updateUserField = (email,update) => {
   firestore.collection("users").where("email", "==", email).get().then(gt => { 
      const docs = gt.docs
      docs.forEach(doc => {
         const docRef = doc.ref
         docRef.update(update)
      })
   })
}
/*
class SignIn extends React.Component {
   constructor(props) {
      super(props)
      this.state = props.user
      this.setTheState = function(...args) {
         this.setState(...args)
         props.newState(arguments[0])
      }
   }
   */
class User extends Component {
   constructor(props) {
      super(props)
      this.state = {
         loggedUser: null,
         dbUser: null,
         displayName: '',
         email: '',
         password: '',
         loggingIn: false,
         loggingOut: false,
         method: ''
      }
   }
   componentDidMount() {
      console.log('component mounting')
      let thiss = this;
      let loggedUser; let displayName; let email; let password; let dbUser; let loggingOut; let loggingIn;
      thiss.unAuth = auth.onAuthStateChanged(async function(user) {
         console.log('entering auth state change hook')
         if (thiss.state.loggingOut) {
            updateUserField(thiss.state.dbUser.email,{loggedIn:false})
            thiss.setState({ loggedUser:null,dbUser:null, method: null, loggingOut:false },() => console.log('setting state from auth state change -- user is logging out'))
            return
         }
         if (!user) return
         if (thiss.state.loggingIn) { 
            loggedUser = user
            updateUserField(user.email,{loggedIn:true})
         }
         email = user.email
         displayName = user.displayName
         password = ''
         dbUser = await createUserProfileDocument(user,{})
         dbUser = dbUser ? dbUser.loggedUser : null
         dbUser = dbUser || user
         thiss.setState({loggedUser, dbUser, email,displayName,password,loggingIn:false},() => {console.log('setting state from auth state change callback',thiss.state)})
         // if (!loggedUser) { signInWithGoogle() }
      })
      this.setState({loggedUser,email,displayName,password,dbUser},() => console.log('setting state after component mounting',this.state))
   }
   // componentWillUnmount() { console.log('unmounting'); this.unAuth() }
   render() {
      console.log('rendering',this.state)
      console.log()
      const thiss = this
      const handleGoogle  = event => {
         console.log('signing in with google')
         thiss.state.method = 'google'
         thiss.state.loggingIn = true
         event.preventDefault()
         if (thiss.state.dbUser) {
            const userRef = firestore.doc(`users/${thiss.state.dbUser.uid}`);
            const snapShot = userRef.get().then(res => {
               if (!res.exists) { signInWithGoogle(); return }
               thiss.setState({loggedUser:res},() => console.log('setting state from snapShot from google sign in'))
            })
         } else {
            signInWithGoogle().then(sign => {
               if (sign.user) {
                  thiss.setState({loggedUser:sign.user,dbUser:sign.user},() => console.log('setting state from google signin'))
               } else { }
            })
         }
      }
      const handleSignIn = event => {
         thiss.state.method = 'email'
         thiss.state.loggingIn = true
         const { email,password } = thiss.state
         console.log('signing in with email and pass')
         event.preventDefault()
         let signin = auth.signInWithEmailAndPassword(email,password)
         .then(sign => {
            alert('signin success')
            thiss.setState({loggedUser:sign.user,dbUser:sign.user},() => console.log('setting state from user signin'))
         })
         .catch(err => alert('signin fail: '+err.message))
      }
      const handleSubmit = event => {
         console.log('submit event',event.target)
         event.preventDefault()
      }
      const handleChange = event => {
         console.log('event-on-change',event.target)
         const { name,value } = event.target
         thiss.setState({[name]: value},() => console.log('setting state from handlechange'))
      }
      const signOut = event => {
         console.log('signing out')
         this.state.loggingOut = true
         auth.signOut()
      }
      const newUser = event => {
         thiss.state.method = 'new signup'
         thiss.state.loggingIn = true
         const { email,password } = thiss.state
         console.log('new user')
         event.preventDefault()
         let signin = auth.createUserWithEmailAndPassword(email, password)
         .then(sign => {
            alert('signup success')
            console.log('sign',sign)
            console.log('state before setting',thiss.state)
            thiss.setState({loggedUser:sign.user,dbUser:sign.user},() => console.log('setting state from new user signup',thiss.state))
         })
         .catch(err => alert('sign up fail: '+err.message))
      }
      return (
      <div className="App">
         {
         !this.state.loggedUser ?
         <div>
         <h2 id="signInHeader">Sign In Here!!!!</h2>
         <h2>I already have an account</h2>
         <form onSubmit={handleSubmit}>
            <label>email:</label><br />
            <input type="email" name="email" onChange={handleChange} required value={this.state.email} /><br />
            <label>password:</label><br />
            <input type="password" name="password" onChange={handleChange} value={this.state.password} />
            <input type="submit" value="Submit"></input>
         </form>
         <button onClick={(event) => handleSignIn(event)}>Sign in with your email and password.</button>
         <button onClick={(event) => handleGoogle(event)}>Sign in with Google</button>
         <button onClick={(event) => newUser(event)}>Sign up with Email and password.</button>
         </div>
         : <div>
            <h1>You are logged in with {thiss.state.method}</h1>
            {console.log('me!!!',this.state)}
            <button onClick={() => signOut()}>Sign Out</button>
         </div>
         }  
      </div>
      )
   }
}
export class Random extends Component {
   constructor(props) {
      super(props)
      this.state = {
         thing1: 'thing1',
         thing2: 'thing2'
      }
   }
   render() {
      console.log('random state',this.useSelector(state => state))
      return <div>This is very random</div> 
   }
}

export default User