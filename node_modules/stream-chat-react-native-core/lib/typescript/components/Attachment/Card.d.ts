import React from 'react';
import { ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native';
import type { Attachment } from 'stream-chat';
import { ChatContextValue } from '../../contexts/chatContext/ChatContext';
import { MessageContextValue } from '../../contexts/messageContext/MessageContext';
import { MessagesContextValue } from '../../contexts/messagesContext/MessagesContext';
export type CardPropsWithContext = Attachment & Pick<ChatContextValue, 'ImageComponent'> & Pick<MessageContextValue, 'onLongPress' | 'onPress' | 'onPressIn' | 'preventPress'> & Pick<MessagesContextValue, 'additionalPressableProps' | 'CardCover' | 'CardFooter' | 'CardHeader' | 'myMessageTheme'> & {
    channelId: string | undefined;
    messageId: string | undefined;
    styles?: Partial<{
        authorName: StyleProp<TextStyle>;
        authorNameContainer: StyleProp<ViewStyle>;
        authorNameFooter: StyleProp<TextStyle>;
        authorNameFooterContainer: StyleProp<ViewStyle>;
        authorNameMask: StyleProp<ViewStyle>;
        cardCover: StyleProp<ImageStyle>;
        cardFooter: StyleProp<ViewStyle>;
        container: StyleProp<ViewStyle>;
        description: StyleProp<TextStyle>;
        title: StyleProp<TextStyle>;
    }>;
};
export type CardProps = Attachment & Partial<Pick<ChatContextValue, 'ImageComponent'> & Pick<MessageContextValue, 'onLongPress' | 'onPress' | 'onPressIn' | 'myMessageTheme'> & Pick<MessagesContextValue, 'additionalPressableProps' | 'CardCover' | 'CardFooter' | 'CardHeader'>>;
/**
 * UI component for card in attachments.
 */
export declare const Card: {
    (props: CardProps): React.JSX.Element;
    displayName: string;
};
//# sourceMappingURL=Card.d.ts.map