import React, { Component } from 'react';
import moment from 'moment'
// import {Icon} from 'antd'
import Icon from 'react-fa'
import Markdown from 'react-markdown'
import './Thread.css';

import firebase from '../../firebase.js';

// import { Card } from 'antd';

class Thread extends Component {

  numOfLikes(){
    if ( this.props.data.likes !== undefined ){
      let likes = 0
      for (let i in this.props.data.likes) {
        if (this.props.data.likes[i] === true){
          likes += 1
        }
      }
      return likes
    }
    else{
      return 0
    }
  }

  handleLike(ev){
    let key = this.props.postKey
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

  render(){
    let title = this.props.data.title
    let content = this.props.data.content
    let border = this.props.bordered ? this.props.bordered : false
    if (this.props.data.user === undefined){
      return (<pre>Loading...</pre>)
    }
    return (
      <div className="Thread" onClick={this.props.handleClick}>
  <div >
    <pre><h1>{title}</h1></pre>
    <br/>
    <br/>
      <div className="Thread-content reset-this">
      <Markdown className="Thread-content-markdown" source={content} />
    </div>
        <div className="Thread-footer">
          <div className="Thread-footer-elements">
        <p className="Thread-footer-element">{this.props.data.user.displayName}</p>
        <p className="Thread-footer-element">{ moment(this.props.data.createdAt).fromNow() }</p>
      </div>
        <img className="Thread-user-image" src={this.props.data.user.displayImage} alt={this.props.data.user.displayName} />
        <p className="Thread-like" onClick={this.handleLike.bind(this)}> <Icon type="thumbs-up" /> { this.numOfLikes() }</p>
        </div>
      </div>
      </div>
      )
  }

}

export default Thread
