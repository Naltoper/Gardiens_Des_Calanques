import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

export function useUserToken() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const getToken = async () => {
      let storedToken = null;

      if (Platform.OS === 'web') {
        storedToken = localStorage.getItem('user_token');
      } else {
        storedToken = await SecureStore.getItemAsync('user_token');
      }

      if (!storedToken) {
        storedToken = Crypto.randomUUID();

        if (Platform.OS === 'web') {
          localStorage.setItem('user_token', storedToken);
        } else {
          await SecureStore.setItemAsync('user_token', storedToken);
        }
      }

      setToken(storedToken);
    };

    getToken();
  }, []);

  return token;
}