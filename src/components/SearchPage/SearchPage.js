import React, { Component } from 'react'
import { connect } from 'react-redux'
import fuzzysearch from 'fuzzysearch'

import './SearchPage.css'

import ThreadListDisplay from '../ThreadListDisplay/ThreadListDisplay'

class SearchPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      threads: props.threads
    }

    this.handleClick = this.handleClick.bind(this)
  }

  filterThreads(threads, query) {
    let filteredThreads = threads.filter(thread =>
      fuzzysearch(query.toLowerCase(), thread.data.title.toLowerCase())
    )
    return filteredThreads
  }

  componentDidMount() {
    let searchTerm = this.props.match.params.searchTerm
    this.setState({
      ...this.state,
      threads: this.filterThreads(this.props.threads, searchTerm)
    })
  }

  componentWillReceiveProps(props) {
    let searchTerm = props.match.params.searchTerm
    this.setState({
      ...this.state,
      threads: this.filterThreads(props.threads, searchTerm)
    })
  }

  handleClick(key) {
    this.props.history.push('/thread/' + key)
  }

  render() {
    let searchTerm = this.props.match.params.searchTerm
    let threads = this.state.threads
    console.table(threads);
    console.log('searchTerm: ', searchTerm)
    return (
      <div className="SearchPage">
        <h2 className="page-title">Search results</h2>
        <ThreadListDisplay
          threads={threads}
          user={this.props.user}
          maxHeight="300px"
          handleClick={this.handleClick}
        />
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

export default connect(mapStateToProps)(SearchPage)
