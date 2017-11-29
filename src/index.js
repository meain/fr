import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'

import firebase from './firebase'
import { Provider } from 'react-redux'

import store from './redux.js'
// console.log('store.getState(): ', store.getState());

let threadsRef = firebase.database().ref('threads')
threadsRef.on('value', snapshot => {
  store.dispatch({
	    type: 'FIREBASE_THREAD_CHANGE',
	    payload: snapshot.val(),
  })
})
// let postsRef = firebase.database().ref('posts')

ReactDOM.render(
  <Provider store={store}>
	    <App />
  </Provider>,
  document.getElementById('root'))
registerServiceWorker()
