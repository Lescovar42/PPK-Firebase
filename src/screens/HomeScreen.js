import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { signOutGoogle } from '../auth/googleAuth';
import {
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { mahasiswaCollection } from '../config/firebase';
import { M3DarkColors, M3Shape, M3TypeScale } from '../config/m3Theme';
import { clearAuthSession } from '../storage/authStorage';

export default function HomeScreen({ userSession, onLogout }) {
  const [mahasiswaList, setMahasiswaList] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [nama, setNama] = useState('');
  const [nim, setNim] = useState('');
  const [jurusan, setJurusan] = useState('');

  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    const q = query(mahasiswaCollection, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMahasiswaList(list);
        setLoadingData(false);
      },
      error => {
        console.error('Error mengambil data mahasiswa:', error);
        setLoadingData(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const handleTambahMahasiswa = async () => {
    if (!nama.trim() || !nim.trim() || !jurusan.trim()) {
      Alert.alert('Validasi', 'Nama, NIM, dan Jurusan wajib diisi.');
      return;
    }

    try {
      await addDoc(mahasiswaCollection, {
        nama: nama.trim(),
        nim: nim.trim(),
        jurusan: jurusan.trim(),
        createdAt: serverTimestamp(),
      });
      setNama('');
      setNim('');
      setJurusan('');
    } catch (error) {
      Alert.alert('Gagal Menyimpan', error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await clearAuthSession();
      await signOutGoogle();
      onLogout();
    } catch (error) {
      Alert.alert('Gagal Logout', error.message);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        {/* M3 Top App Bar (Small/Medium configuration, no icons) */}
        <View style={styles.topAppBar}>
          <View style={styles.topAppBarTitleGroup}>
            <Text style={styles.topAppBarTitle}>Data Mahasiswa</Text>
            <Text style={styles.topAppBarSubtitle} numberOfLines={1}>
              {userSession?.displayName || userSession?.email}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.outlinedButton}
            activeOpacity={0.8}
            onPress={handleLogout}
          >
            <Text style={styles.outlinedButtonLabel}>Sign out</Text>
          </TouchableOpacity>
        </View>

        {/* M3 Filled Card: Input Form */}
        <View style={styles.formCard}>
          <Text style={styles.cardHeadline}>Input Mahasiswa Baru</Text>

          {/* M3 Outlined Text Field: Nama */}
          <View style={styles.fieldGroup}>
            <Text
              style={[
                styles.fieldLabel,
                focusedField === 'nama' && styles.fieldLabelFocused,
              ]}
            >
              Nama Lengkap
            </Text>
            <TextInput
              style={[
                styles.outlinedInput,
                focusedField === 'nama' && styles.outlinedInputFocused,
              ]}
              placeholder="Masukkan nama mahasiswa"
              placeholderTextColor={M3DarkColors.outline}
              value={nama}
              onChangeText={setNama}
              onFocus={() => setFocusedField('nama')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          <View style={styles.rowFields}>
            {/* M3 Outlined Text Field: NIM */}
            <View style={[styles.fieldGroup, styles.halfField]}>
              <Text
                style={[
                  styles.fieldLabel,
                  focusedField === 'nim' && styles.fieldLabelFocused,
                ]}
              >
                NIM
              </Text>
              <TextInput
                style={[
                  styles.outlinedInput,
                  focusedField === 'nim' && styles.outlinedInputFocused,
                ]}
                placeholder="Contoh: 240601221"
                placeholderTextColor={M3DarkColors.outline}
                value={nim}
                onChangeText={setNim}
                keyboardType="numeric"
                onFocus={() => setFocusedField('nim')}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            {/* M3 Outlined Text Field: Jurusan */}
            <View style={[styles.fieldGroup, styles.halfField]}>
              <Text
                style={[
                  styles.fieldLabel,
                  focusedField === 'jurusan' && styles.fieldLabelFocused,
                ]}
              >
                Jurusan
              </Text>
              <TextInput
                style={[
                  styles.outlinedInput,
                  focusedField === 'jurusan' && styles.outlinedInputFocused,
                ]}
                placeholder="Contoh: Informatika"
                placeholderTextColor={M3DarkColors.outline}
                value={jurusan}
                onChangeText={setJurusan}
                onFocus={() => setFocusedField('jurusan')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          </View>

          <View style={styles.cardActions}>
            <TouchableOpacity
              style={styles.filledButton}
              activeOpacity={0.85}
              onPress={handleTambahMahasiswa}
            >
              <Text style={styles.filledButtonLabel}>Simpan Mahasiswa</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* M3 Section Subheader */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>Daftar Mahasiswa</Text>
          <View style={styles.tonalBadge}>
            <Text style={styles.tonalBadgeLabel}>{mahasiswaList.length}</Text>
          </View>
        </View>

        {/* M3 List Items */}
        {loadingData ? (
          <ActivityIndicator
            size="large"
            color={M3DarkColors.primary}
            style={{ marginTop: 32 }}
          />
        ) : (
          <FlatList
            data={mahasiswaList}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>Belum ada data</Text>
                <Text style={styles.emptySubtitle}>
                  Tambahkan data mahasiswa melalui formulir di atas.
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.listItemCard}>
                <View style={styles.listItemBody}>
                  <Text style={styles.listItemHeadline}>{item.nama}</Text>
                  <Text style={styles.listItemSupporting}>NIM {item.nim}</Text>
                </View>
                <View style={styles.assistChip}>
                  <Text style={styles.assistChipLabel}>{item.jurusan}</Text>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: M3DarkColors.surface,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 640,
    paddingHorizontal: 16,
  },
  topAppBar: {
    minHeight: 64, // M3 Small Top App Bar height (64dp)
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  topAppBarTitleGroup: {
    flex: 1,
    marginRight: 16,
  },
  topAppBarTitle: {
    ...M3TypeScale.titleLarge,
    color: M3DarkColors.onSurface,
  },
  topAppBarSubtitle: {
    ...M3TypeScale.bodyMedium,
    color: M3DarkColors.onSurfaceVariant,
    marginTop: 2,
  },
  outlinedButton: {
    height: 40, // M3 Common Button height (40dp)
    borderRadius: M3Shape.full,
    borderWidth: 1,
    borderColor: M3DarkColors.outline,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlinedButtonLabel: {
    ...M3TypeScale.labelLarge,
    color: M3DarkColors.primary,
  },
  formCard: {
    backgroundColor: M3DarkColors.surfaceContainerLow,
    borderRadius: M3Shape.medium, // 12dp M3 Card shape
    padding: 16,
    borderWidth: 1,
    borderColor: M3DarkColors.outlineVariant,
    marginBottom: 20,
  },
  cardHeadline: {
    ...M3TypeScale.titleMedium,
    color: M3DarkColors.onSurface,
    marginBottom: 16,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  rowFields: {
    flexDirection: 'row',
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  fieldLabel: {
    ...M3TypeScale.labelMedium,
    color: M3DarkColors.onSurfaceVariant,
    marginBottom: 6,
  },
  fieldLabelFocused: {
    color: M3DarkColors.primary,
  },
  outlinedInput: {
    height: 48,
    borderWidth: 1,
    borderColor: M3DarkColors.outline,
    borderRadius: M3Shape.extraSmall, // 4dp M3 Outlined Text Field corner radius
    paddingHorizontal: 16,
    backgroundColor: M3DarkColors.surfaceContainerLowest,
    ...M3TypeScale.bodyLarge,
    color: M3DarkColors.onSurface,
  },
  outlinedInputFocused: {
    borderWidth: 2,
    borderColor: M3DarkColors.primary,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  filledButton: {
    height: 40, // 40dp M3 button height
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionHeaderText: {
    ...M3TypeScale.titleSmall,
    color: M3DarkColors.onSurfaceVariant,
  },
  tonalBadge: {
    backgroundColor: M3DarkColors.secondaryContainer,
    borderRadius: M3Shape.full,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  tonalBadgeLabel: {
    ...M3TypeScale.labelMedium,
    color: M3DarkColors.onSecondaryContainer,
  },
  listContent: {
    paddingBottom: 24,
  },
  listItemCard: {
    minHeight: 72, // M3 Two-line list item height (72dp)
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: M3DarkColors.surfaceContainer,
    borderRadius: M3Shape.medium, // 12dp M3 card shape
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  listItemBody: {
    flex: 1,
    marginRight: 16,
  },
  listItemHeadline: {
    ...M3TypeScale.bodyLarge,
    color: M3DarkColors.onSurface,
  },
  listItemSupporting: {
    ...M3TypeScale.bodyMedium,
    color: M3DarkColors.onSurfaceVariant,
    marginTop: 2,
  },
  assistChip: {
    height: 32, // M3 Chip height (32dp)
    borderRadius: M3Shape.small, // 8dp M3 Chip corner radius
    backgroundColor: M3DarkColors.secondaryContainer,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assistChipLabel: {
    ...M3TypeScale.labelLarge,
    color: M3DarkColors.onSecondaryContainer,
  },
  emptyContainer: {
    backgroundColor: M3DarkColors.surfaceContainerLow,
    borderRadius: M3Shape.medium,
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  emptyTitle: {
    ...M3TypeScale.titleMedium,
    color: M3DarkColors.onSurface,
    marginBottom: 4,
  },
  emptySubtitle: {
    ...M3TypeScale.bodyMedium,
    color: M3DarkColors.onSurfaceVariant,
    textAlign: 'center',
  },
});
