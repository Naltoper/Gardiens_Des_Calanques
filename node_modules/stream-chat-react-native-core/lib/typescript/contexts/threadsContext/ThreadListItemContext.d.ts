import React, { PropsWithChildren } from 'react';
import { Channel, LocalMessage, Thread } from 'stream-chat';
export type ThreadListItemContextValue = {
    channel: Channel;
    dateString: string | number | undefined;
    deletedAtDateString: string | number | undefined;
    lastReply: LocalMessage | undefined;
    ownUnreadMessageCount: number;
    parentMessage: LocalMessage | undefined;
    thread: Thread;
};
export declare const ThreadListItemContext: React.Context<ThreadListItemContextValue>;
export declare const ThreadListItemProvider: ({ children, value, }: PropsWithChildren<{
    value: ThreadListItemContextValue;
}>) => React.JSX.Element;
export declare const useThreadListItemContext: () => ThreadListItemContextValue;
//# sourceMappingURL=ThreadListItemContext.d.ts.map