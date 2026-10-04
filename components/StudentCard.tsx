import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import type { Student } from '@/types/api';
import { Ionicons } from '@expo/vector-icons';
import { PortalTheme as theme } from '@/constants/portal-theme';

export default function StudentCard({ student }: { student: Student }) {
  const handleViewDetails = () => {
    if (student.id === undefined || student.id === null || String(student.id).trim() === '') return;
    router.push({ pathname: '/student/[id]', params: { id: String(student.id) } });
  };

  return (
    <View style={styles.card}>
      <View style={styles.identity}>
        <View style={styles.avatar}><Text style={styles.initial}>{student.name?.trim().charAt(0).toUpperCase() || '?'}</Text></View>
        <View style={styles.info}><Text style={styles.name}>{student.name || 'Name not available'}</Text><Text style={styles.text}>{student.email || 'Email not available'}</Text></View>
        <Ionicons name="chevron-forward" size={19} color={theme.colors.muted} />
      </View>
      <View style={styles.footer}>
        <View style={styles.course}><Ionicons name="book-outline" size={14} color={theme.colors.primary} /><Text numberOfLines={1} style={styles.courseText}>{student.course || student.section || 'Student record'}</Text></View>
        <Pressable accessibilityRole="button" style={({ pressed }) => [styles.button, pressed && styles.pressed]} onPress={handleViewDetails}>
          <Text style={styles.buttonText}>Details</Text><Ionicons name="arrow-forward" size={14} color={theme.colors.primary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 15, borderRadius: 17, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, marginBottom: 10, gap: 13 },
  identity: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 43, height: 43, borderRadius: 15, backgroundColor: theme.colors.mint, alignItems: 'center', justifyContent: 'center' },
  initial: { color: theme.colors.primary, fontSize: 17, fontWeight: '800' },
  info: { flex: 1, gap: 4 },
  name: { color: theme.colors.navy, fontSize: 15, fontWeight: '800' },
  text: { color: theme.colors.muted, fontSize: 11 },
  footer: { paddingTop: 11, borderTopWidth: 1, borderTopColor: '#EDF1F3', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  course: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  courseText: { flexShrink: 1, color: theme.colors.ink, fontSize: 10, fontWeight: '700' },
  button: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 5, paddingLeft: 8 },
  buttonText: { color: theme.colors.primary, fontWeight: '800', fontSize: 11 },
  pressed: { opacity: 0.65 },
});
