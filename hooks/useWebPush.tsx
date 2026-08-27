import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Platform } from 'react-native';

import { PUSH_SUBSCRIBE_PATH, VAPID_PUBLIC_KEY } from '../constants/webPush';
import { getUserToken } from '../utils/storage';
import { urlBase64ToUint8Array } from '../utils/urlBase64ToUint8Array';

type PushPermission = NotificationPermission | 'unsupported' | 'pending';

type PushApiResult = {
  ok?: boolean;
  count?: number;
  store?: 'table' | 'storage';
  table?: string | null;
  error?: string;
  message?: string;
};

type WebPushValue = {
  supported: boolean;
  permission: PushPermission;
  busy: boolean;
  syncError: string | null;
  lastStore: string | null;
  enable: () => Promise<boolean>;
};

const LOG = '[gdc-push]';
const WebPushContext = createContext<WebPushValue | null>(null);

function isWebPushSupported() {
  return (
    Platform.OS === 'web' &&
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string) {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error(`${label} timeout (${ms}ms)`)), ms);
    }),
  ]);
}

async function getRegistration() {
  const existing = await navigator.serviceWorker.getRegistration('/');
  if (existing) {
    console.info(LOG, 'service worker déjà enregistré', existing.scope);
    return existing;
  }
  console.info(LOG, 'enregistrement /sw.js');
  return navigator.serviceWorker.register('/sw.js', { scope: '/' });
}

async function persistSubscription(
  userToken: string,
  subscription: PushSubscription,
  action: 'subscribe' | 'unsubscribe' = 'subscribe',
): Promise<PushApiResult> {
  const payload = subscription.toJSON();
  let endpointHost = null;
  try {
    endpointHost = payload.endpoint ? new URL(payload.endpoint).host : null;
  } catch {
    endpointHost = 'invalid';
  }
  console.info(LOG, 'POST /api/push-subscribe', {
    action,
    user_token: userToken,
    endpoint_host: endpointHost,
    has_p256dh: Boolean(payload.keys?.p256dh),
    has_auth: Boolean(payload.keys?.auth),
  });
  const response = await fetch(PUSH_SUBSCRIBE_PATH, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_token: userToken,
      action,
      subscription: payload,
    }),
  });
  const text = await response.text();
  let data: PushApiResult = {};
  try {
    data = text ? (JSON.parse(text) as PushApiResult) : {};
  } catch {
    data = { message: text };
  }
  console.info(LOG, 'réponse push-subscribe', response.status, data);
  if (!response.ok) {
    throw new Error(
      data.message || data.error || `push-subscribe ${response.status}: ${text}`,
    );
  }
  return data;
}

function useWebPushState(): WebPushValue {
  const [permission, setPermission] = useState<PushPermission>('pending');
  const [busy, setBusy] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [lastStore, setLastStore] = useState<string | null>(null);
  const supported = isWebPushSupported();

  const syncGrantedSubscription = useCallback(async () => {
    console.info(LOG, 'sync start', {
      supported,
      permission: typeof Notification !== 'undefined' ? Notification.permission : 'n/a',
      vapid_len: VAPID_PUBLIC_KEY.length,
    });
    if (!supported || Notification.permission !== 'granted') {
      console.info(LOG, 'sync skip (pas granted ou non supporté)');
      return;
    }
    const userToken = await getUserToken();
    console.info(LOG, 'user_token', userToken || '(vide)');
    if (!userToken) {
      setSyncError("Identifiant élève manquant — reconnecte-toi.");
      return;
    }
    const registration = await withTimeout(getRegistration(), 8000, 'service worker register');
    await withTimeout(navigator.serviceWorker.ready, 8000, 'service worker ready');
    let subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      console.info(LOG, 'PushSubscription existante', subscription.endpoint?.slice(0, 48));
    } else {
      console.info(LOG, 'pushManager.subscribe()…');
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
      console.info(LOG, 'PushSubscription créée', subscription.endpoint?.slice(0, 48));
    }
    const json = subscription.toJSON();
    if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
      throw new Error('PushSubscription incomplète (endpoint/p256dh/auth manquants)');
    }
    const result = await persistSubscription(userToken, subscription);
    setLastStore(result.store || null);
    if (result.store === 'storage') {
      setSyncError(
        "Abonnement enregistré en secours (Storage), pas dans push_subscriptions. Vérifie la table / RLS.",
      );
      return;
    }
    setSyncError(null);
    console.info(LOG, 'sync OK', result);
  }, [supported]);

  useEffect(() => {
    if (!supported) {
      setPermission('unsupported');
      console.info(LOG, 'Web Push non supporté sur cette plateforme');
      return;
    }
    setPermission(Notification.permission);
    if (Notification.permission === 'granted') {
      void syncGrantedSubscription().catch((error) => {
        console.error(LOG, 'sync auto failed', error);
        setSyncError(error instanceof Error ? error.message : "L'abonnement push n'a pas pu être enregistré.");
      });
    }
  }, [supported, syncGrantedSubscription]);

  const enable = useCallback(async () => {
    console.info(LOG, 'clic Activer', { supported, busy, permission: Notification.permission });
    if (!supported || busy) return Notification.permission === 'granted';
    setBusy(true);
    setSyncError(null);
    try {
      const result = await Notification.requestPermission();
      console.info(LOG, 'Notification.requestPermission()', result);
      setPermission(result);
      if (result !== 'granted') {
        setSyncError(
          result === 'denied'
            ? 'Permission notifications refusée.'
            : "Permission notifications non accordée.",
        );
        return false;
      }
      await syncGrantedSubscription();
      return true;
    } catch (error) {
      console.error(LOG, 'enable failed', error);
      setSyncError(
        error instanceof Error ? error.message : "Impossible d'activer les notifications.",
      );
      return false;
    } finally {
      setBusy(false);
    }
  }, [busy, supported, syncGrantedSubscription]);

  return useMemo(
    () => ({
      supported,
      permission,
      busy,
      syncError,
      lastStore,
      enable,
    }),
    [supported, permission, busy, syncError, lastStore, enable],
  );
}

export function WebPushProvider({ children }: { children: React.ReactNode }) {
  const value = useWebPushState();
  return <WebPushContext.Provider value={value}>{children}</WebPushContext.Provider>;
}

export function useWebPush() {
  const context = useContext(WebPushContext);
  if (!context) {
    throw new Error('useWebPush must be used within WebPushProvider');
  }
  return context;
}
