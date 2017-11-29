import React, { Component } from 'react'

import './Editor.css'

import SimpleMDE from 'react-simplemde-editor'

class Editor extends Component {
  constructor(props) {
    super(props)

    this.state = {
      content: ''
    }

    this.handleClick = this.handleClick.bind(this)
    this.handleChange = this.handleChange.bind(this)

  }

  handleClick() {
    const content = this.state.content
    if (content.length > 0) {
      if (this.props.hasHeading) {
        const title = this.titleInput.value
        if (title.length > 0 && content.length > 0) {
          const data = {
            title,
            content
          }
          this.props.onSubmit(data)
        }
      }
      else {
        const data = {
          content
        }
        this.props.onSubmit(data)
      }
    }
  }

  handleChange(data) {
    this.setState({
      content: data
    })
  }

  render() {
    let title = this.props.title ? this.props.title : 'Question'
    return (
      <div className="Editor">
        <fieldset>
          <legend>{title}</legend>
          {this.props.hasHeading &&
            <div className="form-item">
              <label>Title</label> <input ref={(ref) => { this.titleInput = ref }} type="text" />
            </div>
          }
          <div className="form-item">
            {this.props.hasHeading &&
            <label>Summary</label>
            }
            <SimpleMDE
              onChange={this.handleChange}
            />
          </div>
          <button onClick={this.handleClick} className="button outline secondary" style={{ float: 'right' }}>Submit</button>
        </fieldset>
      </div>
    )
  }

}

export default Editor
