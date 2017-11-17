import React, { Component } from 'react';
import './App.css';

import firebase from './firebase.js';

import User from './components/User/User'

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
          ceatedAt: Date.now(),
          posts: [],
          user: {
            uid: this.state.user.uid,
            displyName: this.state.user.displayName,
            email: this.state.user.email,
            displayImage: this.state.user.photoURL
          }
        }
      firebase.database().ref('threads').push(content);
    }
  }

  jsonToList(data){
    let list = []
    for( var i in data ){
      list.push({ "id": i, "data": data[i]})
    }
    return list
  }

  componentDidMount(){
    let threadsRef = firebase.database().ref('threads')
    threadsRef.on('value', snapshot => {
      let curState = this.state
      curState.threads = this.jsonToList(snapshot.val())
      this.setState(curState)
    })
  }


  render() {
    console.log('this.state.threads: ', this.state.threads);
    return (
      <div>
        <User handle={this.handleAuth} />

        <div className="threads">
          { this.state.threads.map( thread => {
            return (
              <p key={thread.id}>{ thread.data.title }</p>
            )
          })
          }
      </div>

      <button onClick={this.addThread}> Add </button>
    </div>
    );
  }
}

export default App;
