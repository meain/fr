import React, { Component } from 'react';
import { connect } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import './ThreadDetails.css';

import firebase from '../../firebase.js';
import { updateThreads, userChanged } from '../../reducers.js'
import { getThread } from '../../getters.js'

import Editor from '../Editor/Editor';
import Post from '../Post/Post'
import Thread from '../Thread/Thread'

class ThreadDetails extends Component {
  constructor(props){
    super(props)
    this.state = {
      key: window.location.pathname.split('/')[2],
      posts: [] // Loaded here on demand
    }

    this.addPost = this.addPost.bind(this)
  }

  componentDidMount(){
    let posts = this.props.thread.posts
    if (posts){
      let key = Object.keys(posts)[0]
      let postRef = firebase.database().ref("posts/" + key)
      postRef.once('value', snap => {
        let curState = this.state
        curState.posts = [snap.val()]
        this.setState(curState)
      })
    }
  }

  componentWillReceiveProps(props){
    let posts = props.thread.posts
    if (posts){
      let key = Object.keys(posts)[0]
      let postRef = firebase.database().ref("posts/" + key)
      postRef.once('value', snap => {
        let curState = this.state
        curState.posts = [snap.val()]
        this.setState(curState)
      })
    }
  }

  addPost(data){
    if (this.props.user) {
      const post =
        {
          content: data.content,
          createdAt: Date.now(),
          user: {
            uid: this.props.user.uid,
            displayName: this.props.user.displayName,
            email: this.props.user.email,
            displayImage: this.props.user.photoURL
          }
        };
      const key = firebase.database().ref('posts').push(post).key;
      // Add theard data to user
      firebase.database().ref('users/' + this.props.user.uid + '/posts/' + key).set(true);
      firebase.database().ref('threads/' + this.state.key + '/posts/' + key).set(true)
    }
  }

  render(){
    console.log('this.state: ', this.state);
    console.log('this.props: ', this.props);
    return(
      <div className="ThreadDetails">
        <Thread
          key={this.state.key}
          user={this.props.user}
          postKey={this.state.key}
          data={this.props.thread}
          hasHeading={true}
          handleClick={(e) => {}}
        />
        <br/>
        <br/>
        {this.props.user && this.state.posts.length===0 &&
          <Editor
          title="Add answer"
          onSubmit={this.addPost}/>}
      { this.state.posts.map( (post, i) => {
        return (
          <Post key={i} data={post} />
        )
      } ) }
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
