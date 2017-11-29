import React, { Component } from 'react'
import {Link} from 'react-router-dom'

import './MiniThreadList.css'

class MiniThreadList extends Component{

    getLikesForThread(thread){
        let likes = []
        for ( let like in thread.likes){
            if (thread.likes[like]){
                likes.push(like)
            }
        }
        return likes.length
    }

    render(){
        let threads = this.props.threads
        let title = this.props.title
        let noneMessage = this.props.noneMessage
        return (
            <fieldset>
                <legend>{title}</legend>
                { Object.keys(threads).length > 0 ?
                    <table >
                        <tbody>
                            <tr>
                                <th>#</th>
                                <th>Question</th>
                                <th>Likes</th>
                            </tr>
                            {threads.map((thread, i) => {
                                return (
                                    <tr key={thread.id}>
                                        <td>{i + 1}</td>
                                        <td><Link to={'/thread/' + thread.id}>{thread.data.title}</Link></td>
                                        <td>{this.getLikesForThread(thread.data)}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    :
                    <p className="MiniThreadList-none">
                        <span className="muted">{noneMessage}</span>
                    </p>
                }
            </fieldset>
        )
    }
}

export default MiniThreadList
