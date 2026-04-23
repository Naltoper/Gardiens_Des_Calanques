import React from 'react';
import { LocalMessage } from 'stream-chat';
import { ChannelProps } from '../../components';
import { ThreadContextValue } from '../threadContext/ThreadContext';
export type MessageComposerContextValue = {
    channel: ChannelProps['channel'];
    thread: ThreadContextValue['thread'];
    threadInstance: ThreadContextValue['threadInstance'];
    /**
     * Variable that tracks the editing state.
     * It is defined with message type if the editing state is true, else its undefined.
     */
    editing?: LocalMessage;
};
export declare const MessageComposerContext: React.Context<MessageComposerContextValue>;
type Props = React.PropsWithChildren<{
    value: Pick<MessageComposerContextValue, 'channel' | 'threadInstance' | 'thread'>;
}>;
export declare const MessageComposerProvider: ({ children, value }: Props) => React.JSX.Element;
export declare const useMessageComposerContext: () => MessageComposerContextValue;
export {};
//# sourceMappingURL=MessageComposerContext.d.ts.map