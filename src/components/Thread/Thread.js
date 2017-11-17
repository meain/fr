import React, { Component } from 'react';
import './Thread.css';

class Thread extends Component {
  getDate(timestamp){
    let d = new Date(timestamp)
    return  d.toISOString()
  }

  render(){
    return (
      <div className="Thread">
        <img className="Thread-user-image" src={this.props.data.user.displayImage} alt={this.props.data.user.displayName} />
        <p>{this.props.data.user.displayName}</p>
        <p>{ this.getDate(this.props.data.createdAt) }</p>
        <p>{ this.props.data.title }</p>
        <p>{ this.props.data.content } </p>
      </div>
      )
  }

}

export default Thread
