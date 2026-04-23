import React, { PropsWithChildren } from 'react';
import { ChannelState, LocalMessage, Thread } from 'stream-chat';
export type ThreadType = {
    thread: LocalMessage;
    threadInstance: Thread;
};
export type ThreadContextValue = {
    allowThreadMessagesInChannel: boolean;
    closeThread: () => void;
    loadMoreThread: () => Promise<void>;
    openThread: (message: LocalMessage) => void;
    reloadThread: () => void;
    setThreadLoadingMore: React.Dispatch<React.SetStateAction<boolean>>;
    thread: LocalMessage | null;
    threadHasMore: boolean;
    threadMessages: ChannelState['threads'][string];
    loadMoreRecentThread?: (opts: {
        limit?: number;
    }) => Promise<void>;
    /**
     * Boolean to enable/disable parent message press
     */
    parentMessagePreventPress?: boolean;
    threadInstance?: Thread | null;
    threadLoadingMore?: boolean;
    threadLoadingMoreRecent?: boolean;
};
export declare const ThreadContext: React.Context<ThreadContextValue>;
export declare const ThreadProvider: ({ children, value, }: PropsWithChildren<{
    value: ThreadContextValue;
}>) => React.JSX.Element;
export declare const useThreadContext: () => ThreadContextValue;
//# sourceMappingURL=ThreadContext.d.ts.map