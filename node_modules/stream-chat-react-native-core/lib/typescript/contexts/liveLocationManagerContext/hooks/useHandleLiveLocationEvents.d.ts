import { Channel, SharedLocationResponse } from 'stream-chat';
export type UseLiveLocationsEventsParams = {
    /**
     * The channel where the live location is shared.
     */
    channel: Channel;
    /**
     * The ID of the message containing the shared location.
     */
    messageId: string;
    /**
     * Callback function to handle location updates.
     * It receives the updated shared location response.
     */
    onLocationUpdate?: (location: SharedLocationResponse) => void;
};
/**
 * Custom hook to handle live location events.
 */
export declare const useHandleLiveLocationEvents: ({ channel, messageId, onLocationUpdate, }: UseLiveLocationsEventsParams) => {
    isLiveLocationStopped: boolean | null;
    locationResponse: SharedLocationResponse | undefined;
};
//# sourceMappingURL=useHandleLiveLocationEvents.d.ts.map