import type { StreamChat } from 'stream-chat';
/**
 * Disconnect the websocket connection when app goes to background,
 * and reconnect when app comes to foreground.
 * We do this to make sure the user receives push notifications when app is in the background.
 * You can't receive push notification until you have active websocket connection.
 */
export declare const useIsOnline: (client: StreamChat, closeConnectionOnBackground?: boolean) => {
    connectionRecovering: boolean;
    isOnline: boolean | null;
};
//# sourceMappingURL=useIsOnline.d.ts.map