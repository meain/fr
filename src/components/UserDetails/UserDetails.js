import React, { Component } from 'react'
import moment from 'moment'
import { connect } from 'react-redux'

import './UserDetails.css'

import firebase from '../../firebase.js'
import { updateThreads, userChanged } from '../../reducers.js'

import Loading from '../Loading/Loading'
import MiniThreadList from '../MiniThreadList/MiniThreadList'

class UserDetails extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      key: this.props.match.params.userId,
      user: {},
      answeredQuestions: [],
    }

    this.getUserQuestions = this.getUserQuestions.bind(this)
    this.getLikedQuestions = this.getLikedQuestions.bind(this)
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      ...this.state,
      loading: true,
    })
    firebase.database().ref('users/' + nextProps.match.params.userId).once('value', snap => {
      this.setState({
        ...this.state,
        loading: false,
        user: snap.val(),
        answeredQuestions:[]
      })
      this.populateAnsweredQuestions()
    })
  }

  componentDidMount() {
    firebase.database().ref('users/' + this.state.key).once('value', snap => {
      this.setState({
        ...this.state,
        loading: false,
        user: snap.val(),
        answeredQuestions:[]
      })
      this.populateAnsweredQuestions()
    })
  }

  getThread(key){
    for (let k in this.props.threads){
      if (this.props.threads[k].id === key){
        return this.props.threads[k]
      }
    }
  }

  populateAnsweredQuestions(){
    let posts = []
    for( let p in this.state.user.posts ){
      if (this.state.user.posts[p]){
        posts.push(p)
      }
    }
    for(let post in posts){
      firebase.database().ref('posts/' + posts[post] + '/thread').once('value', snap => {
        let key = snap.val()
        if( key !== undefined || key !== null ){
          let thread = this.getThread(key)
          if (thread !== undefined){
            let answeredQuestions = [...this.state.answeredQuestions]
            let index = answeredQuestions.indexOf(thread)
            if (index > -1)
              answeredQuestions.splice(index, 1)
            answeredQuestions.push(thread)
            this.setState({
              ...this.state,
              answeredQuestions,
            })
          }
        }
      })
    }
  }

  getUserQuestions() {
    if (this.state.user.uid !== undefined) {
      let userThreads = {}
      if (this.state.user.threads){
        userThreads = this.state.user.threads
      }
      let threads = Object.keys(userThreads)
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

  render() {
    let userQuestions = this.getUserQuestions()
    let userLiked = this.getLikedQuestions()
    let likes = userLiked.length
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
                      { this.state.user.admin &&
                                                <div>
                                                  <p><samp>ADMIN</samp></p>
                                                  <br />
                                                </div>
                      }
                      <p><span className="tag success upper">Likes </span>{' '}<span>{likes}</span></p>
                      <p><span className="tag focus upper">Name </span>{' '}<span>{this.state.user.displayName}</span></p>
                      <p><span className="tag warning upper">Joined </span>{' '}<span>{moment(this.state.user.registeredAt).format('LL')}</span></p>
                      <p><span className="tag error upper">Email </span>{' '}<span>{this.state.user.email}</span></p>
                    </fieldset>
                  </div>
                  <div className="col UserDetails-stuff">
                    <MiniThreadList
                      threads={userQuestions}
                      title='Questions'
                      noneMessage='Well, the user has not asked any questions so far.'
                    />
                    <MiniThreadList
                      threads={userLiked}
                      title='Likes'
                      noneMessage='Looks like the user has liked nothing. Some serious person.'
                    />
                    {this.state.user.admin &&
                                        <MiniThreadList
                                          threads={this.state.answeredQuestions}
                                          title='Answered'
                                          noneMessage='Not answered any questions. Yet...'
                                        />
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
