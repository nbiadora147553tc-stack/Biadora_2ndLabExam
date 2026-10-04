import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { ApiError, getProfile } from '@/lib/api';
import type { Profile as ProfileData } from '@/types/api';

export default function ProfileScreen() {
  const { user, token, signOut } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProfile = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      setProfile(await getProfile(token));
    } catch (requestError) {
      if (requestError instanceof ApiError && requestError.status === 401) {
        await signOut();
      } else {
        setError(requestError instanceof Error ? requestError.message : 'Unable to load your profile.');
      }
    } finally {
      setLoading(false);
    }
  }, [token, signOut]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const shownProfile = profile ?? user;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>MY PROFILE</Text>
      {loading ? (
        <View style={styles.card}><ActivityIndicator color="#245bb2" /><Text style={styles.text}>Loading profile…</Text></View>
      ) : error ? (
        <View style={styles.card} accessibilityLiveRegion="polite">
          <Text style={styles.error}>{error}</Text>
          <Pressable accessibilityRole="button" onPress={() => void loadProfile()}><Text style={styles.link}>Retry</Text></Pressable>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.text}>Name: {shownProfile?.name || '—'}</Text>
          <Text style={styles.text}>Email: {shownProfile?.email || '—'}</Text>
          <Text style={styles.text}>Section: {shownProfile?.section || '—'}</Text>
          {shownProfile?.role ? <Text style={styles.text}>Role: {shownProfile.role}</Text> : null}
        </View>
      )}
      <Text style={styles.text}>Session Status: {token ? 'Authenticated' : 'Not Available'}</Text>
      <Pressable accessibilityRole="button" style={styles.button} onPress={() => void signOut()}><Text style={styles.buttonText}>LOGOUT</Text></Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, gap: 20, backgroundColor: '#f2f5fa' },
  title: { color: '#17324d', fontSize: 24, fontWeight: '700' },
  card: { backgroundColor: '#ffffff', padding: 20, gap: 16, borderRadius: 12 },
  text: { color: '#536579', fontSize: 16 },
  error: { color: '#b42318' },
  link: { color: '#245bb2', paddingVertical: 8 },
  button: { backgroundColor: '#245bb2', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#ffffff', fontWeight: '600' },
});
