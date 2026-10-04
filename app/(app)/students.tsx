import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import StudentCard from '@/components/StudentCard';
import type { Student } from '@/types/api';
import { ApiError, getStudents } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { PortalTheme as theme } from '@/constants/portal-theme';

export default function StudentsScreen() {
  const { token, logout } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const loadStudents = useCallback(async () => {
    if (!token) return;
    setLoading(true); setError('');
    try {
      const records = await getStudents(token);
      if (!Array.isArray(records)) throw new Error('The service returned an invalid student list.');
      setStudents(records);
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 401) { await logout(); return; }
      setError(cause instanceof Error ? cause.message : 'Could not load students.');
    } finally { setLoading(false); }
  }, [token, logout]);

  useEffect(() => {
    void loadStudents();
  }, [loadStudents]);

  const query = search.trim().toLocaleLowerCase();
  const filteredStudents = students.filter((student) => [student.name, student.email, student.course, student.section]
    .some((value) => typeof value === 'string' && value.toLocaleLowerCase().includes(query)));

  return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={styles.eyebrow}>CAMPUS CONNECT</Text><Text style={styles.title}>Student directory</Text><Text style={styles.subtitle}>Browse and search student records.</Text></View>
      <View style={styles.searchBox}><Ionicons name="search-outline" size={19} color={theme.colors.muted} /><TextInput style={styles.input} accessibilityLabel="Search students" placeholder="Name, email, course or section" placeholderTextColor="#9AAAB5" value={search} onChangeText={setSearch} /></View>
      {loading ? (
        <View style={styles.state}><ActivityIndicator color="#245bb2" /><Text style={styles.text}>Loading students…</Text></View>
      ) : error ? (
        <View style={styles.state} accessibilityLiveRegion="polite"><Text style={styles.error}>{error}</Text><Pressable accessibilityRole="button" onPress={loadStudents}><Text style={styles.link}>Try Again</Text></Pressable></View>
      ) : (
        <FlatList
          data={filteredStudents}
          keyExtractor={(item, index) => String(item.id ?? index)}
          renderItem={({ item }) => <StudentCard student={item} />}
          ListEmptyComponent={<View style={styles.state}><Text style={styles.text}>{students.length ? 'No students match your search.' : 'No student records are available.'}</Text></View>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 22, backgroundColor: theme.colors.background },
  header: { marginBottom: 17 },
  eyebrow: { fontSize: 9, fontWeight: '800', letterSpacing: 1.4, color: theme.colors.primary, marginBottom: 6 },
  title: { fontSize: 27, lineHeight: 32, fontWeight: '800', letterSpacing: -0.6, color: theme.colors.navy },
  subtitle: { color: theme.colors.muted, fontSize: 13, marginTop: 5 },
  searchBox: { height: 51, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface, marginBottom: 16 },
  input: { flex: 1, height: '100%', color: theme.colors.navy, fontSize: 13 },
  state: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 18, padding: 24, gap: 12, alignItems: 'center', marginTop: 8 },
  text: { color: theme.colors.muted, fontSize: 12, lineHeight: 18, textAlign: 'center' },
  note: { color: theme.colors.muted, fontSize: 12 },
  error: { color: theme.colors.danger, textAlign: 'center', lineHeight: 19 },
  link: { color: theme.colors.primary, fontWeight: '800', padding: 12 },
});
