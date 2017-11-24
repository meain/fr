import React, { Component } from 'react';
import moment from 'moment'
import Markdown from 'react-markdown'

import './Post.css'

import firebase from '../../firebase.js'


class Post extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: {} 
    }
  }

  componentDidMount(){
    let uid = this.props.data.user
    firebase.database().ref('users/' + uid).once('value', snap => {
      this.setState({
        user: snap.val()
      })
    })
  }
  
  render() {
    return (
      <div>
        <samp> Answered by {this.state.user.displayName} {' '} {moment(this.props.data.createdAt).fromNow()}</samp>
        <br />
        <Markdown className="Post-content-markdown" source={this.props.data.content} />
      </div>
    )
  }
}

export default Post
