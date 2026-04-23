import React from 'react';
import { MessageContextValue } from '../../../contexts/messageContext/MessageContext';
import { MessagesContextValue } from '../../../contexts/messagesContext/MessagesContext';
export type MessageEditedTimestampProps = Partial<Pick<MessageContextValue, 'message'>> & Partial<Pick<MessagesContextValue, 'MessageTimestamp'>>;
export declare const MessageEditedTimestamp: (props: MessageEditedTimestampProps) => React.JSX.Element | null;
//# sourceMappingURL=MessageEditedTimestamp.d.ts.map