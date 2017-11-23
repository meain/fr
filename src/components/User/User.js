import React, { Component } from 'react';
import { Button } from 'antd'
import './User.css'

import firebase, { auth, provider } from '../../firebase.js';

class User extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: null
    }

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  addUserToDB(user){
    let userRef = firebase.database().ref('users/' + user.uid)
    let userInfo = {
      "displayName": user.displayName,
      "displayImage": user.photoURL,
      "lastLogin": Date.now(),
      "email": user.email,
      "provider": "google.com",
      "registeredAt": Date.now(),
      "likes": [],
      "threads": [],
      "posts": [],
      "admin": false,  // Can be only changed from firebase console
    }
    userRef.once('value', snap => {
      console.log('snap.val(): ', snap.val());
      const d = snap.val()
      if (d != null) {
        // firebase does not create space for empty values
        if (d.threads)
          userInfo.threads = d.threads
        if (d.likes)
          userInfo.likes = d.likes
        if (d.posts)
          userInfo.posts = d.posts
        if (d.registeredAt)
          userInfo.registeredAt = d.registeredAt
      }
      firebase.database().ref('users/' + user.uid).set({ ...userInfo });
    })
  }

  login() {
    auth.signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        this.setState({
          user
        });
        this.addUserToDB(user)
        this.props.handle(this.state.user)
      });
  }

  logout() {
    auth.signOut()
      .then(() => {
        this.setState({
          user: null
        });
        this.props.handle(this.state.user)
      });
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
        this.addUserToDB(user)
        this.props.handle(this.state.user)
      }
    });
  }

  render() {
    return (
      <div className="User">
        {this.state.user ?
          <div>
            <pre className="User-name">{ this.state.user.displayName } </pre>
          <img onClick={this.logout} className="User-image" src={this.state.user.photoURL} alt={this.state.user.displayName} />
            {/* <button onClick={this.logout}>Log Out</button> */}
          </div>
        :
          <Button onClick={this.login}>Log In</Button>
        }
        </div>
        );
  }

}

export default User
