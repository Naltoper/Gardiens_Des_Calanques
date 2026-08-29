/**
 * Configuration partagée du Web Push élève.
 *
 * La clé VAPID publique n'est pas un secret : elle est envoyée au navigateur
 * pour créer l'abonnement (`PushManager.subscribe`). La clé PRIVÉE ne vit que
 * côté serveur (Vercel), voir `api/send-notification.js`.
 */
export const VAPID_PUBLIC_KEY = process.env.EXPO_PUBLIC_VAPID_KEY || '';

/** Table Supabase où sont stockés les abonnements Push (voir supabase/migrations). */
export const PUSH_SUBSCRIPTIONS_TABLE = 'push_subscriptions';

/** Clé localStorage utilisée pour éviter de re-souscrire à chaque chargement. */
export const PUSH_REGISTRATION_STORAGE_KEY = 'gdc_push_registration_v2';

export const SERVICE_WORKER_PATH = '/sw.js';
export const SERVICE_WORKER_SCOPE = '/';
