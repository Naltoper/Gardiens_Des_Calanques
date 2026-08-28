export function notifyIncomingChat(reportId: string) {
  if (typeof window === 'undefined' || typeof Notification === 'undefined') return;
  if (Notification.permission !== 'granted') return;
  if (typeof document !== 'undefined' && !document.hidden) return;

  try {
    new Notification('Nouveau message', {
      body: 'La cellule a répondu à ton signalement.',
      tag: `gdc-chat-${reportId}`,
      icon: '/icons/icon-512.png?v=3',
      badge: '/notif-icon.png',
    });
  } catch (error) {
    console.warn('[web-push] local notification', error);
  }
}
