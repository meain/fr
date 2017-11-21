import React, { Component } from 'react';
import './ThreadList.css';

import firebase from '../../firebase.js';

import Thread from '../Thread/Thread'

class ThreadList extends Component {

  constructor(props){
    super(props)
    this.state = {
      threads: [],
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

  handleLike(ev, key){
    if (this.props.user){
      let threadLikeRef = firebase.database().ref('threads/' + key + '/likes/' + this.props.user.uid)
      threadLikeRef.once('value', snap => {
        let sval = snap.val()
        let statusVal = true
        if (sval != null)
          statusVal = !sval
        snap.ref.set(statusVal)
        let userLikeRef = firebase.database().ref('users/' + this.props.user.uid + '/likes/' + key)
        userLikeRef.set(statusVal)
      })
    }
  }

  handleClick(ev, key){
    console.log('Clicked on thread ', key);
    console.log('this.props.history: ', this.props.history);
    this.props.history.push('/thread/' + key)
  }

  render(){
    return (
      <div className="threads">
        { this.state.threads.map( thread => {
          return (
            <Thread
            key={thread.id}
            data={thread.data}
            handleLike={(e) => this.handleLike(e, thread.id)}
            handleClick={(e) => this.handleClick(e, thread.id)}
            />
          )
        })
        }
      </div>
    )
  }

}

export default ThreadList
