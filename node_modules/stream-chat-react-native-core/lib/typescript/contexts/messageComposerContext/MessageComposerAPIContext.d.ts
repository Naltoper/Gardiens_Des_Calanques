import React from 'react';
import { LocalMessage, type MessageComposer } from 'stream-chat';
export type MessageComposerAPIContextValue = {
    setQuotedMessage: MessageComposer['setQuotedMessage'];
    setEditingState: (message?: LocalMessage) => void;
    clearEditingState: () => void;
};
export declare const MessageComposerAPIContext: React.Context<MessageComposerAPIContextValue>;
type Props = React.PropsWithChildren<{
    value: MessageComposerAPIContextValue;
}>;
export declare const MessageComposerAPIProvider: ({ children, value }: Props) => React.JSX.Element;
export declare const useMessageComposerAPIContext: () => MessageComposerAPIContextValue;
export {};
//# sourceMappingURL=MessageComposerAPIContext.d.ts.map