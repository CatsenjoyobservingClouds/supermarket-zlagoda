// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAcRrxtJqbVQNLK7k58eYtfNfiBpKAWZ6g",
    authDomain: "zlagoda-ca562.firebaseapp.com",
    projectId: "zlagoda-ca562",
    storageBucket: "zlagoda-ca562.appspot.com",
    messagingSenderId: "961924281254",
    appId: "1:961924281254:web:078810c71202dd1bac9567",
    measurementId: "G-CF924GS00T"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;