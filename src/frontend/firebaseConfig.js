// // Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD5q0IPo7W-t-TI0xCS-ss4ucFF4PhrRsc",
  authDomain: "callinev2-a22d5.firebaseapp.com",
  projectId: "callinev2-a22d5",
  storageBucket: "callinev2-a22d5.appspot.com",
  messagingSenderId: "450794019288",
  appId: "1:450794019288:web:3efe31350ca82356a43aad",
  measurementId: "G-JML4JM6W3H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;