import React, { Component } from 'react';
import './App.css';

import firebase from './firebase.js';

import User from './components/User/User'
import ThreadList from './components/ThreadList/ThreadList'
import Editor from './components/Editor/Editor'

class App extends Component {

  constructor(props){
    super(props)

    this.state = {
      threads: [],
      user: null,
    }

    this.handleAuth = this.handleAuth.bind(this)
    this.addThread = this.addThread.bind(this)

  }

  handleAuth(user){
    let curState = this.state
    curState.user = user
    this.setState(curState)
  }

  addThread(data){
    if (this.state.user) {
      const thread =
        {
          title: data.title,
          content: data.content,
          createdAt: Date.now(),
          posts: [],  // Sub posts, we will most probably have only one ( jsut in case )
          likes: [],  // Will contain user uids
          stars:[],  // bookmark question ( implement later )
          user: {
            uid: this.state.user.uid,
            displayName: this.state.user.displayName,
            email: this.state.user.email,
            displayImage: this.state.user.photoURL
          }
        }
      let key = firebase.database().ref('threads').push(thread).key;
      console.log('key: ', key);

      // Add theard data to user
      firebase.database().ref('users/' + this.state.user.uid + '/threads/' + key).set(true)
    }
  }




  render() {
    console.log('this.state.threads: ', this.state.threads);
    return (
      <div>
        <User handle={this.handleAuth} />

        <br/>

        <Editor onSubmit={this.addThread}  />

        <br/>
        <ThreadList user={this.state.user} />


    </div>
    );
  }
}

export default App;
