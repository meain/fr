import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import { connect } from 'react-redux'
import './App.css';

import { updateThreads, userChanged } from './reducers.js'
import firebase from './firebase.js'

import 'antd/dist/antd.css';
import { BackTop } from 'antd'

import User from './components/User/User';
import Editor from './components/Editor/Editor'
import ThreadList from './components/ThreadList/ThreadList';
import ThreadDetails from './components/ThreadDetails/ThreadDetails';

class App extends Component {

  constructor(props) {
    super(props);

    this.handleAuth = this.handleAuth.bind(this)
    this.addThread = this.addThread.bind(this)
  }

  handleAuth(user) {
    this.props.userChanged(user)
  }

  addThread(data) {
    if (this.props.user) {
      const thread =
        {
          title: data.title,
          content: data.content,
          createdAt: Date.now(),
          posts: [],  // Sub posts, we will most probably have only one ( jsut in case )
          likes: [],  // Will contain user uids
          stars: [],  // Bookmark question ( implement later )
          user: {
            uid: this.props.user.uid,
            displayName: this.props.user.displayName,
            email: this.props.user.email,
            displayImage: this.props.user.photoURL
          }
        };
      const key = firebase.database().ref('threads').push(thread).key;
      console.log('key: ', key);
      // Add theard data to user
      firebase.database().ref('users/' + this.props.user.uid + '/threads/' + key).set(true);
    }
    // Display what they just posted or route back to main page
  }


  render() {
    return (
      <Router>
        <div className="App">
          <BackTop/>
          <h1><Link to="/">Kerala AI</Link></h1>
          <User handle={this.handleAuth} />

          <br/>

          <br/>
          <div>

            <Route exact path="/" render={({history}) => (<ThreadList history={history}/>) } />
              <Route path="/newPost" render={ () => (<Editor onSubmit={this.addThread} />) } />
          <Route path="/thread/:threadId" render={ () => (<ThreadDetails />) }/>

          </div>
        </div>
      </Router>
  );
  }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(App)
