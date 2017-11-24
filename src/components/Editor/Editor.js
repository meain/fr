import React, { Component } from 'react';
import './Editor.css';

// import { Input, Button } from 'antd'
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
        const title = this.titleInput.value
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
    let title = this.props.title ? this.props.title : "New Question"
    return (
      <div className="Editor">



<fieldset>
    <legend>{title}</legend>
    <div className="form-item">
        <label>Title</label>
        {/* <input type="email" name="user-email" className="w50" /> */}
        <input ref={(ref) => {this.titleInput = ref}} type="text" />
    </div>
    <div className="form-item">
        <label>Question</label>
        {/* <input type="password" name="user-password" className="w50"/> */}
        <SimpleMDE
          onChange={this.handleChange}
        />
    </div>
</fieldset>



{/* <Input ref={(ref) => {this.titleInput = ref}} className="Editor-heading" addonBefore="Heading" defaultValue="" /> */}

{/* <form className="form"> */}
{/*     <div className="form-item"> */}
{/*     </div> */}
{/* </form> */}

        <br/>
        <br/>
          }
        {/* <Input className="Editor-heading" addonBefore="Heading" defaultValue="" /> */}
        {/* <textarea ref={ref => { this.contentInput = ref }} /> */}
{/*<Button onClick={this.handleClick}> Submit </Button>*/}
<button onClick={this.handleClick} className="button">Submit</button>
        {/* Quick hack with the br */}
        <br/>
        <br/>
        <br/>
      </div>
    )
  }

}

export default Editor
