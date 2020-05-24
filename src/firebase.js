import firebase from "firebase/app";
import "firebase/auth";
let config = {
  apiKey: "AIzaSyDUefAc2fEMu1Uez0Cfo7tkkqvGqdLPL6Y",
  authDomain: "csai-b408c.firebaseapp.com",
  databaseURL: "https://csai-b408c.firebaseio.com",
  projectId: "csai-b408c",
  storageBucket: "csai-b408c.appspot.com",
  messagingSenderId: "389831924448",
  appId: "1:389831924448:web:b6387ec7e4375868",
};

firebase.initializeApp(config);
export const auth = firebase.auth();
