import { Channel, LocalMessage, ChannelState as StreamChannelState } from 'stream-chat';
export declare const channelInitialState: {
    hasMore: boolean;
    hasMoreNewer: boolean;
    loading: boolean;
    loadingMore: boolean;
    loadingMoreRecent: boolean;
    members: {};
    messages: never[];
    pinnedMessages: never[];
    read: {};
    targetedMessageId: undefined;
    typing: {};
    watcherCount: number;
    watchers: {};
};
/**
 * The ChannelMessagesState object
 */
export type ChannelMessagesState = {
    hasMore?: boolean;
    hasMoreNewer?: boolean;
    loading?: boolean;
    loadingMore?: boolean;
    loadingMoreRecent?: boolean;
    messages?: StreamChannelState['messages'];
    pinnedMessages?: StreamChannelState['pinnedMessages'];
    targetedMessageId?: string;
};
/**
 * The ChannelThreadState object
 */
export type ChannelThreadState = {
    thread: LocalMessage | null;
    threadHasMore?: boolean;
    threadLoadingMore?: boolean;
    threadMessages?: StreamChannelState['messages'];
};
/**
 * The ChannelState object
 */
export type ChannelState = ChannelMessagesState & {
    members?: StreamChannelState['members'];
    read?: StreamChannelState['read'];
    typing?: StreamChannelState['typing'];
    watcherCount?: number;
    watchers?: StreamChannelState['watchers'];
};
/**
 * The useChannelMessageDataState hook that handles the state for the channel messages.
 */
export declare const useChannelMessageDataState: (channel: Channel) => {
    copyMessagesStateFromChannel: (channel: Channel) => void;
    jumpToLatestMessage: () => void;
    jumpToMessageFinished: (hasMoreNewer: boolean, targetedMessageId: string) => void;
    loadInitialMessagesStateFromChannel: (channel: Channel, hasMore: boolean) => void;
    loadMoreFinished: (hasMore: boolean, messages: ChannelState["messages"]) => void;
    loadMoreRecentFinished: (hasMoreNewer: boolean, messages: ChannelState["messages"]) => void;
    setLoading: (loading: boolean) => void;
    setLoadingMore: (loadingMore: boolean) => void;
    setLoadingMoreRecent: (loadingMoreRecent: boolean) => void;
    state: ChannelMessagesState;
};
/**
 * The useChannelThreadState hook that handles the state for the channel member, read, typing, watchers, etc.
 */
export declare const useChannelDataState: (channel: Channel) => {
    copyStateFromChannel: (channel: Channel) => void;
    initStateFromChannel: (channel: Channel) => void;
    setRead: (channel: Channel) => void;
    setTyping: (channel: Channel) => void;
    state: ChannelState;
};
//# sourceMappingURL=useChannelDataState.d.ts.map