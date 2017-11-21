import React, { Component } from 'react';
import './Thread.css';

class Thread extends Component {

  getDate(timestamp){
    let d = new Date(timestamp)
    return  d.toISOString()
  }

  numOfLikes(){
    if ( this.props.data.likes !== undefined ){
      let likes = 0
      for (let i in this.props.data.likes) {
        if (this.props.data.likes[i] === true){
          likes += 1
        }
      }
      return likes
    }
    else{
      return 0
    }
  }

  render(){
    return (
      <div className="Thread" onClick={this.props.handleClick}>
        <img className="Thread-user-image" src={this.props.data.user.displayImage} alt={this.props.data.user.displayName} />
        <p>{this.props.data.user.displayName}</p>
        <p>{ this.getDate(this.props.data.createdAt) }</p>
        <button onClick={this.props.handleLike}> Likes: { this.numOfLikes() }</button>
        <p>{ this.props.data.title }</p>
        <p>{ this.props.data.content } </p>
      </div>
      )
  }

}

export default Thread
