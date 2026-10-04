import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { Profile } from '@/types/api';
import { ApiError, getProfile } from '@/lib/api';
import { Ionicons } from '@expo/vector-icons';
import { PortalTheme as theme } from '@/constants/portal-theme';

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
      <Text style={styles.eyebrow}>CAMPUS CONNECT</Text>
      <Text style={styles.title}>My profile</Text>
      <Text style={styles.subtitle}>Your account information from the student service.</Text>
      <View style={styles.profileCard}>
        <View style={styles.avatar}><Text style={styles.initial}>{displayed?.name?.trim().charAt(0).toUpperCase() || <Ionicons name="person" size={25} color={theme.colors.primary} />}</Text></View>
        <Text style={styles.name}>{displayed?.name || 'Profile'}</Text>
        <Text style={styles.email}>{displayed?.email || 'Email unavailable'}</Text>
        <View style={styles.activePill}><View style={styles.activeDot} /><Text style={styles.activeText}>{token ? 'Signed in' : 'Signed out'}</Text></View>
      </View>
      <View style={styles.detailsCard}>
        <View style={styles.detailsHeading}><Text style={styles.sectionTitle}>Account details</Text>{loading ? <ActivityIndicator color={theme.colors.primary} size="small" /> : null}</View>
        {error ? <Text style={styles.error} accessibilityLiveRegion="polite">{error}</Text> : null}
        <View style={styles.detailRow}><View style={styles.detailIcon}><Ionicons name="mail-outline" size={17} color={theme.colors.primary} /></View><View style={styles.detailContent}><Text style={styles.detailLabel}>EMAIL</Text><Text style={styles.detailValue}>{displayed?.email || '—'}</Text></View></View>
        <View style={styles.detailRow}><View style={styles.detailIcon}><Ionicons name="people-outline" size={17} color={theme.colors.primary} /></View><View style={styles.detailContent}><Text style={styles.detailLabel}>SECTION</Text><Text style={styles.detailValue}>{displayed?.section || '—'}</Text></View></View>
        <View style={[styles.detailRow, styles.lastDetailRow]}><View style={styles.detailIcon}><Ionicons name="id-card-outline" size={17} color={theme.colors.primary} /></View><View style={styles.detailContent}><Text style={styles.detailLabel}>STUDENT ID</Text><Text style={styles.detailValue}>{displayed?.id ?? '—'}</Text></View></View>
      </View>
      <Pressable accessibilityRole="button" style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} onPress={logout}><Ionicons name="log-out-outline" size={19} color={theme.colors.danger} /><Text style={styles.buttonText}>Sign out</Text></Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingHorizontal: 22, paddingTop: 22, paddingBottom: 34, gap: 13, backgroundColor: theme.colors.background },
  eyebrow: { color: theme.colors.primary, fontSize: 9, fontWeight: '800', letterSpacing: 1.4 },
  title: { color: theme.colors.navy, fontSize: 27, fontWeight: '800', letterSpacing: -0.6, marginTop: -8 },
  subtitle: { color: theme.colors.muted, fontSize: 13, lineHeight: 19, marginTop: -7, marginBottom: 5 },
  profileCard: { alignItems: 'center', backgroundColor: theme.colors.navy, borderRadius: 21, padding: 23, marginTop: 3 },
  avatar: { width: 66, height: 66, borderRadius: 23, alignItems: 'center', justifyContent: 'center', backgroundColor: '#DDF1EB', marginBottom: 12 },
  initial: { color: theme.colors.primary, fontSize: 25, fontWeight: '800' },
  name: { color: '#fff', fontSize: 18, fontWeight: '800' },
  email: { color: '#B9CCD5', fontSize: 12, marginTop: 5 },
  activePill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#25465A', borderRadius: 99, marginTop: 13 },
  activeDot: { width: 6, height: 6, borderRadius: 4, backgroundColor: '#58D0A8' },
  activeText: { color: '#DAE8EC', fontSize: 10, fontWeight: '700' },
  detailsCard: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, paddingHorizontal: 17, paddingTop: 17, borderRadius: 18 },
  detailsHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 },
  sectionTitle: { color: theme.colors.navy, fontSize: 15, fontWeight: '800' },
  detailRow: { minHeight: 66, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: '#EEF2F4' },
  lastDetailRow: { borderBottomWidth: 0 },
  detailIcon: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: theme.colors.mint },
  detailContent: { flex: 1, gap: 4 },
  detailLabel: { color: theme.colors.muted, fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  detailValue: { color: theme.colors.ink, fontSize: 13, fontWeight: '600' },
  error: { color: theme.colors.danger, fontSize: 12, marginBottom: 8 },
  button: { minHeight: 51, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14, borderWidth: 1, borderColor: '#F1D9D6', backgroundColor: '#FFF8F7', marginTop: 3 },
  buttonPressed: { opacity: 0.7 },
  buttonText: { color: theme.colors.danger, fontSize: 13, fontWeight: '800' },
});
