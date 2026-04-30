import { useEffect, useState } from 'react';
import { getUserToken } from '../utils/storage';

export function useUserToken() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const initToken = async () => {
      const validToken = await getUserToken();
      setToken(validToken);
    };
    initToken();
  }, []);

  return token;
}