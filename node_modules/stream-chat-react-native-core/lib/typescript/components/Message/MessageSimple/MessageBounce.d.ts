import React from 'react';
import { MessageComposerAPIContextValue } from '../../../contexts/messageComposerContext/MessageComposerAPIContext';
import { MessageContextValue } from '../../../contexts/messageContext/MessageContext';
import { MessagesContextValue } from '../../../contexts/messagesContext/MessagesContext';
export type MessageBouncePropsWithContext = Pick<MessagesContextValue, 'removeMessage' | 'retrySendMessage'> & Pick<MessageContextValue, 'message'> & {
    setIsBounceDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
} & Pick<MessageComposerAPIContextValue, 'setEditingState'>;
export declare const MessageBounceWithContext: (props: MessageBouncePropsWithContext) => React.JSX.Element;
export type MessageBounceProps = Partial<MessageBouncePropsWithContext> & {
    setIsBounceDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
export declare const MessageBounce: (props: MessageBounceProps) => React.JSX.Element;
//# sourceMappingURL=MessageBounce.d.ts.map