
import { initializeApp } from "firebase/app";

import {getAuth, GoogleAuthProvider} from "firebase/auth"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewiq-a9f2b.firebaseapp.com",
  projectId: "interviewiq-a9f2b",
  storageBucket: "interviewiq-a9f2b.firebasestorage.app",
  messagingSenderId: "836595864821",
  appId: "1:836595864821:web:2feeb9c4e45ab6a716a1bc"
};

const app = initializeApp(firebaseConfig);
const auth =getAuth(app)
const provider=new GoogleAuthProvider()
export {auth,provider}

