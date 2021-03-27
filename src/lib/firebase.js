import Firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const config = {
  apiKey: "AIzaSyAFl8gGlEFvNG7jj2gbd8eRX7m-KetFyN8",
  authDomain: "instagram-87bb9.firebaseapp.com",
  projectId: "instagram-87bb9",
  storageBucket: "instagram-87bb9.appspot.com",
  messagingSenderId: "616711316970",
  appId: "1:616711316970:web:7747c5bb986ba539683e93",
};

const firebase = Firebase.initializeApp(config);
const { FieldValue } = Firebase.firestore;

export { firebase, FieldValue };
