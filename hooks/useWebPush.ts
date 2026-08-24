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
  await fetch(PUSH_SUBSCRIBE_PATH, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_token: userToken,
      action,
      subscription: subscription.toJSON(),
    }),
  });
}

export function useWebPush() {
  const [permission, setPermission] = useState<PushPermission>('pending');
  const [busy, setBusy] = useState(false);
  const supported = isWebPushSupported();

  const syncGrantedSubscription = useCallback(async () => {
    if (!supported || Notification.permission !== 'granted') return;
    const userToken = await getUserToken();
    if (!userToken) return;
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
  }, [supported]);

  useEffect(() => {
    if (!supported) {
      setPermission('unsupported');
      return;
    }
    setPermission(Notification.permission);
    if (Notification.permission === 'granted') {
      void syncGrantedSubscription();
    }
  }, [supported, syncGrantedSubscription]);

  const enable = useCallback(async () => {
    if (!supported || busy) return Notification.permission === 'granted';
    setBusy(true);
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result !== 'granted') return false;
      await syncGrantedSubscription();
      return true;
    } catch (error) {
      console.warn('[web-push]', error);
      return false;
    } finally {
      setBusy(false);
    }
  }, [busy, supported, syncGrantedSubscription]);

  return {
    supported,
    permission,
    busy,
    enable,
  };
}
