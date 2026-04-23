import React from 'react';
import { LayoutChangeEvent } from 'react-native';
import { MessageContextValue } from '../../../contexts/messageContext/MessageContext';
import { MessagesContextValue } from '../../../contexts/messagesContext/MessagesContext';
type MessageDeletedComponentProps = {
    groupStyle: string;
    noBorder: boolean;
    onLayout: (event: LayoutChangeEvent) => void;
    date?: string | Date;
};
type MessageDeletedPropsWithContext = Pick<MessageContextValue, 'alignment' | 'message'> & Pick<MessagesContextValue, 'MessageFooter'> & MessageDeletedComponentProps;
export type MessageDeletedProps = Partial<MessageDeletedPropsWithContext> & {
    groupStyle: string;
    noBorder: boolean;
    onLayout: (event: LayoutChangeEvent) => void;
};
export declare const MessageDeleted: {
    (props: MessageDeletedProps): React.JSX.Element;
    displayName: string;
};
export {};
//# sourceMappingURL=MessageDeleted.d.ts.map