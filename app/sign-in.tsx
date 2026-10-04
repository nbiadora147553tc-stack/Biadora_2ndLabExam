import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { extractLoginToken, signInRequest } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { PortalTheme as theme } from '@/constants/portal-theme';

export default function SignInScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    const normalizedEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) || !password) {
      setError('Enter a valid email address and password.'); return;
    }
    setLoading(true); setError('');
    try {
      const response = await signInRequest({ email: normalizedEmail, password });
      const accessToken = extractLoginToken(response);
      if (!accessToken) throw new Error('The login response did not include an access token.');
      await login(accessToken, response.user ?? response.profile ?? {});
      setPassword(''); router.replace('/(app)');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Sign in failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.brand}>
        <View style={styles.brandIcon}><Ionicons name="school" size={23} color="#fff" /></View>
        <View><Text style={styles.brandName}>Campus Connect</Text><Text style={styles.brandCaption}>STUDENT SERVICE PORTAL</Text></View>
      </View>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>CCE106 • PRACTICAL EXAMINATION</Text>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to access your student services and records.</Text>
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} accessibilityLabel="Email" placeholder="student@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
        <Text style={styles.label}>Password</Text>
        <TextInput style={styles.input} accessibilityLabel="Password" placeholder="Enter your password" value={password} onChangeText={setPassword} secureTextEntry />
        <View style={styles.feedback} accessibilityLiveRegion="polite">
          {loading && <ActivityIndicator color={theme.colors.primary} accessibilityLabel="Signing in" />}
          {error ? <View style={styles.errorBox}><Ionicons name="alert-circle-outline" size={18} color={theme.colors.danger} /><Text style={styles.error}>{error}</Text></View> : null}
        </View>
        <Pressable accessibilityRole="button" style={({ pressed }) => [styles.button, pressed && styles.buttonPressed, loading && styles.buttonDisabled]} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Signing in…' : 'Login'}</Text>
        </Pressable>
        <View style={styles.secureNote}><Ionicons name="shield-checkmark-outline" size={16} color={theme.colors.primary} /><Text style={styles.note}>Your password is never saved on this device.</Text></View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 30, backgroundColor: theme.colors.background },
  brand: { width: '100%', maxWidth: 440, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 26 },
  brandIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: theme.colors.primary, alignItems: 'center', justifyContent: 'center' },
  brandName: { fontSize: 16, fontWeight: '800', color: theme.colors.navy },
  brandCaption: { fontSize: 9, fontWeight: '800', color: theme.colors.muted, letterSpacing: 1.2, marginTop: 3 },
  card: { width: '100%', maxWidth: 440, alignSelf: 'center', padding: 24, borderRadius: 22, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: '#E9EFF1', shadowColor: theme.colors.navy, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.06, shadowRadius: 22, elevation: 3 },
  eyebrow: { fontSize: 10, fontWeight: '800', color: theme.colors.primary, letterSpacing: 1, marginBottom: 12 },
  title: { fontSize: 29, fontWeight: '800', letterSpacing: -0.6, color: theme.colors.navy },
  subtitle: { color: theme.colors.muted, lineHeight: 22, marginTop: 8, marginBottom: 24 },
  label: { color: theme.colors.ink, fontSize: 10, fontWeight: '800', letterSpacing: 0.9, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: theme.colors.border, borderRadius: 13, padding: 14, fontSize: 15, marginBottom: 16, color: theme.colors.navy, backgroundColor: '#FBFCFD' },
  feedback: { minHeight: 28 },
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: theme.colors.dangerSurface, padding: 11, borderRadius: 11 },
  error: { flex: 1, color: theme.colors.danger, fontSize: 12, lineHeight: 18 },
  button: { minHeight: 52, backgroundColor: theme.colors.primary, paddingHorizontal: 17, borderRadius: 13, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10, marginTop: 3 },
  buttonPressed: { backgroundColor: theme.colors.primaryDark, transform: [{ scale: 0.99 }] },
  buttonDisabled: { opacity: 0.65 },
  buttonText: { color: '#ffffff', fontWeight: '800', fontSize: 15 },
  secureNote: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 7, marginTop: 18 },
  note: { color: theme.colors.muted, fontSize: 11 },
});
