const userState = {
    loggedUser: null,
    dbUser: null,
    displayName: '',
    email: '',
    password: '',
    loggingIn: false,
    loggingOut: false,
    method: ''
}
const userReducer = (state=userState, action) => {
    switch(action.type) {
       case 'USER_STATE_CHANGE':
          return { ...state, ...action.payload }
       default:
           return state
    }
 }

 export default userReducer