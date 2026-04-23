import React from 'react';
import { ImageStyle, ViewStyle } from 'react-native';
import { MessagesContextValue } from '../../contexts/messagesContext/MessagesContext';
import { TranslationContextValue } from '../../contexts/translationContext/TranslationContext';
export type ReplySelectorReturnType = {
    name?: string;
};
type ReplyPropsWithContext = Pick<MessagesContextValue, 'FileAttachmentIcon' | 'MessageAvatar' | 'quotedMessage'> & Pick<TranslationContextValue, 't'> & {
    attachmentSize?: number;
    styles?: Partial<{
        container: ViewStyle;
        fileAttachmentContainer: ViewStyle;
        imageAttachment: ImageStyle;
        messageContainer: ViewStyle;
        textContainer: ViewStyle;
    }>;
};
export type ReplyProps = Partial<ReplyPropsWithContext>;
/**
 * UI Component for reply
 */
export declare const Reply: {
    (props: ReplyProps): React.JSX.Element;
    displayName: string;
};
export {};
//# sourceMappingURL=Reply.d.ts.map