import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Platform } from 'react-native';

import {
  PUSH_REGISTER_PATH,
  PUSH_REGISTRATION_STORAGE_KEY,
  SERVICE_WORKER_PATH,
  SERVICE_WORKER_SCOPE,
  VAPID_PUBLIC_KEY,
} from '../constants/pushNotifications';
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

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Crée un abonnement `PushSubscription` frais (on se désabonne d'abord si
 * besoin).
 *
 * Sur Android TWA, la permission de notification est déléguée à une
 * activité Android native (`NotificationPermissionRequestActivity`) : juste
 * après que l'utilisateur a accepté, `pushManager.subscribe()` peut échouer
 * une première fois le temps que l'OS termine de propager l'autorisation au
 * WebView. On retente donc une fois après un court délai avant d'abandonner.
 */
async function subscribe(registration: ServiceWorkerRegistration): Promise<PushSubscription> {
  const existing = await registration.pushManager.getSubscription();
  if (existing) {
    try {
      await existing.unsubscribe();
    } catch (error) {
      console.warn(LOG, 'unsubscribe (ancien abonnement) a échoué', error);
    }
  }

  const applicationServerKey = vapidApplicationServerKey(VAPID_PUBLIC_KEY) as BufferSource;

  try {
    return await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey });
  } catch (error) {
    console.warn(LOG, 'pushManager.subscribe() a échoué, nouvelle tentative dans 400ms', error);
    await wait(400);
    return registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey });
  }
}

async function callRegisterEndpoint(payload: {
  user_token: string;
  action: 'subscribe' | 'unsubscribe';
  subscription: { endpoint: string; keys: { p256dh: string; auth: string } };
}) {
  const response = await fetch(PUSH_REGISTER_PATH, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const text = await response.text();
  let data: { ok?: boolean; error?: string; message?: string } = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text };
  }
  if (!response.ok || data.ok === false) {
    throw new Error(
      data.message || data.error || `register-push-subscription ${response.status}: ${text}`,
    );
  }
}

/**
 * Écrit / met à jour l'abonnement, associé au `user_token` (`uf-...`) de
 * l'élève. Passe par `/api/register-push-subscription` (service role key
 * côté serveur) plutôt que par un upsert Supabase direct depuis le client :
 * ça évite toute dépendance à une policy RLS + GRANT anon sur
 * `push_subscriptions`, qui est le point de défaillance historique de cette
 * fonctionnalité (erreur 42501 "permission denied for table
 * push_subscriptions").
 */
async function saveSubscription(userToken: string, subscription: PushSubscription) {
  const json = subscription.toJSON();
  if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
    throw new Error('Abonnement push incomplet (endpoint / clés manquants).');
  }

  await callRegisterEndpoint({
    user_token: userToken,
    action: 'subscribe',
    subscription: { endpoint: json.endpoint, keys: { p256dh: json.keys.p256dh, auth: json.keys.auth } },
  });

  return json.endpoint;
}

async function removeSubscriptionRow(userToken: string, endpoint: string) {
  try {
    await callRegisterEndpoint({
      user_token: userToken,
      action: 'unsubscribe',
      subscription: { endpoint, keys: { p256dh: '', auth: '' } },
    });
  } catch (error) {
    console.warn(LOG, 'removeSubscriptionRow a échoué', error);
  }
}

function usePushNotificationsState(): PushNotificationsValue {
  const supported = isWebPushSupported();
  const [permission, setPermission] = useState<PushPermissionState>(
    supported ? 'pending' : 'unsupported',
  );
  const [busy, setBusy] = useState(false);
  const [subscribed, setSubscribed] = useState(() => Boolean(readStoredRegistration()));
  const [error, setError] = useState<string | null>(null);

  /**
   * Empêche deux souscriptions concurrentes (auto-sync au montage + clic
   * manuel) : les appels simultanés attendent tous la même promesse au lieu
   * de lancer chacun leur propre `pushManager.subscribe()`.
   */
  const subscriptionInFlightRef = useRef<Promise<void> | null>(null);

  /**
   * Souscrit et enregistre l'abonnement. Ne revérifie JAMAIS
   * `Notification.permission` : l'appelant a déjà la responsabilité de
   * confirmer que la permission est accordée avant d'appeler cette
   * fonction. C'est important sur Android TWA, où la permission est
   * déléguée à une boîte de dialogue système : re-lire
   * `Notification.permission` juste après `requestPermission()` peut
   * encore renvoyer une valeur non à jour pendant quelques centaines de
   * millisecondes, ce qui faisait échouer silencieusement l'abonnement
   * (aucune erreur, mais `subscribed` ne passait jamais à `true`).
   */
  const performSubscription = useCallback(async () => {
    if (subscriptionInFlightRef.current) {
      return subscriptionInFlightRef.current;
    }

    const run = (async () => {
      const userToken = await getUserToken();
      if (!userToken) {
        throw new Error('Identifiant élève manquant — reconnecte-toi.');
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
    })().finally(() => {
      subscriptionInFlightRef.current = null;
    });

    subscriptionInFlightRef.current = run;
    return run;
  }, []);

  /** Utilisé uniquement par la synchronisation automatique au montage. */
  const syncIfGranted = useCallback(async () => {
    if (!supported) return;
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
    await performSubscription();
  }, [performSubscription, supported]);

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
      // `result` est déjà 'granted' ici : on souscrit directement sans
      // repasser par la relecture de `Notification.permission`.
      await performSubscription();
      return true;
    } catch (caught) {
      console.error(LOG, 'enable() a échoué', caught);
      setError(caught instanceof Error ? caught.message : "Impossible d'activer les notifications.");
      return false;
    } finally {
      setBusy(false);
    }
  }, [busy, performSubscription, subscribed, supported]);

  const disable = useCallback(async () => {
    if (!supported) return;
    setBusy(true);
    try {
      const userToken = await getUserToken();
      const registration = await navigator.serviceWorker.getRegistration(SERVICE_WORKER_SCOPE);
      const pushSubscription = await registration?.pushManager.getSubscription();
      if (pushSubscription) {
        if (userToken) {
          await removeSubscriptionRow(userToken, pushSubscription.endpoint);
        }
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
