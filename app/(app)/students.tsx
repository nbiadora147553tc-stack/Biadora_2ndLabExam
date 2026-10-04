import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import StudentCard from '@/components/StudentCard';
import { useAuth } from '@/hooks/useAuth';
import { ApiError, getStudents } from '@/lib/api';
import type { Student } from '@/types/api';

export default function StudentsScreen() {
  const { token, signOut } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const loadStudents = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      setStudents(await getStudents(token));
    } catch (requestError) {
      if (requestError instanceof ApiError && requestError.status === 401) {
        await signOut();
      } else {
        setError(requestError instanceof Error ? requestError.message : 'Unable to load students.');
      }
    } finally {
      setLoading(false);
    }
  }, [token, signOut]);

  useEffect(() => {
    void loadStudents();
  }, [loadStudents]);

  const normalizedSearch = search.trim().toLocaleLowerCase();
  const filteredStudents = students.filter((student) =>
    [student.name, student.id, student.course]
      .some((value) => String(value ?? '').toLocaleLowerCase().includes(normalizedSearch)),
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Students</Text>
      <TextInput
        style={styles.input}
        accessibilityLabel="Search students"
        placeholder="Search by name, ID, or course"
        value={search}
        onChangeText={setSearch}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {loading ? (
        <View style={styles.state}><ActivityIndicator color="#245bb2" /><Text style={styles.text}>Loading students…</Text></View>
      ) : error ? (
        <View style={styles.state} accessibilityLiveRegion="polite">
          <Text style={styles.error}>{error}</Text>
          <Pressable accessibilityRole="button" onPress={() => void loadStudents()}><Text style={styles.link}>Retry</Text></Pressable>
        </View>
      ) : (
        <FlatList
          data={filteredStudents}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <StudentCard student={item} />}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={<View style={styles.state}><Text style={styles.text}>{students.length === 0 ? 'No students found.' : 'No students match your search.'}</Text></View>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f2f5fa' },
  title: { fontSize: 28, fontWeight: '700', color: '#17324d', marginBottom: 20 },
  input: { padding: 14, borderWidth: 1, borderColor: '#c6d2e1', borderRadius: 8, backgroundColor: '#ffffff', color: '#17324d', marginBottom: 20 },
  state: { padding: 24, gap: 12, alignItems: 'center' },
  text: { color: '#536579' },
  error: { color: '#b42318', textAlign: 'center' },
  link: { color: '#245bb2', padding: 12 },
});
