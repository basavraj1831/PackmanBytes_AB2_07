import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: 'AIzaSyBXvlW3eHu_NmoGqNfL1r4Im7Qp_rPGDzo',
    authDomain: "life-link-2004.firebaseapp.com",
    projectId: "life-link-2004",
    storageBucket: "life-link-2004.firebasestorage.app",
    messagingSenderId: "701331371506",
    appId: "1:701331371506:web:b09e48047eefb64271a76b"
  };

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };