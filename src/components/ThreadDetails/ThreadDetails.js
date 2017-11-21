import React, { Component } from 'react';
// import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
// import './ThreadDetails.css';
//
import firebase from '../../firebase.js';


class ThreadDetails extends Component {
  constructor(props){
    super(props)
    this.state = {
      key: window.location.pathname.split('/')[2],
      data: {}
    }

    this.handleLike = this.handleLike.bind(this)
  }

  componentDidMount(){
    let threadRef = firebase.database().ref('threads/' + this.state.key)
    // Chnage this to pass on from top level
    threadRef.on('value', snap => {
      let curState = this.state
      curState.data = snap.val()
      this.setState(curState)
    })
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
    if ( this.state.data.likes !== undefined ){
      let likes = 0
      for (let i in this.state.data.likes) {
        if (this.state.data.likes[i] === true){
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
    return(
      <div>
        Thread details : { this.state.key }
        <h1>{this.state.data.title}</h1>
        <p>{ this.state.data.content }</p>
        <button onClick={this.handleLike}> Likes: { this.numOfLikes() }</button>
      </div>
    )
  }
}

export default ThreadDetails
