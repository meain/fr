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

  render(){
    return (
      <div className="threads">
        { this.state.threads.map( thread => {
          return (
            <Thread key={thread.id} data={thread.data}/>
          )
        })
        }
      </div>
    )
  }

}

export default ThreadList
