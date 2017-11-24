import React, { Component } from 'react';
// import { Button } from 'antd'

import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import './ThreadList.css';

import firebase from '../../firebase.js';

import { updateThreads, userChanged } from '../../reducers.js'

import Thread from '../Thread/Thread'
import Editor from '../Editor/Editor';

class ThreadList extends Component {

  componentDidMount(){
    let threadsRef = firebase.database().ref('threads')
    threadsRef.on('value', snapshot => {
      this.props.threadsChanged(snapshot.val())
    })
  }


  handleClick(ev, key){
    this.props.history.push('/thread/' + key)
  }

  render(){
    console.log('this.props.user: ', this.props.user);
    return (
      <div className="ThreadList">

        { this.props.user && <Link to="/newPost" >
          <button className="button" type="primary">New Question</button>
          </Link>}
      <br/>
      <br/>
      <br/>
        { this.props.threads.map( thread => {
          return (
            <Thread
            key={thread.id}
            user={this.props.user}
            postKey={thread.id}
            data={thread.data}
            bordered={true}
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
