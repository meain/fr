import React, { Component } from 'react';
import Markdown from 'react-markdown'
import './Thread.css';

import ThreadFooter from '../ThreadFooter/ThreadFooter'
import Loading from '../Loading/Loading'

class Thread extends Component {

  constructor(props){
    super(props)

    this.state = {
      messageBubbled: false,
    }

    this.doneLoading = this.doneLoading.bind(this)
  }

  doneLoading(){
    if (!this.state.messageBubbled){
      this.props.doneLoading()
      this.setState({
        ...this.state,
        messageBubbled: true,
      })
    }
  }

  render() {
    let title = this.props.data.title
    let content = this.props.data.content
    if (this.props.data.user === undefined) {
      return (<Loading 
        initialMessage="Loading question, Just a sec."
      />)
    }
    this.doneLoading()
    let legend = "Question"
    return (
      <div className="Thread" onClick={this.props.handleClick}>
        <fieldset>
          <legend>{legend}</legend>
          <h2 className="Thread-title">{title}</h2>
          { this.props.data.posts && <mark>Answered</mark>}
          <hr className="Thread-seperator" />
          <Markdown className={"Thread-content-markdown " + (this.props.zoomout ? "zoomout" : "" )} source={content} />
          <ThreadFooter dockBottom={this.props.dockBottom} user={this.props.user} postKey={this.props.postKey} data={this.props.data} />
        </fieldset>
      </div>
    )
  }

}

export default Thread
