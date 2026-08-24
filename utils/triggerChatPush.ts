import { Platform } from 'react-native';

const NOTIFY_PATH = '/api/notify-chat';
const PRODUCTION_NOTIFY_URL = 'https://gdc-eleves.vercel.app/api/notify-chat';

function notifyUrl() {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}${NOTIFY_PATH}`;
  }
  return PRODUCTION_NOTIFY_URL;
}

/** Fire-and-forget: ask the server to push the élève when staff wrote in chat. */
export function triggerChatPush(record: {
  id?: string;
  report_id?: string;
  sender_role?: string | null;
  content?: string | null;
}) {
  if (!record?.report_id || record.sender_role === 'user') return;
  void fetch(notifyUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ record }),
  }).catch((error) => {
    console.warn('[web-push] notify', error);
  });
}
