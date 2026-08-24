/** VAPID public key (safe to ship in the client). Private key stays in Vercel env. */
export const VAPID_PUBLIC_KEY =
  process.env.EXPO_PUBLIC_VAPID_KEY ??
  'BH-0HJVlx4l2xkMqp7BzklEooka1P6_VD3_eIIBgPUZmNc9wEGEVQ0LO2w0cO2J6GoNn391luJhXRFHt4u6mD1M';

export const PUSH_SUBSCRIBE_PATH = '/api/push-subscribe';
