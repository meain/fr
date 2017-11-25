import React, { Component } from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import './UserDetails.css'

import firebase from '../../firebase.js'
import { updateThreads, userChanged } from '../../reducers.js'

import Loading from '../Loading/Loading'

class UserDetails extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            key: window.location.pathname.split('/')[2],
            user: {},
        }

        this.getLikes = this.getLikes.bind(this)
        this.getUserQuestions = this.getUserQuestions.bind(this)
        this.getLikedQuestions = this.getLikedQuestions.bind(this)
    }

    componentDidMount() {
        firebase.database().ref('users/' + this.state.key).once('value', snap => {
            this.setState({
                ...this.state,
                loading: false,
                user: snap.val()
            })
        })
    }

    getLikes() {
        if (this.state.user.likes) {
            let likes = []
            for ( let like in this.state.user.likes){
                if (this.state.user.likes[like]){
                    likes.push(like)
                }
            }
            return likes.length
        }
        else {
            return 0
        }
    }

    getUserQuestions() {
        if (this.state.user.uid !== undefined) {
            let threads = Object.keys(this.state.user.threads)
            let threadData = this.props.threads.filter((thread) => threads.indexOf(thread.id) !== -1)
            return threadData
        }
        return []
    }

    getLikedQuestions() {
        if (this.state.user.uid !== undefined) {
            let threads = []
            for(let t in this.state.user.likes ){
                if (this.state.user.likes[t]){
                    threads.push(t)
                }
            }
            let threadData = this.props.threads.filter((thread) => threads.indexOf(thread.id) !== -1)
            return threadData
        }
        return []
    }

    getLikesForThread(thread){
        let likes = []
        for ( let like in thread.likes){
            if (thread.likes[like]){
                likes.push(like)
            }
        }
        return likes.length
    }

    render() {
        let likes = this.getLikes()
        let userQuestions = this.getUserQuestions()
        let userLiked = this.getLikedQuestions()
        return (
            <div>
                {
                    (this.state.loading && this.state.user != null) ?
                        <Loading />
                        :
                        <div className="UserDetails">
                            {this.state.user === null ?
                                <p className="UserDetails-unknown">
                                    <span className="tag error upper">ERROR: </span><span>Unknown user</span>
                                    <br />
                                    <span className="muted">Most probably just a deleted account.</span>
                                </p>
                                :
                                <div className="row auto">
                                    <div className="col UserDetails-user">
                                        <fieldset>
                                            <legend>User</legend>
                                            <img className="UserDetails-image" src={this.state.user.displayImage} alt={this.state.user.displayName} />
                                            <p><span className="tag focus upper">Name </span>{' '}<span>{this.state.user.displayName}</span></p>
                                            <hr />
                                            <p><span className="tag error upper">Email </span>{' '}<span>{this.state.user.email}</span></p>
                                            <hr />
                                            <p><span className="tag success upper">Likes </span>{' '}<span>{likes}</span></p>
                                            <hr />
                                            <p><span className="tag warning upper">Joined </span>{' '}<span>{moment(this.state.user.registeredAt).fromNow()}</span></p>
                                        </fieldset>
                                    </div>
                                    <div className="col UserDetails-stuff">
                                        <fieldset>
                                            <legend>Questions</legend>
                                            { Object.keys(userQuestions).length > 0 ?
                                            <table className="striped">
                                                <tbody>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Question</th>
                                                        <th>Likes</th>
                                                    </tr>
                                                    {userQuestions.map((thread, i) => {
                                                        return (
                                                            <tr key={thread.id}>
                                                                <td>{i + 1}</td>
                                                                <td><Link to={"/thread/" + thread.id}>{thread.data.title}</Link></td>
                                                                <td>{this.getLikesForThread(thread.data)}</td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                            :
                                            <p className="UserDetails-none">
                                            <span className="muted">Well, the user has not asked any questions so far.</span>
                                            </p>
                                            }
                                        </fieldset>
                                        <fieldset>
                                            <legend>Likes</legend>
                                            { Object.keys(userLiked).length > 0 ?
                                            <table className="striped">
                                                <tbody>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Question</th>
                                                        <th>Likes</th>
                                                    </tr>
                                                    {userLiked.map((thread, i) => {
                                                        return (
                                                            <tr key={thread.id}>
                                                                <td>{i + 1}</td>
                                                                <td><Link to={"/thread/" + thread.id}>{thread.data.title}</Link></td>
                                                                <td>{this.getLikesForThread(thread.data)}</td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                            :
                                            <p className="UserDetails-none">
                                            <span className="muted">Looks like the user has liked nothing. Some serious person.</span>
                                            </p>
                                            }
                                        </fieldset>
                                        {this.state.user.admin &&
                                            <fieldset>
                                                <legend>Answers</legend>
                                            </fieldset>
                                        }
                                    </div>
                                </div>
                            }
                        </div>
                }
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        user: state.user,
        threads: state.threads,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        threadsChanged: threads => {
            dispatch(updateThreads(threads))
        },
        userChanged: user => {
            dispatch(userChanged(user))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserDetails)
