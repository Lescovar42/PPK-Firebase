import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
// Metro picks googleAuth.native.js on Android/iOS and googleAuth.js on Web
import { signInWithGoogle } from '../auth/googleAuth';
import { M3DarkColors, M3Shape, M3TypeScale } from '../config/m3Theme';
import { saveAuthSession } from '../storage/authStorage';

export default function LoginScreen({ onLoginSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      const user = await signInWithGoogle();
      if (!user) return; // user membatalkan login

      const firebaseToken = await user.getIdToken();
      const session = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        idToken: firebaseToken,
      };

      // Simpan token dan info user ke Local Storage (AsyncStorage)
      await saveAuthSession(session);
      onLoginSuccess(session);
    } catch (error) {
      Alert.alert('Login Gagal', error.message || 'Terjadi kesalahan saat login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.surfaceCard}>
        <Text style={styles.overline}>SISTEM AKADEMIK</Text>
        <Text style={styles.headline}>Portal Mahasiswa</Text>
        <Text style={styles.supportingText}>
          Masuk menggunakan akun Google untuk mengakses dan mengelola data mahasiswa pada Cloud Firestore.
        </Text>

        <TouchableOpacity
          style={styles.filledButton}
          activeOpacity={0.85}
          onPress={handleGoogleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={M3DarkColors.onPrimary} />
          ) : (
            <Text style={styles.filledButtonLabel}>Sign in with Google</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: M3DarkColors.surface,
  },
  surfaceCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: M3DarkColors.surfaceContainerHigh,
    borderRadius: M3Shape.extraLarge, // 28dp M3 Extra Large container
    padding: 24,
    borderWidth: 1,
    borderColor: M3DarkColors.outlineVariant,
  },
  overline: {
    ...M3TypeScale.labelMedium,
    color: M3DarkColors.primary,
    marginBottom: 8,
  },
  headline: {
    ...M3TypeScale.headlineSmall,
    color: M3DarkColors.onSurface,
    marginBottom: 12,
  },
  supportingText: {
    ...M3TypeScale.bodyMedium,
    color: M3DarkColors.onSurfaceVariant,
    marginBottom: 24,
  },
  filledButton: {
    height: 40, // Official M3 Common Button height (40dp)
    borderRadius: M3Shape.full,
    backgroundColor: M3DarkColors.primary,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filledButtonLabel: {
    ...M3TypeScale.labelLarge,
    color: M3DarkColors.onPrimary,
  },
});
