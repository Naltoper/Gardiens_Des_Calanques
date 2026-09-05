import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_READ_KEY = 'gdc_chat_last_read';

type LastReadMap = Record<string, string>;
type Listener = () => void;

const listeners = new Set<Listener>();

export function subscribeChatRead(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

export async function getLastReadMap(): Promise<LastReadMap> {
  try {
    const raw = await AsyncStorage.getItem(LAST_READ_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as LastReadMap;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export async function markChatRead(reportId: string) {
  if (!reportId) return;
  const map = await getLastReadMap();
  map[reportId] = new Date().toISOString();
  await AsyncStorage.setItem(LAST_READ_KEY, JSON.stringify(map));
  notifyListeners();
}

export function isIncomingUnread(
  lastIncomingAt: string | null | undefined,
  lastReadAt: string | null | undefined,
) {
  if (!lastIncomingAt) return false;
  if (!lastReadAt) return true;
  return new Date(lastIncomingAt).getTime() > new Date(lastReadAt).getTime();
}
