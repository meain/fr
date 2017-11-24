import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import fuzzysearch from 'fuzzysearch'

import './ThreadList.css';
import firebase from '../../firebase.js';
import { updateThreads, userChanged } from '../../reducers.js'

import Thread from '../Thread/Thread'

class ThreadList extends Component {

  constructor(props) {
    super(props)

    this.state = {
      search: ""
    }

    this.searchChange = this.searchChange.bind(this)
  }

  componentDidMount() {
    let threadsRef = firebase.database().ref('threads')
    threadsRef.on('value', snapshot => {
      this.props.threadsChanged(snapshot.val())
    })
  }

  handleClick(ev, key) {
    this.props.history.push('/thread/' + key)
  }

  searchChange(e) {
    this.setState({ search: e.target.value })
  }

  getDisplayThreads() {
    // Search in title, if nothing search in content
    let search = this.state.search
    let threads = this.props.threads
    threads = this.props.threads.filter(thread => fuzzysearch(search.toLowerCase(), thread.data.title.toLowerCase()))
    if (threads.length === 0) {
      threads = this.props.threads.filter(thread => fuzzysearch(search.toLowerCase(), thread.data.content.toLowerCase()))
    }
    return threads
  }

  render() {
    let threads = this.getDisplayThreads()
    return (
      <div className="ThreadList">

        <form className="form">
          <div className="form-item">
            <input type="text" className="search ThreadList-search"
              onChange={this.searchChange} placeholder="Search" />
            {this.props.user && threads.length !== 0 &&
              <div className="ThreadList-search-ask">
                <kbd> Search for existing question or{' '}
                  <Link to="/newPost" >
                    ask a new question
          </Link>
                  .
          </kbd>
              </div>
            }
          </div>
        </form>
        {this.props.user && threads.length === 0 &&
          <div className="ThreadList-ask">
            <kbd> Looks like we don't have what you are looking for, would you like to{' '}
              <Link to="/newPost" >
                ask a question
          </Link>
              ?
          </kbd>
          </div>
        }

        {threads.map(thread =>
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
