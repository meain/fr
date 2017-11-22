import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import './App.css';

import firebase from './firebase.js';

import 'antd/dist/antd.css';
import { BackTop } from 'antd'

import User from './components/User/User';
import ThreadList from './components/ThreadList/ThreadList';
import Editor from './components/Editor/Editor';
import ThreadDetails from './components/ThreadDetails/ThreadDetails';

class App extends Component {

	constructor(props) {
		super(props);

		this.state = {
			threads: [],
			user: null
		};

		this.handleAuth = this.handleAuth.bind(this);
		this.addThread = this.addThread.bind(this);
	}

	handleAuth(user) {
		const curState = this.state;
		curState.user = user;
		this.setState(curState);
	}

	addThread(data) {
		if (this.state.user) {
			const thread =
				{
					title: data.title,
					content: data.content,
					createdAt: Date.now(),
					posts: [],  // Sub posts, we will most probably have only one ( jsut in case )
					likes: [],  // Will contain user uids
					stars: [],  // Bookmark question ( implement later )
					user: {
						uid: this.state.user.uid,
						displayName: this.state.user.displayName,
						email: this.state.user.email,
						displayImage: this.state.user.photoURL
					}
				};
			const key = firebase.database().ref('threads').push(thread).key;
			console.log('key: ', key);

      // Add theard data to user
			firebase.database().ref('users/' + this.state.user.uid + '/threads/' + key).set(true);
		}
	}

	render() {
		return (
        <Router>
          <div class="App">
        <BackTop/>
            <h1><Link to="/">Kerala AI</Link></h1>
            <User handle={this.handleAuth} />

            <br/>

            <Editor onSubmit={this.addThread} />

            <br/>
            <div>
              {/* I remember there being a way to get user in components without passing it as prop */}
              <Route exact path="/" render={({history}) => (<ThreadList user={this.state.user} history={history}/>) } />
              <Route path="/thread/:threadId" render={ () => (<ThreadDetails user={this.state.user}/>) }/>
            </div>
          </div>
        </Router>
		);
	}
}

export default App;
