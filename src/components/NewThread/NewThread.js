import React, { Component } from 'react'
import { connect } from 'react-redux'
import Icon from 'react-fa'

import firebase from '../../firebase.js'
import { userChanged } from '../../reducers.js'

import './NewThread.css'

import Editor from '../Editor/Editor'

class NewThead extends Component {
  constructor(props) {
    super(props)

    this.addThread = this.addThread.bind(this)
  }

  addThread(data) {
    if (this.props.user) {
      const thread = {
        title: data.title,
        content: data.content,
        createdAt: Date.now(),
        posts: [], // Sub posts, we will most probably have only one ( jsut in case )
        likes: [], // Will contain user uids
        stars: [], // Bookmark question ( implement later )
        user: this.props.user.uid
      }
      const key = firebase
        .database()
        .ref('threads')
        .push(thread).key
      // Add theard data to user
      firebase
        .database()
        .ref('users/' + this.props.user.uid + '/threads/' + key)
        .set(true)
      this.props.history.push('/')
    }
  }

  handleAuth(user) {
    this.props.userChanged(user)
  }

  render() {
    return (
      <div className="NewThread">
        {this.props.user ? (
          <div>
            <br />
            <h2 className="page-title">New Question</h2>
            <Editor hasHeading={true} onSubmit={this.addThread} />
          </div>
        ) : (
          <div className="NewThread-not-signed-in">
            <Icon name="user-o" className="NewThread-user-icon" />
            <p>
              <var>Login to ask a new question</var>
            </p>
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    userChanged: user => {
      dispatch(userChanged(user))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewThead)
