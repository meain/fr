import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'

import './ThreadList.css';
import firebase from '../../firebase.js';
import { updateThreads, userChanged } from '../../reducers.js'

import Thread from '../Thread/Thread'

class ThreadList extends Component {

  componentDidMount() {
    let threadsRef = firebase.database().ref('threads')
    threadsRef.on('value', snapshot => {
      this.props.threadsChanged(snapshot.val())
    })
  }


  handleClick(ev, key) {
    this.props.history.push('/thread/' + key)
  }

  render() {
    let value = "Smooth"
    return (
      <div className="ThreadList">
        <form className="form">
          <div className="form-item">
            <input type="text" className="search" />
          </div>
          {this.props.user && <Link to="/newPost" >
            <button className="button" type="primary">New Question</button>
          </Link>}
        </form>


        <br />
        <br />
        {this.props.threads.map(thread => 
            <Thread
              key={thread.id}
              user={this.props.user}
              postKey={thread.id}
              data={thread.data}
              bordered={true}
              handleClick={(e) => this.handleClick(e, thread.id)}
            />
        )}
      </div>
    )
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

export default connect(mapStateToProps, mapDispatchToProps)(ThreadList)
