// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, signOut,signInWithPopup,GoogleAuthProvider,setPersistence,browserLocalPersistence} from "firebase/auth";
import { getDatabase, ref, push ,get,onValue,remove,child,update } from "firebase/database";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmBsj3MXTA6MQaMSfiqfmuMSZM4SWRJPo",
  authDomain: "tictactoe-556ff.firebaseapp.com",
  projectId: "tictactoe-556ff",
  storageBucket: "tictactoe-556ff.appspot.com",
  messagingSenderId: "823444216852",
  databaseURL:"https://tictactoe-556ff-default-rtdb.asia-southeast1.firebasedatabase.app/",
  appId: "1:823444216852:web:f198444eb0cd087157db01",
  measurementId: "G-WM1CTD4GYN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();
const database = getDatabase(app);
const gameRef = ref(database, 'games/game_id/state');
export  {update,gameRef,ref,push,get,onValue,remove,child,auth,signInWithPopup,googleAuthProvider,analytics,signOut,setPersistence,browserLocalPersistence,database};