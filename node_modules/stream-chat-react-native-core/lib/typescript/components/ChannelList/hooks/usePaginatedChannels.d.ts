import React from 'react';
import { ChannelFilters, ChannelManager, ChannelOptions, ChannelSort } from 'stream-chat';
type Parameters = {
    channelManager: ChannelManager;
    enableOfflineSupport: boolean;
    filters: ChannelFilters;
    options: ChannelOptions;
    setForceUpdate: React.Dispatch<React.SetStateAction<number>>;
    sort: ChannelSort;
};
type QueryType = 'queryLocalDB' | 'reload' | 'refresh' | 'loadChannels';
export type QueryChannels = (queryType?: QueryType, retryCount?: number) => Promise<void>;
export declare const usePaginatedChannels: ({ channelManager, enableOfflineSupport, filters, options, sort, }: Parameters) => {
    channelListInitialized: boolean;
    channels: import("stream-chat").Channel[];
    error: Error | undefined;
    hasNextPage: boolean;
    loadingChannels: boolean;
    loadingNextPage: boolean;
    loadNextPage: () => Promise<void>;
    refreshing: boolean;
    refreshList: () => Promise<void>;
    reloadList: () => Promise<void>;
    staticChannelsActive: boolean;
};
export {};
//# sourceMappingURL=usePaginatedChannels.d.ts.map