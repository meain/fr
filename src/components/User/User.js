import React, { Component } from 'react';
import Icon from 'react-fa'

import './User.css'

import firebase, { auth, provider } from '../../firebase.js';

class User extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: null,
      dropdownOpen: false,
    }

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this)
  }

  addUserToDB(user) {
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

  toggleDropdown() {
    this.setState({
      ...this.state,
      dropdownOpen: !this.state.dropdownOpen
    })
  }

  render() {
    return (
      <div className="User">
        {this.state.user ?
          <div onClick={this.toggleDropdown} >
            <div className="User-details" >
              <p>
                <span className="strong monospace">{this.state.user.displayName} </span>
              </p>
              <p>
                <span className="muted monospace" style={{ paddingBottom: 10 }}>{this.state.user.email} </span>
              </p>
            </div>
            <img className="User-image" src={this.state.user.photoURL} alt={this.state.user.displayName} />
            {!this.state.dropdownOpen ?
              <div>
              </div>
              :
              <div className="User-dropdown">
                <div className="User-dropdown-elements">
                  <p>
                    <span className="muted">Profile</span>
                  </p>
                  <p>
                    <span className="muted">Likes</span>
                  </p>
                  <hr />
                  <p>
                  <span onClick={this.logout} >Logout</span>
                  </p>
                </div>
              </div>
            }
          </div>
          :
          <button className="button secondary outline" style={{ marginTop: 5 }} onClick={this.login}><Icon name="sign-in" />  Login</button>
        }
      </div>
    );
  }

}

export default User
