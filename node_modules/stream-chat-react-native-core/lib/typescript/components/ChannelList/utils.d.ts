import type { Channel, ChannelSort, StreamChat } from 'stream-chat';
type MoveParameters = {
    channels: Array<Channel>;
    channelToMove: Channel;
    /**
     * If the index of the channel within `channels` list which is being moved upwards
     * (`channelToMove`) is known, you can supply it to skip extra calculation.
     */
    channelToMoveIndexWithinChannels?: number;
    sort?: ChannelSort;
};
export declare const moveChannelUp: ({ channels, channelToMove, channelToMoveIndexWithinChannels, sort, }: MoveParameters) => Channel[];
type GetParameters = {
    client: StreamChat;
    id: string;
    type: string;
};
export declare const getChannel: ({ client, id, type }: GetParameters) => Promise<Channel>;
export declare const DEFAULT_QUERY_CHANNELS_LIMIT = 10;
export declare const MAX_QUERY_CHANNELS_LIMIT = 30;
export {};
//# sourceMappingURL=utils.d.ts.map