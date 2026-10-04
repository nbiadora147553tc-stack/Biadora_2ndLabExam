import { useCallback, useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Student } from '@/types/api';
import { ApiError, getStudent } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { PortalTheme as theme } from '@/constants/portal-theme';

export default function StudentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const { token, logout } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStudent = useCallback(async () => {
    if (!id || !token) { setError('A valid student ID is required.'); setLoading(false); return; }
    setLoading(true); setError(''); setStudent(null);
    try {
      setStudent(await getStudent(token, id));
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 401) { await logout(); return; }
      setError(cause instanceof ApiError && cause.status === 404 ? 'Student record not found.' : cause instanceof Error ? cause.message : 'Could not load this student.');
    } finally { setLoading(false); }
  }, [id, token, logout]);

  useEffect(() => {
    void loadStudent();
  }, [loadStudent]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.eyebrow}>CAMPUS CONNECT  /  DIRECTORY</Text>
      <Text style={styles.title}>Student details</Text>
      {loading ? <View style={styles.state}><ActivityIndicator color="#245bb2" /><Text style={styles.text}>Loading student…</Text></View>
        : error ? <Text style={styles.error} accessibilityLiveRegion="polite">{error}</Text>
        : !student ? <Text style={styles.text}>No student record available.</Text> : null}
      <View style={styles.card}>
        <Text style={styles.text}>ID: {id || 'Not available'}</Text>
        <Text style={styles.text}>Name: {student?.name || '—'}</Text>
        <Text style={styles.text}>Email: {student?.email || '—'}</Text>
        <Text style={styles.text}>Course: {student?.course || '—'}</Text>
        <Text style={styles.text}>Year: {student?.year ?? '—'}</Text>
        <Text style={styles.text}>Section: {student?.section || '—'}</Text>
        <Text style={styles.text}>Address: {student?.address || '—'}</Text>
        <Text style={styles.text}>Contact: {student?.contact || '—'}</Text>
      </View>
      <Pressable accessibilityRole="button" style={styles.button} onPress={() => router.back()}><Ionicons name="arrow-back" size={17} color={theme.colors.primary} /><Text style={styles.buttonText}>Back to directory</Text></Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingHorizontal: 22, paddingTop: 24, paddingBottom: 32, gap: 14, backgroundColor: theme.colors.background },
  eyebrow: { color: theme.colors.primary, fontSize: 9, fontWeight: '800', letterSpacing: 1.3 },
  title: { color: theme.colors.navy, fontSize: 27, fontWeight: '800', letterSpacing: -0.6, marginTop: -8 },
  state: { alignSelf: 'stretch', backgroundColor: theme.colors.surface, padding: 17, borderRadius: 15, gap: 10, alignItems: 'center', borderWidth: 1, borderColor: theme.colors.border },
  card: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, padding: 20, gap: 14, borderRadius: 19 },
  text: { color: theme.colors.ink, fontSize: 14, lineHeight: 21, paddingBottom: 9, borderBottomWidth: 1, borderBottomColor: '#EEF2F4' },
  error: { color: theme.colors.danger },
  button: { alignSelf: 'flex-start', flexDirection: 'row', gap: 8, backgroundColor: theme.colors.mint, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: theme.colors.primaryDark, fontWeight: '800', fontSize: 12 },
});
