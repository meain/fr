import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import './ThreadList.css';

import firebase from '../../firebase.js';

import { updateThreads, userChanged } from '../../reducers.js'

import Thread from '../Thread/Thread'
import Editor from '../Editor/Editor';

class ThreadList extends Component {

  constructor(props){
    super(props)

    // this.addThread = this.addThread.bind(this);
  }

  componentDidMount(){
    let threadsRef = firebase.database().ref('threads')
    threadsRef.on('value', snapshot => {
      this.props.threadsChanged(snapshot.val())
    })
  }

  handleLike(ev, key){
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

  // addThread(data) {
  //   if (this.props.user) {
  //     const thread =
  //       {
  //         title: data.title,
  //         content: data.content,
  //         createdAt: Date.now(),
  //         posts: [],  // Sub posts, we will most probably have only one ( jsut in case )
  //         likes: [],  // Will contain user uids
  //         stars: [],  // Bookmark question ( implement later )
  //         user: {
  //           uid: this.props.user.uid,
  //           displayName: this.props.user.displayName,
  //           email: this.props.user.email,
  //           displayImage: this.props.user.photoURL
  //         }
  //       };
  //     const key = firebase.database().ref('threads').push(thread).key;
  //     console.log('key: ', key);
  //     // Add theard data to user
  //     firebase.database().ref('users/' + this.props.user.uid + '/threads/' + key).set(true);
  //   }
  // }

  handleClick(ev, key){
    this.props.history.push('/thread/' + key)
  }

  render(){
    return (
      <div className="threads">

          { this.props.user && <Link to="/newPost" ><button> New Post</button> </Link>}
        {/* { this.props.user &&  <Editor onSubmit={this.addThread} />} */}
        { this.props.threads.map( thread => {
          return (
            <Thread
            key={thread.id}
            data={thread.data}
            handleLike={(e) => this.handleLike(e, thread.id)}
            handleClick={(e) => this.handleClick(e, thread.id)}
            />
          )
        })
        }
      </div>
    )
  }

}

// export default ThreadList
const mapStateToProps = state => {
  return {
    user: state.user,
    threads: state.threads,
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

export default connect(mapStateToProps, mapDispatchToProps)(ThreadList)
