import * as firebase from "firebase/app";
import "firebase/auth";

const app = firebase.initializeApp({
  apiKey: "AIzaSyCiVqB0wXIZwz0g41tFcpD7r-O7WIL1oNQ",
  authDomain: "bilety-online.firebaseapp.com",
  databaseURL: "https://bilety-online.firebaseio.com",
  projectId: "bilety-online",
  storageBucket: "bilety-online.appspot.com",
  messagingSenderId: "241051588400",
  appId: "1:241051588400:web:35a5c1d17efbc734b5daf5",
  measurementId: "G-Y8RMC2PJMR",
});

export default app;
