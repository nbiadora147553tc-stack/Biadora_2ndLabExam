import { Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider } from '@/context/AuthContext';
import { useAuth } from '@/hooks/useAuth';

export default function RootLayout() {
  return <AuthProvider><RootNavigator /></AuthProvider>;
}

function RootNavigator() {
  const { token, authLoading } = useAuth();
  if (authLoading) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator /></View>;
  return (
      <Stack screenOptions={{ headerTintColor: '#17324d' }}>
        <Stack.Protected guard={!!token}>
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
          <Stack.Screen name="student/[id]" options={{ title: 'Student Details' }} />
        </Stack.Protected>
        <Stack.Protected guard={!token}>
          <Stack.Screen name="sign-in" options={{ title: 'Sign In' }} />
        </Stack.Protected>
      </Stack>
  );
}
