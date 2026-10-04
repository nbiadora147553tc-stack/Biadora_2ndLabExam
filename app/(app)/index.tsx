import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { PortalTheme as theme } from '@/constants/portal-theme';

export default function DashboardScreen() {
  const { token, user } = useAuth();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topline}><View><Text style={styles.eyebrow}>CAMPUS CONNECT</Text><Text style={styles.greeting}>Good day{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</Text></View><View style={styles.avatar}><Ionicons name="person" size={19} color={theme.colors.primary} /></View></View>
      <Text style={styles.subtitle}>Your campus services, all in one place.</Text>
      <View style={styles.hero}>
        <View style={styles.heroIcon}><Ionicons name="school-outline" size={23} color={theme.colors.navy} /></View>
        <Text style={styles.heroKicker}>STUDENT SERVICE PORTAL</Text>
        <Text style={styles.heroTitle}>Make campus life{ '\n' }a little simpler.</Text>
        <Text style={styles.heroText}>Find student records and manage your account with ease.</Text>
        <View style={styles.session}><View style={styles.sessionDot} /><Text style={styles.sessionText}>{token ? 'Secure session active' : 'Session unavailable'}</Text></View>
      </View>
      <View style={styles.sectionHeading}><Text style={styles.heading}>Your services</Text><Text style={styles.sectionCaption}>QUICK ACCESS</Text></View>
      <View style={styles.serviceGrid}>
        <Link href="/(app)/students" asChild><Pressable accessibilityRole="button" style={({ pressed }) => [styles.serviceCard, pressed && styles.pressed]}><View style={[styles.serviceIcon, { backgroundColor: theme.colors.mint }]}><Ionicons name="people-outline" size={23} color={theme.colors.primary} /></View><Text style={styles.serviceTitle}>Student directory</Text><Text style={styles.serviceText}>Search student records</Text><View style={styles.serviceArrow}><Ionicons name="arrow-forward" size={16} color={theme.colors.primary} /></View></Pressable></Link>
        <Link href="/(app)/profile" asChild><Pressable accessibilityRole="button" style={({ pressed }) => [styles.serviceCard, pressed && styles.pressed]}><View style={[styles.serviceIcon, { backgroundColor: '#FFF1DF' }]}><Ionicons name="person-outline" size={22} color="#B67726" /></View><Text style={styles.serviceTitle}>My profile</Text><Text style={styles.serviceText}>View your account details</Text><View style={styles.serviceArrow}><Ionicons name="arrow-forward" size={16} color={theme.colors.primary} /></View></Pressable></Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingHorizontal: 22, paddingTop: 22, paddingBottom: 32, gap: 15, backgroundColor: theme.colors.background },
  topline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eyebrow: { color: theme.colors.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginBottom: 5 },
  greeting: { color: theme.colors.navy, fontSize: 27, lineHeight: 33, fontWeight: '800', letterSpacing: -0.7 },
  avatar: { width: 44, height: 44, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.mint },
  subtitle: { color: theme.colors.muted, fontSize: 14, marginTop: -7 },
  hero: { overflow: 'hidden', position: 'relative', backgroundColor: theme.colors.navy, borderRadius: 22, padding: 22, marginTop: 8 },
  heroIcon: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: theme.colors.amber, marginBottom: 20 },
  heroKicker: { color: '#A8C6D3', fontSize: 9, fontWeight: '800', letterSpacing: 1.6 },
  heroTitle: { color: '#fff', fontSize: 27, lineHeight: 33, fontWeight: '800', letterSpacing: -0.5, marginTop: 8 },
  heroText: { color: '#C1D0D9', fontSize: 13, lineHeight: 20, maxWidth: 270, marginTop: 8 },
  session: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 7, borderRadius: 99, backgroundColor: '#244357', paddingHorizontal: 11, paddingVertical: 8, marginTop: 18 },
  sessionDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#58D0A8' },
  sessionText: { color: '#D6E5EB', fontSize: 10, fontWeight: '700' },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 7 },
  heading: { color: theme.colors.navy, fontSize: 18, fontWeight: '800' },
  sectionCaption: { color: theme.colors.muted, fontSize: 9, fontWeight: '800', letterSpacing: 1.1 },
  serviceGrid: { flexDirection: 'row', gap: 12 },
  serviceCard: { flex: 1, minHeight: 163, position: 'relative', backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 18, padding: 15 },
  serviceIcon: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 14, marginBottom: 14 },
  serviceTitle: { color: theme.colors.navy, fontSize: 14, fontWeight: '800' },
  serviceText: { color: theme.colors.muted, fontSize: 11, lineHeight: 16, marginTop: 5, paddingRight: 7 },
  serviceArrow: { position: 'absolute', right: 13, bottom: 13 },
  pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
});
