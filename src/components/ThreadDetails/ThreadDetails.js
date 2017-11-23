import React, { Component } from 'react';
import { connect } from 'react-redux'
// import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
// import './ThreadDetails.css';

import firebase from '../../firebase.js';
import { updateThreads, userChanged } from '../../reducers.js'
import { getThread } from '../../getters.js'

import Editor from '../Editor/Editor';
import Post from '../Post/Post'

class ThreadDetails extends Component {
  constructor(props){
    super(props)
    this.state = {
      key: window.location.pathname.split('/')[2],
      posts: [] // Loaded here on demand
    }

    this.handleLike = this.handleLike.bind(this)
    this.addPost = this.addPost.bind(this)
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
    return(
      <div>
        Thread details : { this.state.key }
        <h1>{this.props.thread.title}</h1>
        <p>{ this.props.thread.content }</p>
        <button onClick={this.handleLike}> Likes: { this.numOfLikes() }</button>
        {/* { this.state.posts.length===0 ? ({ this.props.user && <Editor onSubmit={this.addPost}/>}) : (<h1>Answered</h1>) } */}
      {this.props.user && this.state.posts.length===0 && <Editor onSubmit={this.addPost}/>}
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
