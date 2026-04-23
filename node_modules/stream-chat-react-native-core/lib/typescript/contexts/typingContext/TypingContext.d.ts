import React, { PropsWithChildren } from 'react';
import type { ChannelState } from 'stream-chat';
export type TypingContextValue = {
    typing: ChannelState['typing'];
};
export declare const TypingContext: React.Context<TypingContextValue>;
export declare const TypingProvider: ({ children, value, }: PropsWithChildren<{
    value: TypingContextValue;
}>) => React.JSX.Element;
export declare const useTypingContext: () => TypingContextValue;
//# sourceMappingURL=TypingContext.d.ts.map