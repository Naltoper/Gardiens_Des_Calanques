import React from 'react';
import { MessageContextValue } from '../../../contexts/messageContext/MessageContext';
import { MessagesContextValue } from '../../../contexts/messagesContext/MessagesContext';
export type MessageSimplePropsWithContext = Pick<MessageContextValue, 'alignment' | 'channel' | 'groupStyles' | 'hasReactions' | 'isMyMessage' | 'lastGroupMessage' | 'members' | 'message' | 'onlyEmojis' | 'otherAttachments' | 'showMessageStatus' | 'setQuotedMessage'> & Pick<MessagesContextValue, 'customMessageSwipeAction' | 'enableMessageGroupingByUser' | 'enableSwipeToReply' | 'myMessageTheme' | 'MessageAvatar' | 'MessageContent' | 'MessageDeleted' | 'MessageFooter' | 'MessageHeader' | 'MessagePinnedHeader' | 'MessageReplies' | 'MessageStatus' | 'MessageSwipeContent' | 'messageSwipeToReplyHitSlop' | 'ReactionListBottom' | 'reactionListPosition' | 'ReactionListTop'> & {
    /**
     * Will determine whether the swipeable wrapper is always rendered for each
     * message. If set to false, the animated wrapper will be rendered only when
     * a swiping gesture is active and not otherwise.
     * Since stateful components would lose their state if we remount them while
     * an animation is happening, this should always be set to true in those instances.
     */
    shouldRenderSwipeableWrapper: boolean;
};
export type MessageSimpleProps = Partial<MessageSimplePropsWithContext>;
/**
 *
 * Message UI component
 */
export declare const MessageSimple: {
    (props: MessageSimpleProps): React.JSX.Element;
    displayName: string;
};
//# sourceMappingURL=MessageSimple.d.ts.map