import counterReducer from './counter'
import isLoggedReducer from './isLogged'
import userReducer from './user'
import collectionsReducer from './collections'
import {combineReducers} from 'redux'
export const combined = {
    counter:counterReducer,
    collections: collectionsReducer,
    isLogged: isLoggedReducer,
}
export default combineReducers(combined)