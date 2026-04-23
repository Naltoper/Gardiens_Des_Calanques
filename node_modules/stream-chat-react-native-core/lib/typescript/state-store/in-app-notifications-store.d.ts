import { Notification, StateStore } from 'stream-chat';
export type InAppNotificationsState = {
    notifications: Notification[];
};
export declare const inAppNotificationsStore: StateStore<InAppNotificationsState>;
export declare const openInAppNotification: (notification: Notification) => void;
export declare const closeInAppNotification: (id: string) => void;
//# sourceMappingURL=in-app-notifications-store.d.ts.map