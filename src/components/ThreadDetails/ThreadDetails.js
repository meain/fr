import React, { Component } from 'react'
import { connect } from 'react-redux'
import './ThreadDetails.css'

import firebase from '../../firebase.js'
import { updateThreads, userChanged } from '../../reducers.js'

import Editor from '../Editor/Editor'
import Post from '../Post/Post'
import Thread from '../Thread/Thread'
import SearchWidget from '../SearchWidget/SearchWidget'

class ThreadDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      key: props.match.params.threadId,
      thread: this.getThread(props.match.params.threadId, props.threads),
      posts: [], // Loaded here on demand
      doneLoading: false
    }

    this.addPost = this.addPost.bind(this)
    this.doneLoading = this.doneLoading.bind(this)
    this.scrollToTop()
  }


  scrollToTop(scrollDuration) {
    const scrollHeight = window.scrollY,
      scrollStep = Math.PI / (scrollDuration / 15),
      cosParameter = scrollHeight / 2
    var scrollCount = 0,
      scrollMargin,
      scrollInterval = setInterval(function () {
        if (window.scrollY !== 0) {
          scrollCount = scrollCount + 1
          scrollMargin = cosParameter - cosParameter * Math.cos(scrollCount * scrollStep)
          window.scrollTo(0, (scrollHeight - scrollMargin))
        }
        else clearInterval(scrollInterval)
      }, 15)
  }

  componentDidMount() {
    let posts = this.state.thread.posts
    if (posts) {
      let key = Object.keys(posts)[0]
      let postRef = firebase.database().ref('posts/' + key)
      postRef.once('value', snap => {
        let curState = this.state
        curState.posts = [snap.val()]
        this.setState(curState)
      })
    }
  }

  getThread(key, threads){
    let data = {}
    for (var i = 0; i <  threads.length; i++){
      if (threads[i].id === key){
        data = threads[i].data
        break
      }
    }
    return data
  }

  componentWillReceiveProps(props) {
    // let posts = props.thread.posts
    this.setState({
      ...this.state,
      key: props.match.params.threadId,
      thread: this.getThread(props.match.params.threadId, props.threads),
    })
    let posts = this.getThread(props.match.params.threadId, props.threads).posts
    if (posts) {
      let key = Object.keys(posts)[0]
      let postRef = firebase.database().ref('posts/' + key)
      postRef.once('value', snap => {
        let curState = this.state
        curState.posts = [snap.val()]
        this.setState(curState)
      })
    }
  }

  doneLoading(){
    this.setState({
      ...this.state,
      doneLoading: true,
    })
  }

  addPost(data) {
    if (this.props.user) {
      const post =
        {
          content: data.content,
          createdAt: Date.now(),
          user: this.props.user.uid,
          thread: this.state.key,
        }
      const key = firebase.database().ref('posts').push(post).key
      // Add theard data to user
      firebase.database().ref('users/' + this.props.user.uid + '/posts/' + key).set(true)
      firebase.database().ref('threads/' + this.state.key + '/posts/' + key).set(true)
    }
  }

  render() {
    // let showEditor = this.props.user !== null && this.state.posts.length === 0 && this.state.doneLoading
    let showEditor = this.props.user !== null && this.state.posts.length === 0 && this.props.user.admin
    return (
      <div className="ThreadDetails">
        <SearchWidget objects={this.props.threads} />
        <h2 className="page-title">Question</h2>
        <Thread
          key={this.state.key}
          user={this.props.user}
          postKey={this.state.key}
          data={this.state.thread}
          hasHeading={true}
          dockBottom={true}
          doneLoading={this.doneLoading}
          handleClick={(e) => { }}
        />
        { !showEditor && this.state.posts && this.state.posts.length > 0 &&
        <fieldset>
          <legend>Answer</legend>
          {this.state.posts.map((post, i) => <Post key={i} data={post} />)}
        </fieldset>
        }
        {
          showEditor &&
          <Editor
            title="Add answer"
            onSubmit={this.addPost} />
        }
        <br />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    threads: state.threads
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
