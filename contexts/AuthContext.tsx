import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const AUTH_STORAGE_KEY = 'gdc_auth_session';

export type AuthUser = {
  id: string;
  displayName: string;
  role: 'eleve';
};

export const DEFAULT_TEST_PROFILE: AuthUser = {
  id: 'eleve-test',
  displayName: 'Élève Test',
  role: 'eleve',
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isReady: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      try {
        const raw = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (!raw || cancelled) return;
        const parsed = JSON.parse(raw) as AuthUser;
        if (parsed?.id && parsed?.displayName) {
          setUser(parsed);
        }
      } catch (error) {
        console.warn('[auth] Impossible de restaurer la session', error);
      } finally {
        if (!cancelled) setIsReady(true);
      }
    };

    void restoreSession();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async () => {
    await AsyncStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify(DEFAULT_TEST_PROFILE),
    );
    setUser(DEFAULT_TEST_PROFILE);
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isReady,
      login,
      logout,
    }),
    [user, isReady, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
