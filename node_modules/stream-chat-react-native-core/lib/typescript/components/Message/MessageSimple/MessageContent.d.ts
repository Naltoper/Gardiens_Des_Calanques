import React from 'react';
import { ColorValue } from 'react-native';
import { MessageContextValue } from '../../../contexts/messageContext/MessageContext';
import { MessagesContextValue } from '../../../contexts/messagesContext/MessagesContext';
import { TranslationContextValue } from '../../../contexts/translationContext/TranslationContext';
export type MessageContentPropsWithContext = Pick<MessageContextValue, 'alignment' | 'goToMessage' | 'groupStyles' | 'isEditedMessageOpen' | 'isMyMessage' | 'message' | 'messageContentOrder' | 'onLongPress' | 'onPress' | 'onPressIn' | 'otherAttachments' | 'preventPress' | 'threadList' | 'isMessageAIGenerated'> & Pick<MessagesContextValue, 'additionalPressableProps' | 'Attachment' | 'enableMessageGroupingByUser' | 'FileAttachmentGroup' | 'Gallery' | 'isAttachmentEqual' | 'MessageError' | 'MessageLocation' | 'myMessageTheme' | 'Reply' | 'StreamingMessageView'> & Pick<TranslationContextValue, 't'> & {
    setMessageContentWidth: React.Dispatch<React.SetStateAction<number>>;
    /**
     * Background color for the message content
     */
    backgroundColor?: ColorValue;
    /**
     * If the message is the very last message in the message list
     */
    isVeryLastMessage?: boolean;
    /**
     * If the message has no border radius
     */
    noBorder?: boolean;
    /**
     * If the message is grouped in a single or bottom container
     */
    messageGroupedSingleOrBottom?: boolean;
};
export type MessageContentProps = Partial<Omit<MessageContentPropsWithContext, 'setMessageContentWidth'>> & Pick<MessageContentPropsWithContext, 'setMessageContentWidth'>;
/**
 * Child of MessageSimple that displays a message's content
 */
export declare const MessageContent: (props: MessageContentProps) => React.JSX.Element;
//# sourceMappingURL=MessageContent.d.ts.map