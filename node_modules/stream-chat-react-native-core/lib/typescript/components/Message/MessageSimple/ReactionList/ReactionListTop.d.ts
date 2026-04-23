import React from 'react';
import { MessageContextValue } from '../../../../contexts/messageContext/MessageContext';
import { MessagesContextValue } from '../../../../contexts/messagesContext/MessagesContext';
import { ReactionSummary } from '../../hooks/useProcessReactions';
export type ReactionListTopItemProps = Partial<Pick<MessageContextValue, 'reactions'>> & Partial<Pick<MessagesContextValue, 'supportedReactions'>> & {
    index: number;
    reaction: ReactionSummary;
};
export declare const ReactionListTopItem: (props: ReactionListTopItemProps) => React.JSX.Element;
export type ReactionListTopProps = Partial<Pick<MessageContextValue, 'alignment' | 'hasReactions' | 'onLongPress' | 'onPress' | 'onPressIn' | 'preventPress' | 'reactions' | 'showMessageOverlay'>> & Pick<MessagesContextValue, 'supportedReactions'> & {
    messageContentWidth: number;
    fill?: string;
    reactionSize?: number;
};
/**
 * ReactionListTop - A high level component which implements all the logic required for a message reaction list
 */
export declare const ReactionListTop: (props: ReactionListTopProps) => React.JSX.Element | null;
//# sourceMappingURL=ReactionListTop.d.ts.map