import React from 'react';
import { MessageContextValue } from '../../contexts/messageContext/MessageContext';
import { MessagesContextValue } from '../../contexts/messagesContext/MessagesContext';
import { Reaction } from '../../types/types';
import { ReactionData } from '../../utils/utils';
export type MessageUserReactionsProps = Partial<Pick<MessagesContextValue, 'MessageUserReactionsAvatar' | 'MessageUserReactionsItem' | 'supportedReactions'>> & Partial<Pick<MessageContextValue, 'message'>> & {
    /**
     * An array of reactions
     */
    reactions?: Reaction[];
    /**
     * The selected reaction
     */
    selectedReaction?: string;
};
export type ReactionSelectorItemType = ReactionData & {
    onSelectReaction: (type: string) => void;
    selectedReaction?: string;
};
export declare const MessageUserReactions: (props: MessageUserReactionsProps) => React.JSX.Element;
//# sourceMappingURL=MessageUserReactions.d.ts.map