// Don't know if this is the coolest way to do this.
// But yeah, I am out of f**ks to give

import React, { Component } from 'react'
import './LikeButton.css'

import firebase from '../../firebase.js'

class LikeButton extends Component {

    handleLike(ev, key){
        if (this.props.user){
            let threadLikeRef = firebase.database().ref('threads/' + key + '/likes/' + this.props.user.uid)
            threadLikeRef.once('value', snap => {
                let sval = snap.val()
                let statusVal = true
                if (sval != null)
                    statusVal = !sval
                snap.ref.set(statusVal)
                let userLikeRef = firebase.database().ref('users/' + this.props.user.uid + '/likes/' + key)
                userLikeRef.set(statusVal)
            })
        }
    }

    numOfLikes(){
        console.log('this.props.data: ', this.props.data)
        if ( this.props.data.likes !== undefined ){
            let likes = 0
            for (let i in this.props.data.likes) {
                if (this.props.data.likes[i] === true){
                    likes += 1
                }
            }
            return likes
        }
        else{
            return 0
        }
    }

    render(){
        return (
            <button onClick={this.handleLike}> Likes: { this.numOfLikes() }</button>
        )
    }

}

export default LikeButton
