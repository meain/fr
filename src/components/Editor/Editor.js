import React, { Component } from 'react';
import './Editor.css';

class Editor extends Component {
  constructor(props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)

  }

  handleClick(){
    const title = this.titleInput.value
    const content = this.contentInput.value
    if (title.length > 0 && content.length > 0){
      const data = {
        title,
        content
      }
      this.titleInput.value = ""
      this.contentInput.value = ""
      this.props.onSubmit(data)
    }
  }

  render(){
    return (
      <div className="Editor">
        <input type="text" ref={ref => this.titleInput = ref} />
        <textarea ref={ref => { this.contentInput = ref }} />
        <button onClick={this.handleClick}> Add </button>
      </div>
    )
  }

}

export default Editor
