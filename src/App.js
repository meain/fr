import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import { connect } from 'react-redux'
import './App.css';

import { updateThreads, userChanged } from './reducers.js'

import 'antd/dist/antd.css';
import { BackTop } from 'antd'

import User from './components/User/User';
import ThreadList from './components/ThreadList/ThreadList';
import ThreadDetails from './components/ThreadDetails/ThreadDetails';

class App extends Component {

  constructor(props) {
    super(props);

    this.handleAuth = this.handleAuth.bind(this);
  }

  handleAuth(user) {
    this.props.userChanged(user)
  }


  render() {
    return (
      <Router>
        <div className="App">
          <BackTop/>
          <h1><Link to="/">Kerala AI</Link></h1>
          <User handle={this.handleAuth} />

          <br/>

          {/* <Editor onSubmit={this.addThread} /> */}

          <br/>
          <div>

            <Route exact path="/" render={({history}) => (<ThreadList history={history}/>) } />
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
