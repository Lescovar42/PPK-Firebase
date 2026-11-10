import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { auth } from './src/config/firebase';
import { M3DarkColors } from './src/config/m3Theme';
import {
  getAuthSession,
  saveAuthSession,
  clearAuthSession,
} from './src/storage/authStorage';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  const [userSession, setUserSession] = useState(null);
  const [checkingToken, setCheckingToken] = useState(true);

  useEffect(() => {
    checkExistingSession();
  }, []);

  /**
   * Mengecek Local Storage saat aplikasi dibuka.
   * Jika token masih tersimpan dan aktif, langsung bypass halaman Login.
   */
  const checkExistingSession = async () => {
    try {
      const storedSession = await getAuthSession();

      if (storedSession && storedSession.idToken) {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const freshToken = await currentUser.getIdToken();
          const updatedSession = { ...storedSession, idToken: freshToken };
          await saveAuthSession(updatedSession);
          setUserSession(updatedSession);
        } else {
          setUserSession(storedSession);
        }
      } else {
        await clearAuthSession();
        setUserSession(null);
      }
    } catch (error) {
      console.error('Error memeriksa token aktif:', error);
      setUserSession(null);
    } finally {
      setCheckingToken(false);
    }
  };

  if (checkingToken) {
    return (
      <SafeAreaView style={styles.center}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={M3DarkColors.surface}
        />
        <ActivityIndicator size="large" color={M3DarkColors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={M3DarkColors.surface}
      />
      {userSession ? (
        <HomeScreen
          userSession={userSession}
          onLogout={() => setUserSession(null)}
        />
      ) : (
        <LoginScreen
          onLoginSuccess={session => setUserSession(session)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: M3DarkColors.surface,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: M3DarkColors.surface,
  },
});
