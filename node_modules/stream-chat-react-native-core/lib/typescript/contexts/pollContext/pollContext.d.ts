import React, { PropsWithChildren } from 'react';
import { LocalMessage, Poll } from 'stream-chat';
export type PollContextValue = {
    message: LocalMessage;
    poll: Poll;
};
export declare const PollContext: React.Context<PollContextValue>;
export declare const PollContextProvider: ({ children, value, }: PropsWithChildren<{
    value: PollContextValue;
}>) => React.JSX.Element;
export declare const usePollContext: () => PollContextValue;
//# sourceMappingURL=pollContext.d.ts.map