import { Platform } from 'react-native';

const NOTIFY_PATH = '/api/send-notification';
const PRODUCTION_NOTIFY_URL = 'https://gdc-eleves.vercel.app/api/send-notification';

function notifyUrl(): string {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}${NOTIFY_PATH}`;
  }
  return PRODUCTION_NOTIFY_URL;
}

/**
 * Fire-and-forget : prévient `/api/send-notification` qu'un message de chat
 * vient d'être inséré, pour que le serveur retrouve l'élève concerné et lui
 * envoie un vrai Web Push.
 *
 * C'est une roue de secours côté client (l'app peut être fermée quand un
 * intervenant répond) : le déclencheur fiable reste le Database Webhook
 * Supabase décrit dans `docs/PUSH-NOTIFICATIONS.md`.
 */
export function notifyChatMessage(record: {
  id?: string;
  report_id?: string;
  sender_role?: string | null;
  content?: string | null;
}) {
  if (!record?.report_id || record.sender_role === 'user') return;

  void fetch(notifyUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ kind: 'chat_message', record }),
  }).catch((error) => {
    console.warn('[gdc-push] notifyChatMessage', error);
  });
}
