import React, {Component} from 'react';
import { userChanged } from './reducers.js'

class NewThead extends Component{
  constructor(props) {
    super(props)

    this.addThread = this.addThread.bind(this)
  }

  addThread(data) {
    if (this.props.user) {
      const thread =
        {
          title: data.title,
          content: data.content,
          createdAt: Date.now(),
          posts: [],  // Sub posts, we will most probably have only one ( jsut in case )
          likes: [],  // Will contain user uids
          stars: [],  // Bookmark question ( implement later )
          user: {
            uid: this.props.user.uid,
            displayName: this.props.user.displayName,
            email: this.props.user.email,
            displayImage: this.props.user.photoURL
          }
        };
      const key = firebase.database().ref('threads').push(thread).key;
      console.log('key: ', key);
      // Add theard data to user
      firebase.database().ref('users/' + this.props.user.uid + '/threads/' + key).set(true);
    }
    // Display what they just posted or route back to main page
  }

  render(){
    return(
      <div className="NewThread">
        <Editor onSubmit={this.addThread} />
      </div>
    )
  }

}

const mapStateToProps = state => {
  return {
    user: state.user,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    userChanged: user => {
      dispatch(userChanged(user))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewThead)
