import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.FB_KEY,
  authDomain: "remind-e59e1.firebaseapp.com",
  projectId: "remind-e59e1",
  storageBucket: "remind-e59e1.firebasestorage.app",
  messagingSenderId: "521752796556",
  appId: "1:521752796556:web:2539293ff91758d0020aa9",
  measurementId: "G-MZNSYRG3NH"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);