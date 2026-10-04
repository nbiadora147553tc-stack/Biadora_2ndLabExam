import { useCallback, useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { ApiError, getStudent } from '@/lib/api';
import type { Student } from '@/types/api';

export default function StudentDetailsScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const { token, signOut } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  const loadStudent = useCallback(async () => {
    setStudent(null);
    setNotFound(false);
    setError('');
    if (!id || !id.trim() || !token) {
      setLoading(false);
      if (!id || !id.trim()) setError('The student ID is invalid.');
      return;
    }

    setLoading(true);
    try {
      setStudent(await getStudent(token, id));
    } catch (requestError) {
      if (requestError instanceof ApiError && requestError.status === 401) {
        await signOut();
      } else if (requestError instanceof ApiError && requestError.status === 404) {
        setNotFound(true);
      } else {
        setError(requestError instanceof Error ? requestError.message : 'Unable to load this student.');
      }
    } finally {
      setLoading(false);
    }
  }, [id, token, signOut]);

  useEffect(() => {
    void loadStudent();
  }, [loadStudent]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Student Details</Text>
      {loading ? (
        <View style={styles.state}><ActivityIndicator color="#245bb2" /><Text style={styles.text}>Loading student…</Text></View>
      ) : notFound ? (
        <Text style={styles.text}>Student not found.</Text>
      ) : error ? (
        <View style={styles.state} accessibilityLiveRegion="polite">
          <Text style={styles.error}>{error}</Text>
          {token ? <Pressable accessibilityRole="button" onPress={() => void loadStudent()}><Text style={styles.link}>Retry</Text></Pressable> : null}
        </View>
      ) : student ? (
        <View style={styles.card}>
          <Text style={styles.text}>ID: {student.id}</Text>
          <Text style={styles.text}>Name: {student.name || '—'}</Text>
          <Text style={styles.text}>Email: {student.email || '—'}</Text>
          <Text style={styles.text}>Course: {student.course || '—'}</Text>
          <Text style={styles.text}>Year: {student.year ?? '—'}</Text>
          <Text style={styles.text}>Section: {student.section || '—'}</Text>
          <Text style={styles.text}>Address: {student.address || '—'}</Text>
          <Text style={styles.text}>Contact: {student.contact || '—'}</Text>
        </View>
      ) : null}
      <Pressable accessibilityRole="button" style={styles.button} onPress={() => router.back()}><Text style={styles.buttonText}>Back</Text></Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, gap: 20, backgroundColor: '#f2f5fa' },
  title: { color: '#17324d', fontSize: 28, fontWeight: '700' },
  state: { gap: 12, alignItems: 'center' },
  card: { backgroundColor: '#ffffff', padding: 20, gap: 16, borderRadius: 12 },
  text: { color: '#536579', fontSize: 16 },
  error: { color: '#b42318', textAlign: 'center' },
  link: { color: '#245bb2', padding: 12 },
  button: { backgroundColor: '#245bb2', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#ffffff', fontWeight: '600' },
});
