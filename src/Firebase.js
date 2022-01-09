import {initializeApp} from "firebase/app";

// firebaseConfig = require('firebase/app');

//initialize firebase
let firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_KEY,
    authDomain: "walk-safe-a8a0c.firebaseapp.com",
    databaseURL: "https://walk-safe-a8a0c-default-rtdb.firebaseio.com",
  };
  
const app = initializeApp(firebaseConfig);

export default app;