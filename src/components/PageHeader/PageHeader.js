import React, { Component } from 'react';
import { userChanged } from '../../reducers.js'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'

import './PageHeader.css'

import User from '../User/User'

class PageHeader extends Component {
  constructor(props) {
    super(props)
    this.handleAuth = this.handleAuth.bind(this)
  }

  handleAuth(user) {
    this.props.userChanged(user)
  }

  render() {
    const Hero = withRouter(({ history }) => (
      <span className="strong PageHeader-hero" onClick={() => { history.push('/') }}>Kerala AI</span>
    ))
    return (
      <div className="PageHeader">
        <div className="PageHeader-logo">
          <p style={{ padding: 12 }}>
            <Hero />
          </p>
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
