// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBezddidJqz4tJa5RP3yODHAU9UWMZgpvI",
  authDomain: "obracon-checklist.firebaseapp.com",
  projectId: "obracon-checklist",
  storageBucket: "obracon-checklist.firebasestorage.app",
  messagingSenderId: "173395086672",
  appId: "1:173395086672:web:b8f294132cc4d9d930f055",
  measurementId: "G-9EWGKXE5ZM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
const db = getFirestore(app);
const storage = getStorage(app);

// Export Firebase services
export { db, storage, analytics };