import React, { Component } from 'react';
import { connect } from 'react-redux'
// import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
// import './ThreadDetails.css';
//
import firebase from '../../firebase.js';
import { updateThreads, userChanged } from '../../reducers.js'
import { getThread } from '../../getters.js'

class ThreadDetails extends Component {
  constructor(props){
    super(props)
    this.state = {
      key: window.location.pathname.split('/')[2],
    }

    this.handleLike = this.handleLike.bind(this)
  }

  handleLike(ev){
    if (this.props.user){
      let threadLikeRef = firebase.database().ref('threads/' + this.state.key + '/likes/' + this.props.user.uid)
      threadLikeRef.once('value', snap => {
        let sval = snap.val()
        let statusVal = true
        if (sval != null)
          statusVal = !sval
        snap.ref.set(statusVal)
        let userLikeRef = firebase.database().ref('users/' + this.props.user.uid + '/likes/' + this.state.key)
        userLikeRef.set(statusVal)
      })
    }
  }

  numOfLikes(){
    // Once we pass like in from the top, this will change to this.props.data.like ?? idk
    if ( this.props.thread.likes !== undefined ){
      let likes = 0
      for (let i in this.props.thread.likes) {
        if (this.props.thread.likes[i] === true){
          likes += 1
        }
      }
      return likes
    }
    else{
      return 0
    }
  }

  render(){
    console.log('this.state.data: ', this.props.thread);
    return(
      <div>
        Thread details : { this.state.key }
        <h1>{this.props.thread.title}</h1>
        <p>{ this.props.thread.content }</p>
        <button onClick={this.handleLike}> Likes: { this.numOfLikes() }</button>
      </div>
    )
  }
}

// export default ThreadDetails

const mapStateToProps = state => {
  return {
    user: state.user,
    thread: getThread(window.location.pathname.split('/')[2], state),
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

export default connect(mapStateToProps, mapDispatchToProps)(ThreadDetails)
