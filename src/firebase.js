import firebase from 'firebase'
const config = {
    apiKey: 'AIzaSyCV_wkx8gh3NzFuctl6AdSZ10ZK1qkv8qY',
    authDomain: 'free-6d535.firebaseapp.com',
    databaseURL: 'https://free-6d535.firebaseio.com',
    projectId: 'free-6d535',
    storageBucket: 'free-6d535.appspot.com',
    messagingSenderId: '311645062968'
}
firebase.initializeApp(config)
export const provider = new firebase.auth.GoogleAuthProvider()
export const auth = firebase.auth()
export default firebase
