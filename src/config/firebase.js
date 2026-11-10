import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp, getApps, getApp } from 'firebase/app';
import * as firebaseAuth from 'firebase/auth';
import { getFirestore, collection } from 'firebase/firestore';

// 1. Konfigurasi Firebase dari Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDSakMVeER35DsezMtZuQZ1wDuVKq55qL4",
  authDomain: "ppk-react-native.firebaseapp.com",
  projectId: "ppk-react-native",
  storageBucket: "ppk-react-native.firebasestorage.app",
  messagingSenderId: "940825251566",
  appId: "1:940825251566:web:ef7d42ed8ff87d70642dff"
};

// 2. Web Client ID untuk Google Sign-In di Android (development build)
//    Firebase Console -> Authentication -> Sign-in method -> Google -> Web SDK configuration -> Web client ID
export const GOOGLE_WEB_CLIENT_ID = '940825251566-264m6bgskuss1edhtjjvcha18lmrhbtk.apps.googleusercontent.com';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let authInstance;
try {
  if (
    Platform.OS !== 'web' &&
    typeof firebaseAuth.getReactNativePersistence === 'function'
  ) {
    authInstance = firebaseAuth.initializeAuth(app, {
      persistence: firebaseAuth.getReactNativePersistence(AsyncStorage),
    });
  } else {
    authInstance = firebaseAuth.getAuth(app);
  }
} catch (e) {
  authInstance = firebaseAuth.getAuth(app);
}

export const auth = authInstance;
export const googleProvider = new firebaseAuth.GoogleAuthProvider();
export const db = getFirestore(app);
export const mahasiswaCollection = collection(db, 'mahasiswa');
