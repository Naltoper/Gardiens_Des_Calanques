import React from 'react';
import { ChatContextValue } from '../../../contexts/chatContext/ChatContext';
import type { MessageContextValue } from '../../../contexts/messageContext/MessageContext';
export type MessageRepliesAvatarsProps = Pick<MessageContextValue, 'alignment' | 'message'>;
export declare const MessageRepliesAvatarsWithContext: (props: MessageRepliesAvatarsProps & Pick<ChatContextValue, "ImageComponent">) => React.JSX.Element;
export declare const MessageRepliesAvatars: (props: MessageRepliesAvatarsProps) => React.JSX.Element;
//# sourceMappingURL=MessageRepliesAvatars.d.ts.map