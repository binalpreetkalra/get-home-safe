import {useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {getDatabase, ref, child, get, set} from 'firebase/database';
import { getAuth, signInAnonymously } from "firebase/auth";

import firebase from '../Firebase.js';

function Authenticate () {
  const { handle } = useParams();
  const { uid } = useParams();

  let navigate = useNavigate();
  let db = getDatabase(firebase);

  //if the url is valid, add approved user to the current user's info -- firebase rules
  const addApproved = () => {
      console.log("HERE");
      let auth = getAuth(firebase);
      signInAnonymously(auth)
      .then((credential) => {
          console.log("UID: ", credential.user.uid);
          let curr_uid = credential.user.uid;
          set(ref(db, `viewers/${curr_uid}`), uid)
          .then(navigate('/map', {state: uid}));
      })
      .catch((error) => {
          console.log(error);
      })
  }

  //check is url matches whats stored in db
  useEffect(() => {
    get(child(ref(db), `users/${uid}/verification`)).then((snapshot) => {
        if (snapshot.exists()){
            if (snapshot.val() === Hash(handle))
            {
                //route to map, pass uid
                addApproved();
                
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
