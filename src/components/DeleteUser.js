import {getDatabase, set, ref} from "firebase/database";
import {getAuth} from "firebase/auth";
import firebase from "../Firebase.js"

export function DeleteUser () {
    let erase = getAuth(firebase).currentUser.uid;

    if (erase != null) {
        let db = getDatabase(firebase);
        set(ref(db, `viewers/${erase}`), null);
    }
}