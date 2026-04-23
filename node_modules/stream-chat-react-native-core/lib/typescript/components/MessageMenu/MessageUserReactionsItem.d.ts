import React from 'react';
import { MessagesContextValue } from '../../contexts/messagesContext/MessagesContext';
import type { Reaction } from '../../types/types';
import { ReactionData } from '../../utils/utils';
export type MessageUserReactionsItemProps = Pick<MessagesContextValue, 'MessageUserReactionsAvatar'> & {
    /**
     * The reaction object
     */
    reaction: Reaction;
    /**
     * An array of supported reactions
     */
    supportedReactions: ReactionData[];
};
export declare const MessageUserReactionsItem: ({ MessageUserReactionsAvatar, reaction, supportedReactions, }: MessageUserReactionsItemProps) => React.JSX.Element;
//# sourceMappingURL=MessageUserReactionsItem.d.ts.map