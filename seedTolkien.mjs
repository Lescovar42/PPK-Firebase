import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDSakMVeER35DsezMtZuQZ1wDuVKq55qL4",
  authDomain: "ppk-react-native.firebaseapp.com",
  projectId: "ppk-react-native",
  storageBucket: "ppk-react-native.firebasestorage.app",
  messagingSenderId: "940825251566",
  appId: "1:940825251566:web:ef7d42ed8ff87d70642dff"
};

const tolkienMahasiswa = [
  { nama: 'Aragorn Elessar', nim: '2406013019', jurusan: 'Teknik Informatika' },
  { nama: 'Legolas Greenleaf', nim: '2406013021', jurusan: 'Sistem Informasi' },
  { nama: 'Galadriel Artanis', nim: '2406013001', jurusan: 'Ilmu Komputer' },
  { nama: 'Frodo Baggins', nim: '2406013033', jurusan: 'Teknik Komputer' },
  { nama: 'Samwise Gamgee', nim: '2406013034', jurusan: 'Teknologi Informasi' },
  { nama: 'Gandalf Mithrandir', nim: '2406013007', jurusan: 'Sains Data' },
  { nama: 'Elrond Peredhil', nim: '2406013011', jurusan: 'Rekayasa Perangkat Lunak' },
  { nama: 'Fëanor Curufinwë', nim: '2406013003', jurusan: 'Teknik Elektro' },
];

async function seed() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const colRef = collection(db, 'mahasiswa');

  console.log('Menambahkan data mahasiswa (Tolkien Legendarium) ke Firestore...');
  for (const mhs of tolkienMahasiswa) {
    const docRef = await addDoc(colRef, {
      ...mhs,
      createdAt: serverTimestamp(),
    });
    console.log(`+ Berhasil ditambahkan: ${mhs.nama} (${mhs.nim}) -> ID: ${docRef.id}`);
  }

  const snap = await getDocs(colRef);
  console.log(`Total dokumen di koleksi 'mahasiswa' sekarang: ${snap.size}`);
  process.exit(0);
}

seed().catch(err => {
  console.error('Gagal mengisi database:', err);
  process.exit(1);
});
