import React, { PropsWithChildren } from 'react';
import { ChatContextValue } from '../../contexts/chatContext/ChatContext';
import { ThreadContextValue } from '../../contexts/threadContext/ThreadContext';
import { TypingContextValue } from '../../contexts/typingContext/TypingContext';
type TypingIndicatorContainerPropsWithContext = Pick<TypingContextValue, 'typing'> & Pick<ChatContextValue, 'client'> & Pick<ThreadContextValue, 'thread'>;
export type TypingIndicatorContainerProps = PropsWithChildren<Partial<TypingIndicatorContainerPropsWithContext>>;
export declare const TypingIndicatorContainer: {
    (props: TypingIndicatorContainerProps): React.JSX.Element;
    displayName: string;
};
export {};
//# sourceMappingURL=TypingIndicatorContainer.d.ts.map