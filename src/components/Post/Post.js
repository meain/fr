import React, { Component } from 'react';
// import { Card } from 'antd';
import moment from 'moment'
import Markdown from 'react-markdown'

import './Post.css'


class Post extends Component {
  render(){
    return (
      <div>
        {/* <p>{this.props.data.content}</p> */}
      <Markdown className="Post-content-markdown" source={this.props.data.content} />
      <br/>
      <br/>
      <br/>
        <p>{ moment(this.props.data.createdAt).fromNow() }</p>
        <p>{ this.props.data.user.displayName }</p>
      </div>
    )
  }
}

export default Post
