import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
import { getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage"



const firebaseConfig = {
    apiKey: "AIzaSyA4DdR7T589Gt2QmUOriknN69BSTQV6Il4",
    authDomain: "pralap-d5a53.firebaseapp.com",
    projectId: "pralap-d5a53",
    storageBucket: "pralap-d5a53.appspot.com",
    messagingSenderId: "1013808145500",
    appId: "1:1013808145500:web:7a1e14a64372277ca0b299",
    measurementId: "G-RRZ5GJK224"
  };
    

    const app= initializeApp(firebaseConfig)
 const auth= getAuth(app)
 const provider = new GoogleAuthProvider();

 export const db = getFirestore(app)
 export {auth, provider};
 export const storage= getStorage(app)
