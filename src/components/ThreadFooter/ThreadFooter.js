import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import Icon from 'react-fa'

import './ThreadFooter.css'

import userPlaceholder from './user.png'

import firebase from '../../firebase.js'

class ThreadFooter extends Component {
  constructor(props) {
    super(props)

    this.numOfLikes = this.numOfLikes.bind(this)
    this.handleLike = this.handleLike.bind(this)
    this.getUser = this.getUser.bind(this)
    this.userIconClick = this.userIconClick.bind(this)
    this.state = {
      user: {}
    }
  }

  componentDidMount() {
    let uid = this.props.data.user
    firebase
      .database()
      .ref('users/' + uid)
      .once('value', snap => {
        this.setState({
          user: snap.val()
        })
      })
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
    } else {
      return 0
    }
  }

  handleLike(ev) {
    let key = this.props.postKey
    ev.stopPropagation()
    if (this.props.user) {
      let threadLikeRef = firebase
        .database()
        .ref('threads/' + key + '/likes/' + this.props.user.uid)
      threadLikeRef.once('value', snap => {
        let sval = snap.val()
        let statusVal = true
        if (sval != null) statusVal = !sval
        snap.ref.set(statusVal)
        let userLikeRef = firebase.database().ref('users/' + this.props.user.uid + '/likes/' + key)
        userLikeRef.set(statusVal)
      })
    }
  }

  getUser() {
    if (this.state.user) {
      return this.state.user
    } else {
      return {
        displayName: '<unknown>',
        displayImage: userPlaceholder
      }
    }
  }

  userIconClick(ev, history) {
    ev.preventDefault()
    ev.stopPropagation()
    if (this.state.user) history.push('/user/' + this.state.user.uid)
  }

  render() {
    let user = this.getUser()
    let userLiked =
      this.props.data.likes &&
      this.props.user &&
      this.props.data.likes[this.props.user.uid] === true
    const UserImage = withRouter(({ history }) => (
      <img
        className="ThreadFooter-user-image"
        src={user.displayImage}
        onClick={ev => {
          this.userIconClick(ev, history)
        }}
        alt={user.displayImage}
      />
    ))
    return (
      <div className={'ThreadFooter' + (this.props.dockBottom ? '-docked' : '')}>
        <div className="ThreadFooter-elements">
          <p>
            <span className="strong monospace">{user.displayName}</span>
          </p>
          <p>
            <span className="muted monospace">{moment(this.props.data.createdAt).fromNow()}</span>
          </p>
        </div>
        <UserImage />
        <p className="ThreadFooter-like" onClick={this.handleLike}>
          <Icon name="thumbs-o-up" className={userLiked ? 'color-red' : ''} /> {this.numOfLikes()}
        </p>
      </div>
    )
  }
}

export default ThreadFooter
