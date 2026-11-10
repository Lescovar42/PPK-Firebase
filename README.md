# Implementasi Firebase + Google Sign-In + Local Storage di React Native (Expo)

Project ini sudah dikonfigurasi menggunakan **Expo** + **Firebase JS SDK** sehingga Anda tidak perlu mengurus `gradlew`, `SHA-1`, atau Android Studio yang berat.

## Fitur yang Diimplementasikan:
1. **Sign In with Google** pada Firebase Authentication (`firebase/auth` + `expo-auth-session`).
2. **Local Storage** (`@react-native-async-storage/async-storage`) untuk menyimpan informasi user & token login.
3. **Bypass Login Page** otomatis jika masih ada token yang aktif di Local Storage.
4. **Cloud Firestore Database** dengan koleksi `mahasiswa` (`nama`, `nim`, `jurusan`, `createdAt`).
5. **Tampilan Home** berisi form input mahasiswa dan `FlatList` daftar mahasiswa secara real-time.

## Cara Menjalankan (Paling Cepat & Mudah):

1. Masuk ke folder project dan install dependencies:
   ```powershell
   cd C:\Users\Farhan\.gemini\antigravity\scratch\firebase-mahasiswa-rn
   npm install
   ```

2. Buat Project di [Firebase Console](https://console.firebase.google.com/):
   - Klik ikon **Web (`</>`)** di halaman utama project untuk mendaftarkan Web App.
   - Salin objek `firebaseConfig` ke dalam `src/config/firebase.js`.
   - Buka **Authentication -> Sign-in method -> Google -> Enable -> Save**.
   - Buka **Firestore Database -> Create database -> Start in test mode**.

3. Jalankan dengan Expo:
   ```powershell
   npx expo start --web
   ```
   *(Atau `npx expo start` lalu scan QR menggunakan aplikasi **Expo Go** di HP).*
