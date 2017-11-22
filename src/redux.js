import { createStore } from 'redux'
import { createLogger } from 'redux-logger'

// import firebase from './firebase.js';

export const logger = createLogger({
  // ...options
});

export const initialState = {
      user: null,
      threads: [],
}

function jsonToList(data){
      let list = []
      for( var i in data ){
	    list.push({ "id": i, "data": data[i]})
      }
      return list
}


export const reducer = (state = initialState, action) => {
      switch (action.type){
	    case "USER_CHANGED":
		  state = {
			...state,
			user: action.payload
		  }
		  break
	    case "FIREBASE_THREAD_CHANGE":
		  state = {
			...state,
			threads: jsonToList(action.payload)
		  }
		  break
      }
      return state
}

const store = createStore(reducer)
export default store

// const threadRef = firebase.database().ref("/threads")
// threadRef.on("value",snap => {
//       let threadList = jsonToList(snap.val())
//       store.dispatch({
// 	    type: "FIREBASE_THREAD_CHANGE",
// 	    payload: threadList
//       })
// })

