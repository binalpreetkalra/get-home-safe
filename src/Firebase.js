import {initializeApp} from "firebase/app";

// firebaseConfig = require('firebase/app');

//initialize firebase
let firebaseConfig = {
    apiKey: "AIzaSyAfn6G63Dind4XNtE9DTI-e76okA3sIjCQ",
    authDomain: "walk-safe-a8a0c.firebaseapp.com",
    databaseURL: "https://walk-safe-a8a0c-default-rtdb.firebaseio.com",
  };
  
const app = initializeApp(firebaseConfig);

export default app;