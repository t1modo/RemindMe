// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FB_KEY,
  authDomain: "remind-e59e1.firebaseapp.com",
  projectId: "remind-e59e1",
  storageBucket: "remind-e59e1.firebasestorage.app",
  messagingSenderId: "521752796556",
  appId: "1:521752796556:web:2539293ff91758d0020aa9",
  measurementId: "G-MZNSYRG3NH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);