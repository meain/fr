import React, { Component } from 'react';
import './Editor.css';

import { Input, Button } from 'antd'
import SimpleMDE from 'react-simplemde-editor'

class Editor extends Component {
  constructor(props) {
    super(props)

    this.state = {
      content: ""
    }

    this.handleClick = this.handleClick.bind(this)
    this.handleChange = this.handleChange.bind(this)

  }

  handleClick(){
    const content = this.state.content
    if(content.length > 0){
      if(this.props.hasHeading){
        const title = this.titleInput.refs.input.value
        if (title.length > 0 && content.length > 0){
          const data = {
            title,
            content
          }
          this.props.onSubmit(data)
        }
      }
      else{
        const data = {
          content
        }
        this.props.onSubmit(data)
      }
    }
  }

  handleChange(data){
    // console.log('data: ', data);
    this.setState({
      content: data
    })
  }

  render(){
    let title = this.props.title ? this.props.title : ""
    return (
      <div className="Editor">
        { title && <pre><h1>{title}</h1></pre> }
        { this.props.hasHeading &&
        <div>
          <Input ref={(ref) => {this.titleInput = ref}} className="Editor-heading" addonBefore="Heading" defaultValue="" />
        <br/>
        <br/>
      </div>
          }
        {/* <Input className="Editor-heading" addonBefore="Heading" defaultValue="" /> */}
        <SimpleMDE
          onChange={this.handleChange}
        />
        {/* <textarea ref={ref => { this.contentInput = ref }} /> */}
        <Button onClick={this.handleClick}> Submit </Button>
        {/* Quick hack with the br */}
        <br/>
        <br/>
        <br/>
      </div>
    )
  }

}

export default Editor
