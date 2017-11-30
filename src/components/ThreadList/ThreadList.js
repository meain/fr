import React, { Component } from 'react'
import { connect } from 'react-redux'

import './ThreadList.css'
import firebase from '../../firebase.js'
import { updateThreads, userChanged } from '../../reducers.js'

import Loading from '../Loading/Loading'
import ThreadListDisplay from '../ThreadListDisplay/ThreadListDisplay'
import SearchWidget from '../SearchWidget/SearchWidget'

class ThreadList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true
    }

    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount() {
    if (this.props.threads && this.props.threads.length > 0) {
      this.setState({ ...this.state, loading: false })
    }
    let threadsRef = firebase.database().ref('threads')
    threadsRef.on('value', snapshot => {
      this.props.threadsChanged(snapshot.val())
      this.setState({ ...this.state, loading: false })
    })
  }

  handleClick(key) {
    this.props.history.push('/thread/' + key)
  }

  render() {
    let threads = this.props.threads
    return (
      <div className="ThreadList">
        {this.state.loading ? (
          <Loading initialMessage="Loading thread list. Just hang on." />
        ) : (
          <div>
            <SearchWidget objects={this.props.threads} />
            <ThreadListDisplay
              threads={threads}
              user={this.props.user}
              bordered={true}
              raiseOnHover={true}
              handleClick={this.handleClick}
            />
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    threads: state.threads
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
