import React from 'react';
import { ColorValue } from 'react-native';
import { MessageContextValue } from '../../../contexts/messageContext/MessageContext';
import { MessagesContextValue } from '../../../contexts/messagesContext/MessagesContext';
import { TranslationContextValue } from '../../../contexts/translationContext/TranslationContext';
export type MessageRepliesPropsWithContext = Pick<MessageContextValue, 'alignment' | 'message' | 'onLongPress' | 'onPress' | 'onPressIn' | 'onOpenThread' | 'preventPress' | 'threadList'> & Pick<MessagesContextValue, 'MessageRepliesAvatars'> & Pick<TranslationContextValue, 't'> & {
    noBorder?: boolean;
    repliesCurveColor?: ColorValue;
};
export type MessageRepliesProps = Partial<MessageRepliesPropsWithContext>;
export declare const MessageReplies: {
    (props: MessageRepliesProps): React.JSX.Element;
    displayName: string;
};
//# sourceMappingURL=MessageReplies.d.ts.map