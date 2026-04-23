import React from 'react';
import { MessageContextValue } from '../../../../contexts/messageContext/MessageContext';
import { MessagesContextValue } from '../../../../contexts/messagesContext/MessagesContext';
import { ReactionSummary } from '../../hooks/useProcessReactions';
export type ReactionListBottomItemProps = Partial<Pick<MessageContextValue, 'handleReaction' | 'onLongPress' | 'onPress' | 'onPressIn' | 'preventPress' | 'showMessageOverlay'>> & Partial<Pick<MessagesContextValue, 'supportedReactions'>> & {
    reaction: ReactionSummary;
};
export declare const ReactionListBottomItem: (props: ReactionListBottomItemProps) => React.JSX.Element;
export type ReactionListBottomProps = Partial<Pick<MessageContextValue, 'handleReaction' | 'hasReactions' | 'onLongPress' | 'onPress' | 'onPressIn' | 'preventPress' | 'reactions' | 'showMessageOverlay'>> & Partial<Pick<MessagesContextValue, 'supportedReactions'>>;
export declare const ReactionListBottom: (props: ReactionListBottomProps) => React.JSX.Element | null;
//# sourceMappingURL=ReactionListBottom.d.ts.map