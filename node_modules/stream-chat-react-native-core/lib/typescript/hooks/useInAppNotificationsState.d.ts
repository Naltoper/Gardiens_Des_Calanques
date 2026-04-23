import { Notification } from 'stream-chat';
export declare const useInAppNotificationsState: () => {
    closeInAppNotification: import("./useStableCallback").StableCallback<[id: string], void>;
    notifications: Notification[];
    openInAppNotification: import("./useStableCallback").StableCallback<[notificationData: Notification], void>;
};
//# sourceMappingURL=useInAppNotificationsState.d.ts.map