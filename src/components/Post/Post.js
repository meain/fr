import React, { Component } from 'react';
// import { Card } from 'antd';
import moment from 'moment'
import Markdown from 'react-markdown'

import './Post.css'


class Post extends Component {
  render() {
    return (
      <div>
        <samp> Answered by {this.props.data.user.displayName} {' '} {moment(this.props.data.createdAt).fromNow()}</samp>
        <br />
        <Markdown className="Post-content-markdown" source={this.props.data.content} />
      </div>
    )
  }
}

export default Post
