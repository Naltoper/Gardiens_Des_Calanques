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

/** Tags every failure with the exact step of the flow (A: permission, B: VAPID/subscribe, C: POST serveur, D: confirmation BDD). */
class PushFlowError extends Error {
  step: 'A' | 'B' | 'C' | 'D';

  constructor(step: 'A' | 'B' | 'C' | 'D', message: string) {
    super(message);
    this.name = 'PushFlowError';
    this.step = step;
  }
}

/** Renvoie toujours un texte lisible, même pour des erreurs non standard (DOMException, objets bruts…). */
function describeError(error: unknown): string {
  if (error instanceof PushFlowError) {
    return `[Étape ${error.step}] ${error.message}`;
  }
  if (error instanceof Error) {
    return error.message || error.name || 'Erreur inconnue';
  }
  if (typeof error === 'string') return error;
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

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

  let response: Response;
  try {
    response = await withTimeout(
      fetch(PUSH_SUBSCRIBE_PATH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_token: userToken,
          action,
          subscription: payload,
        }),
      }),
      10000,
      'POST /api/push-subscribe',
    );
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new PushFlowError(
      'C',
      `Requête réseau vers ${PUSH_SUBSCRIBE_PATH} impossible : ${detail}`,
    );
  }

  const text = await response.text();
  let data: PushApiResult = {};
  try {
    data = text ? (JSON.parse(text) as PushApiResult) : {};
  } catch {
    data = { message: text };
  }
  console.info(LOG, 'réponse push-subscribe', response.status, data);
  if (!response.ok || data.ok === false) {
    throw new PushFlowError(
      'C',
      `Serveur ${response.status} : ${data.message || data.error || text || 'échec inconnu'}`,
    );
  }
  if (data.store !== 'table') {
    throw new PushFlowError(
      'D',
      `Le serveur n'a pas confirmé l'écriture dans push_subscriptions (store=${data.store || 'inconnu'}). ${
        data.message || ''
      }`.trim(),
    );
  }
  return data;
}

function decodeVapidKey() {
  try {
    return vapidApplicationServerKey(VAPID_PUBLIC_KEY);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new PushFlowError('B', `Décodage de la clé VAPID impossible : ${detail}`);
  }
}

function applicationServerKey() {
  if (!VAPID_PUBLIC_KEY) {
    throw new PushFlowError(
      'B',
      'Clé VAPID publique absente (EXPO_PUBLIC_VAPID_KEY / NEXT_PUBLIC_VAPID_PUBLIC_KEY non définie).',
    );
  }
  const key = decodeVapidKey();
  console.info(LOG, 'VAPID applicationServerKey', {
    bytes: key.byteLength,
    vapid_len: VAPID_PUBLIC_KEY.length,
  });
  if (key.byteLength !== 65) {
    throw new PushFlowError(
      'B',
      `Clé VAPID invalide (${key.byteLength} octets, attendu 65).`,
    );
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
    const subscription = await withTimeout(
      registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey(),
      }),
      15000,
      'pushManager.subscribe()',
    );
    console.info(LOG, 'PushSubscription créée', subscription.endpoint?.slice(0, 64));
    return subscription;
  } catch (error) {
    if (error instanceof PushFlowError) throw error;
    const detail = error instanceof Error ? error.message : String(error);
    throw new PushFlowError('B', `pushManager.subscribe() a échoué (TWA/Android) : ${detail}`);
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
      throw new PushFlowError('D', 'Identifiant élève manquant — reconnecte-toi.');
    }

    const stored = readStoredRegistration();
    if (stored && stored.user_token !== userToken) {
      console.info(LOG, 'token changé, on oublie l’ancien abonnement local');
      clearStoredRegistration();
      setRegistered(false);
    }

    let registration: ServiceWorkerRegistration;
    try {
      registration = await withTimeout(getRegistration(), 8000, 'service worker register');
      await withTimeout(navigator.serviceWorker.ready, 8000, 'service worker ready');
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      throw new PushFlowError('B', `Service worker indisponible : ${detail}`);
    }

    const subscription = await subscribeWithVapid(registration);
    const json = subscription.toJSON();
    if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
      throw new PushFlowError(
        'B',
        'PushSubscription incomplète (endpoint/p256dh/auth manquants).',
      );
    }

    // Étape C : POST vers /api/push-subscribe. persistSubscription lève une
    // PushFlowError si le réseau échoue, si le serveur ne répond pas 200,
    // ou si la réponse ne confirme pas l'écriture dans push_subscriptions.
    const result = await persistSubscription(userToken, subscription);
    setLastStore(result.store || null);

    // Étape D : on n'écrit gdc_push_registered_v1 et on ne masque la
    // bannière QUE si le serveur a confirmé l'enregistrement en BDD.
    writeStoredRegistration({
      user_token: userToken,
      endpoint: json.endpoint,
      store: result.store || 'table',
      saved_at: new Date().toISOString(),
    });
    setRegistered(true);
    setSyncError(null);
    console.info(LOG, 'sync OK, localStorage écrit après 200 confirmé BDD', result);
  }, [supported]);

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
        markUnregistered(describeError(error));
      });
    }
  }, [markUnregistered, supported, syncGrantedSubscription]);

  const enable = useCallback(async () => {
    console.info(LOG, 'clic Activer', { supported, busy, permission: Notification.permission });
    if (!supported || busy) return registered;
    setBusy(true);
    setSyncError(null);
    try {
      // Étape A : demander la permission système (Android/Chrome).
      let result: NotificationPermission;
      try {
        result = await Notification.requestPermission();
      } catch (error) {
        const detail = error instanceof Error ? error.message : String(error);
        throw new PushFlowError('A', `Notification.requestPermission() a échoué : ${detail}`);
      }
      console.info(LOG, 'Notification.requestPermission()', result);
      setPermission(result);
      if (result !== 'granted') {
        throw new PushFlowError(
          'A',
          result === 'denied'
            ? "Permission refusée dans Android/Chrome. Ouvre Paramètres > Applis > Gardiens Des Calanques > Notifications pour l'autoriser, puis réessaie."
            : 'Permission notifications non accordée.',
        );
      }
      // Étapes B (VAPID + subscribe), C (POST serveur) et D (confirmation
      // BDD) sont toutes gérées dans syncGrantedSubscription : elle ne
      // marque `registered=true` / n'écrit le localStorage QUE si le
      // serveur a répondu 200 avec une confirmation d'écriture en table.
      await syncGrantedSubscription();
      return true;
    } catch (error) {
      console.error(LOG, 'enable failed', error);
      markUnregistered(describeError(error));
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
