import React, { Component } from 'react'

import Thread from '../Thread/Thread'

class ThreadListDisplay extends Component {
  render() {
    let threads = this.props.threads
    let user = this.props.user
    return (
      <div class="ThreadListd">
        {threads.map(thread => (
          <Thread
            key={thread.id}
            user={user}
            postKey={thread.id}
            data={thread.data}
            bordered={this.props.bordered}
            raiseOnHover={this.props.raiseOnHover}
            maxHeight="500px"
            handleClick={e => this.handleClick(e, thread.id)}
          />
        ))}
      </div>
    )
  }
}

export default ThreadListDisplay
