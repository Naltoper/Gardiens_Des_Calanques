import type { Channel, EventTypes, StreamChat } from 'stream-chat';
export declare function useSyncClientEventsToChannel<O>(_: {
    channel: Channel;
    client: StreamChat;
    selector: (channel: Channel, client: StreamChat) => O;
    stateChangeEventKeys?: EventTypes[];
}): O;
export declare function useSyncClientEventsToChannel<O>(_: {
    selector: (channel: Channel, client: StreamChat) => O;
    channel?: Channel | undefined;
    client?: StreamChat | undefined;
    stateChangeEventKeys?: EventTypes[];
}): O | undefined;
//# sourceMappingURL=useSyncClientEvents.d.ts.map