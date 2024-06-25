// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDGieDSiAx0KAeirIJEsfEC044A6ktGDGc",
  authDomain: "react-authentication-93258.firebaseapp.com",
  projectId: "react-authentication-93258",
  storageBucket: "react-authentication-93258.appspot.com",
  messagingSenderId: "800635899069",
  appId: "1:800635899069:web:fa40ed27af248c6bd0bbd4",
  measurementId: "G-7FJ00N14QR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
