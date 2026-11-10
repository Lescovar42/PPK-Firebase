import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_STORAGE_KEY = '@auth_session';

/**
 * Menyimpan data user dan token ke Local Storage (AsyncStorage)
 */
export const saveAuthSession = async ({ uid, email, displayName, idToken }) => {
  try {
    const sessionData = JSON.stringify({
      uid,
      email,
      displayName,
      idToken,
      savedAt: Date.now(),
    });
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, sessionData);
  } catch (error) {
    console.error('Gagal menyimpan sesi login:', error);
  }
};

/**
 * Mengambil data user dan token dari Local Storage
 */
export const getAuthSession = async () => {
  try {
    const raw = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error('Gagal membaca sesi login:', error);
    return null;
  }
};

/**
 * Menghapus data sesi saat logout
 */
export const clearAuthSession = async () => {
  try {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.error('Gagal menghapus sesi login:', error);
  }
};
