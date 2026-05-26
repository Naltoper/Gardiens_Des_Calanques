import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

// Récupère ces valeurs dans ton tableau de bord Supabase (Settings > API)
const supabaseUrl = 'https://lgsspvcxayanodmvgkzb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxnc3NwdmN4YXlhbm9kbXZna3piIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzMTI4MTksImV4cCI6MjA4Mzg4ODgxOX0.YNaDaUcRyjLnn0J8mN3Z3fCzNVH4iGWEJPwNc5rpGDw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
  // On ajoute cette configuration globale pour stabiliser les requêtes réseau sur Android
  global: {
    headers: {
      'X-Client-Info': `expo-client-${Platform.OS}`,
    },
  },
});