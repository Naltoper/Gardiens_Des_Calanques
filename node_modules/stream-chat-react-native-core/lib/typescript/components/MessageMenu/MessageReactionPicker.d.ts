import React from 'react';
import { MessageContextValue } from '../../contexts/messageContext/MessageContext';
import { MessagesContextValue } from '../../contexts/messagesContext/MessagesContext';
import { ReactionData } from '../../utils/utils';
export type MessageReactionPickerProps = Pick<MessagesContextValue, 'supportedReactions'> & Pick<MessageContextValue, 'handleReaction' | 'dismissOverlay'> & {
    /**
     * An array of reaction types that the current user has reacted with
     */
    ownReactionTypes: string[];
};
export type ReactionPickerItemType = ReactionData & {
    onSelectReaction: (type: string) => void;
    ownReactionTypes: string[];
};
/**
 * MessageReactionPicker - A high level component which implements all the logic required for a message overlay reaction list
 */
export declare const MessageReactionPicker: (props: MessageReactionPickerProps) => React.JSX.Element | null;
//# sourceMappingURL=MessageReactionPicker.d.ts.map