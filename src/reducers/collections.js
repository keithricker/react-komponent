import collections from '../components/collections'

const collectionsReducer = (state = collections, action) => {
    switch(action.type) {
       case 'ADD':
          return [...state, action.payload]
       default:
          return state
    }
 }

 export default collectionsReducer