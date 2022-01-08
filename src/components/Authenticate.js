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
    apiKey: process.env.REACT_APP_FIREBASE_KEY,
    authDomain: "walk-safe-a8a0c.firebaseapp.com",
    databaseURL: "https://walk-safe-a8a0c-default-rtdb.firebaseio.com",
  };

  initializeApp(firebaseConfig);

  let navigate = useNavigate();

  useEffect(() => {
    let db = getDatabase();
    get(child(ref(db), `users/${uid}/verification`)).then((snapshot) => {
        if (snapshot.exists()){
            if (snapshot.val() === Hash(handle))
            {
                console.log("success: " + uid);
                //route to map, pass uid
                navigate('/map', {state: uid});
                
            } else {
                console.log("incorrect");
                navigate('/error');
            }
        } else {
            console.log("user dne");
            navigate('/error');
        }
    });
  })

  const Hash = (string)  => {
    let hash = 0;
  
    for (let i=0; i<string.length; i++) {
        let c = string.charCodeAt(i);
        hash = ((hash << 5) - hash ) + c;
    }
    return hash;
  }

  //get uid if user exists
        const container = {
            top: '50%',
            left: '50%',
            textAlign: 'center'
        }
        const title = {
            color: "#6CBCAE",
            fontSize: 30,
            fontWeight: "bold",
            marginTop: 50,
        }

        const image = {
            marginBottom: -100,
            marginTop: 150
        }

        const paragraph = {
            marginTop: -20
        }
        return(
            <div style={container}>
                <img style={image} src={require('./loading.webp')} />
                <h3 style={title}>Get Home Safe</h3>
                <p style={paragraph}>getting set up, please wait a moment</p>
          </div>
          );
    }

export default Authenticate;
