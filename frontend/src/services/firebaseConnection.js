import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB4YE6N4Z3I553VKjK25s2QV0q9c5I9cTk",
  authDomain: "sistema-a2db4.firebaseapp.com",
  projectId: "sistema-a2db4",
  storageBucket: "sistema-a2db4.appspot.com",
  messagingSenderId: "271477287503",
  appId: "1:271477287503:web:578eed6fbe2373d56cd83a"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;