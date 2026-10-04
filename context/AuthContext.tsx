import { createContext, useEffect, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { ApiError, getProfile } from '@/lib/api';

export type User = {
  id?: string | number;
  name?: string;
  email?: string;
  section?: string;
  role?: string;
};

type AuthContextValue = {
  token: string | null;
  user: User | null;
  authLoading: boolean;
  login: (accessToken: string, userData: User) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const login = async (accessToken: string, userData: User) => {
    if (!accessToken.trim()) throw new Error('The service did not return an authentication token.');
    if (Platform.OS !== 'web') {
      if (!(await SecureStore.isAvailableAsync())) throw new Error('Secure session storage is unavailable on this device.');
      await SecureStore.setItemAsync('student-service-token', accessToken);
    }
    setToken(accessToken);
    setUser(userData);
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    if (Platform.OS !== 'web' && await SecureStore.isAvailableAsync()) await SecureStore.deleteItemAsync('student-service-token');
    router.replace('/sign-in');
  };

  const restoreSession = async () => {
    setAuthLoading(true);
    try {
      if (Platform.OS === 'web' || !(await SecureStore.isAvailableAsync())) return;
      const savedToken = await SecureStore.getItemAsync('student-service-token');
      if (!savedToken) return;
      const profile = await getProfile(savedToken);
      setToken(savedToken);
      setUser(profile);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) { setToken(null); setUser(null); }
      if (error instanceof ApiError && error.status === 401 && Platform.OS !== 'web' && await SecureStore.isAvailableAsync()) {
        await SecureStore.deleteItemAsync('student-service-token').catch(() => undefined);
      }
    } finally { setAuthLoading(false); }
  };

  useEffect(() => {
    void restoreSession();
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, authLoading, login, logout, restoreSession }}>
      {children}
    </AuthContext.Provider>
  );
}
