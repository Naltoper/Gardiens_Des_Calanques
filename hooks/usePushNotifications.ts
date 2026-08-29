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
  PUSH_SUBSCRIPTIONS_TABLE,
  SERVICE_WORKER_PATH,
  SERVICE_WORKER_SCOPE,
  VAPID_PUBLIC_KEY,
} from '../constants/pushNotifications';
import { supabase } from '../lib/supabase';
import { getUserToken } from '../utils/storage';
import { vapidApplicationServerKey } from '../utils/vapidKey';

const LOG = '[gdc-push]';

type PushPermissionState = NotificationPermission | 'unsupported' | 'pending';

type PushNotificationsValue = {
  /** false sur natif (iOS/Android Expo) et sur navigateurs sans Push API. */
  supported: boolean;
  permission: PushPermissionState;
  busy: boolean;
  subscribed: boolean;
  error: string | null;
  /** Demande la permission puis crée/rafraîchit l'abonnement Supabase. */
  enable: () => Promise<boolean>;
  /** Coupe les notifications sur cet appareil. */
  disable: () => Promise<void>;
};

type StoredRegistration = {
  userToken: string;
  endpoint: string;
  savedAt: string;
};

const PushNotificationsContext = createContext<PushNotificationsValue | null>(null);

/**
 * Toute la mécanique Push est isolée derrière ce garde : sur Android/iOS
 * natif (react-native pur), il n'y a ni `PushManager` ni `ServiceWorker`, on
 * ne doit jamais toucher à `Notification` en dehors du web.
 */
function isWebPushSupported(): boolean {
  return (
    Platform.OS === 'web' &&
    typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window &&
    VAPID_PUBLIC_KEY.length > 0
  );
}

function readStoredRegistration(): StoredRegistration | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(PUSH_REGISTRATION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredRegistration;
    if (!parsed?.userToken || !parsed?.endpoint) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeStoredRegistration(value: StoredRegistration) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(PUSH_REGISTRATION_STORAGE_KEY, JSON.stringify(value));
}

function clearStoredRegistration() {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(PUSH_REGISTRATION_STORAGE_KEY);
}

async function getServiceWorkerRegistration(): Promise<ServiceWorkerRegistration> {
  const existing = await navigator.serviceWorker.getRegistration(SERVICE_WORKER_SCOPE);
  if (existing) return existing;
  return navigator.serviceWorker.register(SERVICE_WORKER_PATH, {
    scope: SERVICE_WORKER_SCOPE,
  });
}

/** Crée un abonnement `PushSubscription` frais (on se désabonne d'abord si besoin). */
async function subscribe(registration: ServiceWorkerRegistration): Promise<PushSubscription> {
  const existing = await registration.pushManager.getSubscription();
  if (existing) {
    try {
      await existing.unsubscribe();
    } catch (error) {
      console.warn(LOG, 'unsubscribe (ancien abonnement) a échoué', error);
    }
  }

  return registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: vapidApplicationServerKey(VAPID_PUBLIC_KEY) as BufferSource,
  });
}

/**
 * Écrit / met à jour l'abonnement dans Supabase, associé au `user_token`
 * (`uf-...`) de l'élève. Un upsert sur `endpoint` évite les doublons quand le
 * navigateur renouvelle l'abonnement.
 */
async function saveSubscription(userToken: string, subscription: PushSubscription) {
  const json = subscription.toJSON();
  if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
    throw new Error('Abonnement push incomplet (endpoint / clés manquants).');
  }

  const { error } = await supabase.from(PUSH_SUBSCRIPTIONS_TABLE).upsert(
    {
      user_token: userToken,
      endpoint: json.endpoint,
      p256dh: json.keys.p256dh,
      auth: json.keys.auth,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'endpoint' },
  );

  if (error) {
    throw new Error(`Supabase upsert push_subscriptions: ${error.message}`);
  }

  return json.endpoint;
}

async function removeSubscriptionRow(endpoint: string) {
  await supabase.from(PUSH_SUBSCRIPTIONS_TABLE).delete().eq('endpoint', endpoint);
}

function usePushNotificationsState(): PushNotificationsValue {
  const supported = isWebPushSupported();
  const [permission, setPermission] = useState<PushPermissionState>(
    supported ? 'pending' : 'unsupported',
  );
  const [busy, setBusy] = useState(false);
  const [subscribed, setSubscribed] = useState(() => Boolean(readStoredRegistration()));
  const [error, setError] = useState<string | null>(null);

  const syncIfGranted = useCallback(async () => {
    if (!supported) return;
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;

    const userToken = await getUserToken();
    if (!userToken) {
      setError('Identifiant élève manquant — reconnecte-toi.');
      return;
    }

    const stored = readStoredRegistration();
    if (stored && stored.userToken !== userToken) {
      clearStoredRegistration();
      setSubscribed(false);
    }

    const registration = await getServiceWorkerRegistration();
    await navigator.serviceWorker.ready;
    const pushSubscription = await subscribe(registration);
    const endpoint = await saveSubscription(userToken, pushSubscription);

    writeStoredRegistration({ userToken, endpoint, savedAt: new Date().toISOString() });
    setSubscribed(true);
    setError(null);
  }, [supported]);

  useEffect(() => {
    if (!supported) return;
    setPermission(Notification.permission);
    if (Notification.permission === 'granted' && !readStoredRegistration()) {
      void syncIfGranted().catch((caught) => {
        console.warn(LOG, 'sync automatique échouée', caught);
        setError(caught instanceof Error ? caught.message : "Échec de l'abonnement push.");
      });
    }
  }, [supported, syncIfGranted]);

  const enable = useCallback(async () => {
    if (!supported || busy) return subscribed;
    setBusy(true);
    setError(null);
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result !== 'granted') {
        setError(
          result === 'denied'
            ? 'Notifications refusées dans les réglages Android / Chrome.'
            : 'Permission notifications non accordée.',
        );
        return false;
      }
      await syncIfGranted();
      return true;
    } catch (caught) {
      console.error(LOG, 'enable() a échoué', caught);
      setError(caught instanceof Error ? caught.message : "Impossible d'activer les notifications.");
      return false;
    } finally {
      setBusy(false);
    }
  }, [busy, subscribed, supported, syncIfGranted]);

  const disable = useCallback(async () => {
    if (!supported) return;
    setBusy(true);
    try {
      const registration = await navigator.serviceWorker.getRegistration(SERVICE_WORKER_SCOPE);
      const pushSubscription = await registration?.pushManager.getSubscription();
      if (pushSubscription) {
        await removeSubscriptionRow(pushSubscription.endpoint);
        await pushSubscription.unsubscribe();
      }
    } catch (caught) {
      console.warn(LOG, 'disable() a échoué', caught);
    } finally {
      clearStoredRegistration();
      setSubscribed(false);
      setBusy(false);
    }
  }, [supported]);

  return useMemo(
    () => ({ supported, permission, busy, subscribed, error, enable, disable }),
    [supported, permission, busy, subscribed, error, enable, disable],
  );
}

export function PushNotificationsProvider({ children }: { children: React.ReactNode }) {
  const value = usePushNotificationsState();
  return React.createElement(PushNotificationsContext.Provider, { value }, children);
}

export function usePushNotifications(): PushNotificationsValue {
  const context = useContext(PushNotificationsContext);
  if (!context) {
    throw new Error('usePushNotifications must be used within PushNotificationsProvider');
  }
  return context;
}
