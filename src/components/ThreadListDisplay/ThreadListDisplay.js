import React, { Component } from 'react'

import Thread from '../Thread/Thread'

class ThreadListDisplay extends Component {

  constructor(props){
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(ev, key) {
    this.props.handleClick(key, ev)
  }

  render() {
    let threads = this.props.threads
    let user = this.props.user
    return (
      <div className="ThreadListDisplay">
        {threads.map(thread => (
          <Thread
            key={thread.id}
            user={user}
            postKey={thread.id}
            data={thread.data}
            bordered={this.props.bordered}
            raiseOnHover={this.props.raiseOnHover}
            maxHeight={this.props.maxHeight}
            handleClick={e => this.handleClick(e, thread.id)}
          />
        ))}
      </div>
    )
  }
}

export default ThreadListDisplay
