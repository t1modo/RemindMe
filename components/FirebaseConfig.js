import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FB_KEY } from '@env';

const firebaseConfig = {
  apiKey: FB_KEY,
  authDomain: "remind-e59e1.firebaseapp.com",
  projectId: "remind-e59e1",
  storageBucket: "remind-e59e1.appspot.com",
  messagingSenderId: "521752796556",
  appId: "1:521752796556:web:2539293ff91758d0020aa9",
  measurementId: "G-MZNSYRG3NH",
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { db, auth, app };
