import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { PUSH_SUBSCRIBE_PATH, VAPID_PUBLIC_KEY } from '../constants/webPush';
import { getUserToken } from '../utils/storage';
import { urlBase64ToUint8Array } from '../utils/urlBase64ToUint8Array';

type PushPermission = NotificationPermission | 'unsupported' | 'pending';

function isWebPushSupported() {
  return (
    Platform.OS === 'web' &&
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

async function getRegistration() {
  const existing = await navigator.serviceWorker.getRegistration('/');
  if (existing) return existing;
  return navigator.serviceWorker.register('/sw.js', { scope: '/' });
}

async function persistSubscription(
  userToken: string,
  subscription: PushSubscription,
  action: 'subscribe' | 'unsubscribe' = 'subscribe',
) {
  const response = await fetch(PUSH_SUBSCRIBE_PATH, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_token: userToken,
      action,
      subscription: subscription.toJSON(),
    }),
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`push-subscribe ${response.status}: ${detail}`);
  }
  return response.json().catch(() => ({ ok: true }));
}

export function useWebPush() {
  const [permission, setPermission] = useState<PushPermission>('pending');
  const [busy, setBusy] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const supported = isWebPushSupported();

  const syncGrantedSubscription = useCallback(async () => {
    if (!supported || Notification.permission !== 'granted') return;
    const userToken = await getUserToken();
    if (!userToken) {
      setSyncError("Identifiant élève manquant — reconnecte-toi.");
      return;
    }
    const registration = await getRegistration();
    await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
    }
    await persistSubscription(userToken, subscription);
    setSyncError(null);
  }, [supported]);

  useEffect(() => {
    if (!supported) {
      setPermission('unsupported');
      return;
    }
    setPermission(Notification.permission);
    if (Notification.permission === 'granted') {
      void syncGrantedSubscription().catch((error) => {
        console.warn('[web-push]', error);
        setSyncError("L'abonnement push n'a pas pu être enregistré.");
      });
    }
  }, [supported, syncGrantedSubscription]);

  const enable = useCallback(async () => {
    if (!supported || busy) return Notification.permission === 'granted';
    setBusy(true);
    setSyncError(null);
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result !== 'granted') return false;
      await syncGrantedSubscription();
      return true;
    } catch (error) {
      console.warn('[web-push]', error);
      setSyncError("Impossible d'activer les notifications.");
      return false;
    } finally {
      setBusy(false);
    }
  }, [busy, supported, syncGrantedSubscription]);

  return {
    supported,
    permission,
    busy,
    syncError,
    enable,
  };
}
