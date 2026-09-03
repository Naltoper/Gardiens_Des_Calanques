import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Platform } from 'react-native';

import {
  PUSH_REGISTRATION_STORAGE_KEY,
  PUSH_SUBSCRIBE_PATH,
  VAPID_PUBLIC_KEY,
} from '../constants/webPush';
import { getUserToken } from '../utils/storage';
import { vapidApplicationServerKey } from '../utils/urlBase64ToUint8Array';

type PushPermission = NotificationPermission | 'unsupported' | 'pending';

type PushApiResult = {
  ok?: boolean;
  count?: number;
  store?: 'table' | 'storage';
  table?: string | null;
  error?: string;
  message?: string;
};

type StoredPushRegistration = {
  user_token: string;
  endpoint: string;
  store: string;
  saved_at: string;
};

type WebPushValue = {
  supported: boolean;
  permission: PushPermission;
  busy: boolean;
  registered: boolean;
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

function readStoredRegistration(): StoredPushRegistration | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(PUSH_REGISTRATION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredPushRegistration;
    if (!parsed?.user_token || !parsed?.endpoint) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeStoredRegistration(value: StoredPushRegistration) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(PUSH_REGISTRATION_STORAGE_KEY, JSON.stringify(value));
}

function clearStoredRegistration() {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(PUSH_REGISTRATION_STORAGE_KEY);
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
  if (!response.ok || data.ok === false) {
    throw new Error(
      data.message || data.error || `push-subscribe ${response.status}: ${text}`,
    );
  }
  return data;
}

function applicationServerKey() {
  const key = vapidApplicationServerKey(VAPID_PUBLIC_KEY);
  console.info(LOG, 'VAPID applicationServerKey', {
    bytes: key.byteLength,
    vapid_len: VAPID_PUBLIC_KEY.length,
  });
  if (key.byteLength !== 65) {
    throw new Error(`Clé VAPID invalide (${key.byteLength} octets, attendu 65).`);
  }
  return key;
}

async function subscribeWithVapid(registration: ServiceWorkerRegistration) {
  const existing = await registration.pushManager.getSubscription();
  if (existing) {
    console.info(LOG, 'unsubscribe de l’ancienne PushSubscription TWA');
    try {
      await existing.unsubscribe();
    } catch (error) {
      console.warn(LOG, 'unsubscribe failed', error);
    }
  }
  console.info(LOG, 'pushManager.subscribe() avec Uint8Array VAPID…');
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey(),
    });
    console.info(LOG, 'PushSubscription créée', subscription.endpoint?.slice(0, 64));
    return subscription;
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`pushManager.subscribe() a échoué (TWA/Android) : ${detail}`);
  }
}

function useWebPushState(): WebPushValue {
  const [permission, setPermission] = useState<PushPermission>('pending');
  const [busy, setBusy] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [lastStore, setLastStore] = useState<string | null>(null);
  const [registered, setRegistered] = useState(() => Boolean(readStoredRegistration()));
  const supported = isWebPushSupported();

  const markUnregistered = useCallback((message: string) => {
    clearStoredRegistration();
    setRegistered(false);
    setSyncError(message);
  }, []);

  const syncGrantedSubscription = useCallback(async () => {
    console.info(LOG, 'sync start', {
      supported,
      permission: typeof Notification !== 'undefined' ? Notification.permission : 'n/a',
      vapid_len: VAPID_PUBLIC_KEY.length,
    });
    if (!supported) return;

    const userToken = await getUserToken();
    console.info(LOG, 'user_token', userToken || '(vide)');
    if (!userToken) {
      markUnregistered("Identifiant élève manquant — reconnecte-toi.");
      return;
    }

    const stored = readStoredRegistration();
    if (stored && stored.user_token !== userToken) {
      console.info(LOG, 'token changé, on oublie l’ancien abonnement local');
      clearStoredRegistration();
      setRegistered(false);
    }

    const registration = await withTimeout(getRegistration(), 8000, 'service worker register');
    await withTimeout(navigator.serviceWorker.ready, 8000, 'service worker ready');

    const subscription = await subscribeWithVapid(registration);
    const json = subscription.toJSON();
    if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
      throw new Error('PushSubscription incomplète (endpoint/p256dh/auth manquants)');
    }

    const result = await persistSubscription(userToken, subscription);
    setLastStore(result.store || null);
    if (result.store === 'storage') {
      markUnregistered(
        "Abonnement enregistré en secours (Storage), pas dans push_subscriptions. Vérifie la table / RLS.",
      );
      return;
    }

    writeStoredRegistration({
      user_token: userToken,
      endpoint: json.endpoint,
      store: result.store || 'table',
      saved_at: new Date().toISOString(),
    });
    setRegistered(true);
    setSyncError(null);
    console.info(LOG, 'sync OK, localStorage écrit après 200', result);
  }, [markUnregistered, supported]);

  useEffect(() => {
    if (!supported) {
      setPermission('unsupported');
      console.info(LOG, 'Web Push non supporté sur cette plateforme');
      return;
    }
    setPermission(Notification.permission);
    if (Notification.permission === 'granted' && !readStoredRegistration()) {
      void syncGrantedSubscription().catch((error) => {
        console.error(LOG, 'sync auto failed', error);
        markUnregistered(
          error instanceof Error
            ? error.message
            : "L'abonnement push n'a pas pu être enregistré.",
        );
      });
    }
  }, [markUnregistered, supported, syncGrantedSubscription]);

  const enable = useCallback(async () => {
    console.info(LOG, 'clic Activer', { supported, busy, permission: Notification.permission });
    if (!supported || busy) return registered;
    setBusy(true);
    try {
      const result = await Notification.requestPermission();
      console.info(LOG, 'Notification.requestPermission()', result);
      setPermission(result);
      if (result !== 'granted') {
        markUnregistered(
          result === 'denied'
            ? 'Permission notifications refusée dans Android / Chrome.'
            : "Permission notifications non accordée.",
        );
        return false;
      }
      await syncGrantedSubscription();
      return true;
    } catch (error) {
      console.error(LOG, 'enable failed', error);
      const message =
        error instanceof Error ? error.message : "Impossible d'activer les notifications.";
      markUnregistered(
        message.includes('subscribe') || message.includes('push')
          ? `Échec TWA pushManager.subscribe() : ${message}`
          : message,
      );
      return false;
    } finally {
      setBusy(false);
    }
  }, [busy, markUnregistered, registered, supported, syncGrantedSubscription]);

  return useMemo(
    () => ({
      supported,
      permission,
      busy,
      registered,
      syncError,
      lastStore,
      enable,
    }),
    [supported, permission, busy, registered, syncError, lastStore, enable],
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
