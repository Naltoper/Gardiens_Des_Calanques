import React, { PropsWithChildren } from 'react';
import { FlatListProps } from 'react-native';
import { Channel, Thread } from 'stream-chat';
import { ThreadType } from '../threadContext/ThreadContext';
export type ThreadsContextValue = {
    isFocused: boolean;
    isLoading: boolean;
    isLoadingNext: boolean;
    threads: Thread[];
    additionalFlatListProps?: Partial<FlatListProps<Thread>>;
    loadMore?: () => Promise<void>;
    onThreadSelect?: (thread: ThreadType, channel: Channel) => void;
    ThreadListEmptyPlaceholder?: React.ComponentType;
    ThreadListItem?: React.ComponentType;
    ThreadListLoadingIndicator?: React.ComponentType;
    ThreadListLoadingMoreIndicator?: React.ComponentType;
    ThreadListUnreadBanner?: React.ComponentType;
};
export declare const ThreadsContext: React.Context<ThreadsContextValue>;
export declare const ThreadsProvider: ({ children, value, }: PropsWithChildren<{
    value: ThreadsContextValue;
}>) => React.JSX.Element;
export declare const useThreadsContext: () => ThreadsContextValue;
//# sourceMappingURL=ThreadsContext.d.ts.map