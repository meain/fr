import React, { Component } from 'react';
import moment from 'moment'
import Icon from 'react-fa'

import './ThreadFooter.css'

import firebase from '../../firebase.js';

class ThreadFooter extends Component{
    constructor(props){
        super(props)
        
        this.numOfLikes = this.numOfLikes.bind(this)
        this.handleLike = this.handleLike.bind(this)
    }

  numOfLikes() {
    if (this.props.data.likes !== undefined) {
      let likes = 0
      for (let i in this.props.data.likes) {
        if (this.props.data.likes[i] === true) {
          likes += 1
        }
      }
      return likes
    }
    else {
      return 0
    }
  }

handleLike(ev) {
    let key = this.props.postKey
    ev.stopPropagation();
    if (this.props.user) {
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

    render(){
        return(
            <div className="ThreadFooter">
                <div className="ThreadFooter-elements">
                    <p>{this.props.data.user.displayName}</p>
                    <p>{moment(this.props.data.createdAt).fromNow()}</p>
                </div>
                <img className="ThreadFooter-user-image" src={this.props.data.user.displayImage} alt={this.props.data.user.displayName} />
                <p className="ThreadFooter-like" onClick={this.handleLike}> <Icon name="thumbs-up" /> {this.numOfLikes()}</p>
            </div>
        )
    }
}

export default ThreadFooter