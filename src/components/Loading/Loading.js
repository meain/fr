import React, { Component } from 'react'
import Icon from 'react-fa'
import loadingMessages from './LoadingMessages'

import './Loading.css'

class Loading extends Component {
    constructor(props){
        super(props)

        this.state = {
            loadingMessage: props.initialMessage || "On my way!",
            loadingMessages: loadingMessages
        }
    }

    componentDidMount(){
        let messages = this.state.loadingMessages
        setInterval(() => {
            this.setState({
                ...this.state,
                loadingMessage: messages[Math.floor(Math.random() * messages.length)]
            })
        }, 5000);
    }

    render() {
        return (
            <div className="Loading">
                <Icon spin name="adjust" className="Loading-spinner" />
                <p>
                <span className="muted monospace">LOADING</span>
                </p>
                <p>
                <span className="muted monospace">{this.state.loadingMessage}</span>
                </p>
            </div>
        )
    }
}

export default Loading