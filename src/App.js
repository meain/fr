import React, { Component } from 'react';
import './App.css';

import firebase from './firebase.js';

import User from './components/User/User'
import ThreadList from './components/ThreadList/ThreadList'

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

  addThread(){
    console.log('this.state.user: ', this.state.user);
    if (this.state.user) {
      const content =
        {
          title: "Smooth :/",
          content: "Wooo, chill there kid",
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
      firebase.database().ref('threads').push(content);
    }
  }


  render() {
    console.log('this.state.threads: ', this.state.threads);
    return (
      <div>
        <User handle={this.handleAuth} />

        <br/>

        <ThreadList />

        <br/>

      <button onClick={this.addThread}> Add </button>
    </div>
    );
  }
}

export default App;
