import React, { Component } from 'react';
import { Card } from 'antd';
import moment from 'moment'


class Post extends Component {
  render(){
    return (
      <Card>
        <p>{this.props.data.content}</p>
        <p>{ moment(this.props.data.createdAt).format('ll') }</p>
        <p>{ this.props.data.user.displayName }</p>
      </Card>
    )
  }
}

export default Post
