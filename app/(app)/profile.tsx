import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { Profile } from '@/types/api';
import { ApiError, getProfile } from '@/lib/api';

export default function ProfileScreen() {
  const { user, token, logout } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!token) return;
    let active = true;
    const loadProfile = async () => {
      setLoading(true); setError('');
      try { const result = await getProfile(token); if (active) setProfile(result); }
      catch (cause) {
        if (cause instanceof ApiError && cause.status === 401) { await logout(); return; }
        if (active) setError(cause instanceof Error ? cause.message : 'Could not load your profile.');
      } finally { if (active) setLoading(false); }
    };
    void loadProfile();
    return () => { active = false; };
  }, [token, logout]);
  const displayed = profile ?? user;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>MY PROFILE</Text>
      <View style={styles.card}>
        {loading ? <ActivityIndicator color="#245bb2" /> : null}
        {error ? <Text style={styles.error} accessibilityLiveRegion="polite">{error}</Text> : null}
        <Text style={styles.text}>Name: {displayed?.name || '—'}</Text>
        <Text style={styles.text}>Email: {displayed?.email || '—'}</Text>
        <Text style={styles.text}>Section: {displayed?.section || '—'}</Text>
        <Text style={styles.text}>Role: {displayed?.role || '—'}</Text>
      </View>
      <Text style={styles.text}>Session Status: {token ? 'Authenticated' : 'Not Available'}</Text>
      <Pressable accessibilityRole="button" style={styles.button} onPress={logout}><Text style={styles.buttonText}>LOGOUT</Text></Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, gap: 20, backgroundColor: '#f2f5fa' },
  title: { color: '#17324d', fontSize: 24, fontWeight: '700' },
  card: { backgroundColor: '#ffffff', padding: 20, gap: 16, borderRadius: 12 },
  text: { color: '#536579', fontSize: 16 },
  note: { color: '#536579', fontSize: 12 },
  error: { color: '#b42318' },
  button: { backgroundColor: '#245bb2', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#ffffff', fontWeight: '600' },
});
