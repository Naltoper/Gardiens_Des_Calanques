import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { RenderTextParams } from './utils/renderText';
import { MessageContextValue } from '../../../contexts/messageContext/MessageContext';
import { MessagesContextValue } from '../../../contexts/messagesContext/MessagesContext';
import type { MarkdownStyle, Theme } from '../../../contexts/themeContext/utils/theme';
export type MessageTextProps = MessageTextContainerProps & {
    renderText: (params: RenderTextParams) => React.ReactNode | null;
    theme: {
        theme: Theme;
    };
};
export type MessageTextContainerPropsWithContext = Pick<MessageContextValue, 'message' | 'onLongPress' | 'onlyEmojis' | 'onPress' | 'preventPress'> & Pick<MessagesContextValue, 'markdownRules' | 'MessageText' | 'myMessageTheme' | 'messageTextNumberOfLines'> & {
    markdownStyles?: MarkdownStyle;
    messageOverlay?: boolean;
    styles?: Partial<{
        textContainer: StyleProp<ViewStyle>;
    }>;
};
export type MessageTextContainerProps = Partial<MessageTextContainerPropsWithContext>;
export declare const MessageTextContainer: {
    (props: MessageTextContainerProps): React.JSX.Element;
    displayName: string;
};
//# sourceMappingURL=MessageTextContainer.d.ts.map