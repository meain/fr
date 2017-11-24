import React, { Component } from 'react';
import { connect } from 'react-redux'
import './ThreadDetails.css';

import firebase from '../../firebase.js';
import { updateThreads, userChanged } from '../../reducers.js'
import { getThread } from '../../getters.js'

import Editor from '../Editor/Editor';
import Post from '../Post/Post'
import Thread from '../Thread/Thread'

class ThreadDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      key: window.location.pathname.split('/')[2],
      posts: [] // Loaded here on demand
    }

    this.addPost = this.addPost.bind(this)
    this.scrollToTop()
  }

  scrollToTop(scrollDuration) {
    const scrollHeight = window.scrollY,
      scrollStep = Math.PI / (scrollDuration / 15),
      cosParameter = scrollHeight / 2;
    var scrollCount = 0,
      scrollMargin,
      scrollInterval = setInterval(function () {
        if (window.scrollY !== 0) {
          scrollCount = scrollCount + 1;
          scrollMargin = cosParameter - cosParameter * Math.cos(scrollCount * scrollStep);
          window.scrollTo(0, (scrollHeight - scrollMargin));
        }
        else clearInterval(scrollInterval);
      }, 15);
  }


  componentDidMount() {
    let posts = this.props.thread.posts
    if (posts) {
      let key = Object.keys(posts)[0]
      let postRef = firebase.database().ref("posts/" + key)
      postRef.once('value', snap => {
        let curState = this.state
        curState.posts = [snap.val()]
        this.setState(curState)
      })
    }
  }

  componentWillReceiveProps(props) {
    let posts = props.thread.posts
    if (posts) {
      let key = Object.keys(posts)[0]
      let postRef = firebase.database().ref("posts/" + key)
      postRef.once('value', snap => {
        let curState = this.state
        curState.posts = [snap.val()]
        this.setState(curState)
      })
    }
  }

  addPost(data) {
    if (this.props.user) {
      const post =
        {
          content: data.content,
          createdAt: Date.now(),
          user: this.props.user.uid,
        };
      const key = firebase.database().ref('posts').push(post).key;
      // Add theard data to user
      firebase.database().ref('users/' + this.props.user.uid + '/posts/' + key).set(true);
      firebase.database().ref('threads/' + this.state.key + '/posts/' + key).set(true)
    }
  }

  render() {
    let showEditor = this.props.user !== null && this.state.posts.length === 0
    return (
      <div className="ThreadDetails">
        <Thread
          key={this.state.key}
          user={this.props.user}
          postKey={this.state.key}
          data={this.props.thread}
          hasHeading={true}
          dockBottom={true}
          handleClick={(e) => { }}
        />
        <fieldset>
          <legend>Answer</legend>
          {this.state.posts.map((post, i) => <Post key={i} data={post} />)}
        </fieldset>
        {
          showEditor &&
          <Editor
            title="Add answer"
            onSubmit={this.addPost} />
        }
      </div>
    )
  }
}

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
