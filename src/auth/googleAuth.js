import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

/**
 * Web: Google Sign-In via Firebase popup.
 * Returns the signed-in Firebase user.
 */
export const signInWithGoogle = async () => {
  const userCredential = await signInWithPopup(auth, googleProvider);
  return userCredential.user;
};

export const signOutGoogle = async () => {
  await signOut(auth).catch(() => {});
};
