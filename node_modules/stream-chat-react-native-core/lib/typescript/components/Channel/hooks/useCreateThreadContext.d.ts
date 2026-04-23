import type { ThreadContextValue } from '../../../contexts/threadContext/ThreadContext';
export declare const useCreateThreadContext: ({ allowThreadMessagesInChannel, closeThread, loadMoreThread, openThread, reloadThread, setThreadLoadingMore, thread, threadHasMore, threadInstance, threadLoadingMore, threadMessages, }: ThreadContextValue) => {
    loadMoreRecentThread: ({ limit }?: {
        limit?: number;
    }) => Promise<void>;
    loadMoreThread: ({ limit }?: {
        limit?: number;
    }) => Promise<void>;
    threadInstance: import("stream-chat").Thread;
    threadLoadingMore: boolean | undefined;
    threadLoadingMoreRecent: boolean | undefined;
    threadMessages: import("stream-chat").LocalMessage[];
    allowThreadMessagesInChannel: boolean;
    closeThread: () => void;
    openThread: (message: import("stream-chat").LocalMessage) => void;
    reloadThread: () => void;
    setThreadLoadingMore: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    thread: import("stream-chat").LocalMessage | null;
    threadHasMore: boolean;
} | {
    loadMoreRecentThread?: undefined;
    loadMoreThread: () => Promise<void>;
    threadInstance?: undefined;
    threadLoadingMore: boolean | undefined;
    threadLoadingMoreRecent?: undefined;
    threadMessages: import("stream-chat").LocalMessage[];
    allowThreadMessagesInChannel: boolean;
    closeThread: () => void;
    openThread: (message: import("stream-chat").LocalMessage) => void;
    reloadThread: () => void;
    setThreadLoadingMore: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    thread: import("stream-chat").LocalMessage | null;
    threadHasMore: boolean;
};
//# sourceMappingURL=useCreateThreadContext.d.ts.map