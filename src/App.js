import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import { connect } from 'react-redux'
import './App.css';

import { updateThreads, userChanged } from './reducers.js'
import firebase from './firebase.js'

// import 'antd/dist/antd.css';
// import { BackTop } from 'antd'

import 'react-simplemde-editor/dist/simplemde.min.css'

import User from './components/User/User';
import Editor from './components/Editor/Editor'
import ThreadList from './components/ThreadList/ThreadList';
import ThreadDetails from './components/ThreadDetails/ThreadDetails';
import PageHeader from './components/PageHeader/PageHeader'
import NewThread from './components/NewThread/NewThread'

class App extends Component {

  render() {
    return (
      <Router>
        <div className="App">
          {/* <BackTop/> */}
      <PageHeader />

          <br/>
<form className="form">
    <div className="form-item">
      <input type="text" className="search" />
    </div>
</form>
          <br/>
          <div>

            <Route exact path="/" render={({history}) => (<ThreadList history={history}/>) } />
              <Route path="/newPost" render={ ({history}) => (<NewThread history={history} />) } />
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
