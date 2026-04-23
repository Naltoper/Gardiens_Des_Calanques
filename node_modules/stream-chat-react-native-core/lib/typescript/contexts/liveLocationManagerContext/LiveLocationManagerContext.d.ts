import React from 'react';
import { LiveLocationManager, WatchLocation } from 'stream-chat';
interface LiveLocationManagerContextValue {
    liveLocationManager: LiveLocationManager | null;
}
export declare const useLiveLocationManagerContext: () => LiveLocationManagerContextValue;
export type LiveLocationManagerProviderProps = {
    watchLocation: WatchLocation;
    getDeviceId?: () => string;
};
export declare const LiveLocationManagerProvider: (props: React.PropsWithChildren<LiveLocationManagerProviderProps>) => React.JSX.Element;
export {};
//# sourceMappingURL=LiveLocationManagerContext.d.ts.map