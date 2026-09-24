import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBdUZ60xhZQc1bLuu30vQKapg9TAfK9dYM",
    authDomain: "homev-construction.firebaseapp.com",
    projectId: "homev-construction",
    storageBucket: "homev-construction.firebasestorage.app",
    messagingSenderId: "197062104294",
    appId: "1:197062104294:web:0abef689623e699d7a9727",
    measurementId: "G-3WD0ZKX7ME"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services (auth and storage are in firebaseAdmin.js)
export const db = getFirestore(app);

export default app;
