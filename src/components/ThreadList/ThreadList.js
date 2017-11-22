import React, { Component } from 'react';
import { connect } from 'react-redux'
import './ThreadList.css';

import firebase from '../../firebase.js';

import { updateThreads, userChanged } from '../../reducers.js'

import Thread from '../Thread/Thread'

class ThreadList extends Component {


  componentDidMount(){
    let threadsRef = firebase.database().ref('threads')
    threadsRef.on('value', snapshot => {
      this.props.threadsChanged(snapshot.val())
    })
  }

  handleLike(ev, key){
    ev.stopPropagation();
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
    this.props.history.push('/thread/' + key)
  }

  render(){
    return (
      <div className="threads">
        { this.props.threads.map( thread => {
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

// export default ThreadList
const mapStateToProps = state => {
  return {
    user: state.user,
    threads: state.threads,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    threadsChanged: threads => {
      dispatch(updateThreads(threads))
    },
    userChanged: user => {
      dispatch(userChanged(user))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreadList)
