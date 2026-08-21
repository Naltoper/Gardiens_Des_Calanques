import { createClient, type SupabaseClientOptions } from '@supabase/supabase-js';
import { Platform } from 'react-native';

// Récupère ces valeurs dans ton tableau de bord Supabase (Settings > API)
const supabaseUrl = 'https://lgsspvcxayanodmvgkzb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxnc3NwdmN4YXlhbm9kbXZna3piIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzMTI4MTksImV4cCI6MjA4Mzg4ODgxOX0.YNaDaUcRyjLnn0J8mN3Z3fCzNVH4iGWEJPwNc5rpGDw';

/**
 * Expo web SSR tourne sous Node 20 (pas de WebSocket natif).
 * On ne peut pas importer le package Node `ws` ici : Metro l'inclurait
 * aussi dans le bundle Android/iOS et planterait sur `stream`.
 * Un stub suffit pour le rendu serveur — le client (navigateur / Expo Go)
 * utilise le WebSocket natif.
 */
function getRealtimeOptions(): SupabaseClientOptions['realtime'] | undefined {
  if (typeof WebSocket !== 'undefined') {
    return undefined;
  }

  class SSRWebSocketStub {
    static readonly CONNECTING = 0;
    static readonly OPEN = 1;
    static readonly CLOSING = 2;
    static readonly CLOSED = 3;
    readonly readyState = SSRWebSocketStub.CLOSED;
    readonly url: string;
    constructor(url: string | URL, _protocols?: string | string[]) {
      this.url = String(url);
    }
    close() {}
    send(_data: string | ArrayBufferLike | Blob | ArrayBufferView) {}
    addEventListener() {}
    removeEventListener() {}
    dispatchEvent() {
      return false;
    }
  }

  return { transport: SSRWebSocketStub as unknown as typeof WebSocket };
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      'X-Client-Info': `expo-client-${Platform.OS}`,
    },
  },
  realtime: getRealtimeOptions(),
});
