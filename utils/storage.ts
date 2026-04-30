import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto'; 
import { Platform } from 'react-native';
import { supabase } from '../lib/supabase'; 

const TOKEN_KEY = 'user_report_token';

/**
 * Vérifie si un token existe déjà dans la base de données
 */
const checkTokenExistsInDB = async (token: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('reports')
    .select('user_token')
    .eq('user_token', token)
    .limit(1);

  if (error) {
    // Si erreur réseau, on part du principe que le token est OK 
    // pour ne pas bloquer l'utilisateur // TODO faille potencielle ici mais très peut grave
    return false; 
  }
  return data && data.length > 0;
};

/**
 * Récupère le token ou en génère un nouveau UNIQUE si absent
 */
export const getUserToken = async (): Promise<string> => {
  // 1. Essayer de lire le token local
  let token = (Platform.OS === 'web') 
    ? localStorage.getItem(TOKEN_KEY) 
    : await SecureStore.getItemAsync(TOKEN_KEY);

  // 2. Si on a déjà un token, on le renvoie simplement
  if (token) return token;

  // 3. Sinon, on génère un token UNIQUE
  let isUnique = false;
  let newToken = "";

  while (!isUnique) {
    newToken = Crypto.randomUUID();
    const exists = await checkTokenExistsInDB(newToken);
    if (!exists) isUnique = true;
  }

  // 4. On l'enregistre localement pour la prochaine fois
  await saveUserToken(newToken);
  
  return newToken;
};

/**
 * Enregistre le token utilisateur
 */
export const saveUserToken = async (token: string): Promise<void> => {
  if (Platform.OS === 'web') {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  }
};