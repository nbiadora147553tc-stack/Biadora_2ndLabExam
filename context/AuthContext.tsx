import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { ApiError, getProfile } from '@/lib/api';
import type { Profile } from '@/types/api';

const TOKEN_KEY = 'student-service-access-token';

export type User = Profile;

type AuthContextValue = {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  signIn: (accessToken: string, userData?: User | null) => Promise<void>;
  signOut: () => Promise<void>;
  restoreSession: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function secureStoreAvailable(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  try {
    return await SecureStore.isAvailableAsync();
  } catch {
    return false;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearSavedToken = useCallback(async () => {
    if (await secureStoreAvailable()) {
      try {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
      } catch {
        // Authentication state is still cleared if device storage is unavailable.
      }
    }
  }, []);

  const signIn = useCallback(async (accessToken: string, userData?: User | null) => {
    if (await secureStoreAvailable()) await SecureStore.setItemAsync(TOKEN_KEY, accessToken);
    setToken(accessToken);
    setUser(userData ?? null);
  }, []);

  const signOut = useCallback(async () => {
    await clearSavedToken();
    setToken(null);
    setUser(null);
  }, [clearSavedToken]);

  const restoreSession = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!(await secureStoreAvailable())) return;
      const savedToken = await SecureStore.getItemAsync(TOKEN_KEY);
      if (!savedToken) return;

      const profile = await getProfile(savedToken);
      setToken(savedToken);
      setUser(profile);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) await clearSavedToken();
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [clearSavedToken]);

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  const value = useMemo(
    () => ({ token, user, isLoading, signIn, signOut, restoreSession }),
    [token, user, isLoading, signIn, signOut, restoreSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
