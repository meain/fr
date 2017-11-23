import React, {Component} from 'react';
import { userChanged } from '../../reducers.js'
import {Link} from 'react-router-dom';
import { connect } from 'react-redux'

import './PageHeader.css'

import User from '../User/User'

class PageHeader extends Component {
  constructor(props){
    super(props)
    this.handleAuth = this.handleAuth.bind(this)
  }

  handleAuth(user) {
    this.props.userChanged(user)
  }

  render(){
    return (
      <div className="PageHeader">
        <div className="PageHeader-logo">
          <h1><pre><Link to="/">Kerala AI</Link></pre></h1>
        </div>
        <div className="PageHeader-user">
          <User handle={this.handleAuth} />
        </div>
        </div>
    )
  }

}

const mapStateToProps = state => {
  return {
    user: state.user,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    userChanged: user => {
      dispatch(userChanged(user))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PageHeader)
