import {useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {getDatabase, ref, child, get} from 'firebase/database';
import {initializeApp} from 'firebase/app';

function Authenticate () {
  const { handle } = useParams();
  const { uid } = useParams();

  //initialize firebase
  let firebaseConfig = 
  {
    apiKey: "AIzaSyAfn6G63Dind4XNtE9DTI-e76okA3sIjCQ",
    authDomain: "walk-safe-a8a0c.firebaseapp.com",
    databaseURL: "https://walk-safe-a8a0c-default-rtdb.firebaseio.com/",
  };

  initializeApp(firebaseConfig);

  let navigate = useNavigate();

  useEffect(() => {
    let db = getDatabase();
    get(child(ref(db), ${uid}/verification)).then((snapshot) => {
        if (snapshot.exists()){
            if (snapshot.val() === handle)
            {
                console.log("success: " + uid);
                //route to map, pass uid
                navigate('/map', {state: uid});

            } else {
                console.log("incorrect");
            }
        } else {
            console.log("user dne");
        }
    });
  })

  //get uid if user exists
  return (
    <div>
      <img src={require('./loading.webp')} />
      <h3>Get Home Safe</h3>
      <p>getting set up, please wait a moment</p>
    </div>
  )
}

export default Authenticate;