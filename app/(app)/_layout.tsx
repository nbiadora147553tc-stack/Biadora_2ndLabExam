import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PortalTheme as theme } from '@/constants/portal-theme';

export default function AppLayout() {
  // The root stack protects this entire group until session restoration finishes.
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: theme.colors.primary,
      tabBarInactiveTintColor: '#94A3AE',
      tabBarLabelStyle: { fontSize: 10, fontWeight: '700', marginTop: 2 },
      tabBarStyle: { height: 72, paddingTop: 8, paddingBottom: 8, backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border, elevation: 10 },
    }}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="students" options={{ title: 'Students', tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} /> }} />
    </Tabs>
  );
}
