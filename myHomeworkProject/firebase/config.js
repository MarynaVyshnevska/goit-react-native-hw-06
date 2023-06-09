// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAr7ARUcalrZDnEv7E5QoSL2BzFue1hkO8",
  authDomain: "lessonreactnative.firebaseapp.com",
  databaseURL: "https://lessonreactnative-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "lessonreactnative",
  storageBucket: "lessonreactnative.appspot.com",
  messagingSenderId: "757745561820",
  appId: "1:757745561820:web:2248bdc8d00880da428419",
  measurementId: "G-SE9T23DE0F"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

