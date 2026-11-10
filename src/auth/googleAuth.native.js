import { GoogleAuthProvider, signInWithCredential, signOut } from 'firebase/auth';
import { auth, GOOGLE_WEB_CLIENT_ID } from '../config/firebase';

let configured = false;

/**
 * Lazy-load the native module so the app still opens in Expo Go
 * (where the native Google Sign-In module does not exist).
 */
const getGoogleSignin = () => {
  try {
    const { GoogleSignin } = require('@react-native-google-signin/google-signin');
    if (!configured) {
      GoogleSignin.configure({ webClientId: GOOGLE_WEB_CLIENT_ID });
      configured = true;
    }
    return GoogleSignin;
  } catch (e) {
    throw new Error(
      'Google Sign-In tidak tersedia di Expo Go. Jalankan aplikasi menggunakan development build (expo-dev-client).',
    );
  }
};

/**
 * Android / iOS: native Google Sign-In -> Firebase Auth credential.
 * Returns the signed-in Firebase user, or null if the user cancelled.
 */
export const signInWithGoogle = async () => {
  const GoogleSignin = getGoogleSignin();

  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const response = await GoogleSignin.signIn();

  if (response?.type === 'cancelled') {
    return null;
  }

  const idToken = response?.data?.idToken;
  if (!idToken) {
    throw new Error('ID token Google tidak ditemukan. Periksa GOOGLE_WEB_CLIENT_ID.');
  }

  const credential = GoogleAuthProvider.credential(idToken);
  const userCredential = await signInWithCredential(auth, credential);
  return userCredential.user;
};

export const signOutGoogle = async () => {
  try {
    const GoogleSignin = getGoogleSignin();
    await GoogleSignin.signOut();
  } catch (e) {
    // ignore (e.g. running in Expo Go)
  }
  await signOut(auth).catch(() => {});
};
