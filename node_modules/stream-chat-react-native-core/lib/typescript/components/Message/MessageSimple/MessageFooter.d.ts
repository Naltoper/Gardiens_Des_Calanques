import React from 'react';
import type { Attachment, LocalMessage } from 'stream-chat';
import type { MessageStatusProps } from './MessageStatus';
import type { ChannelContextValue } from '../../../contexts/channelContext/ChannelContext';
import { Alignment } from '../../../contexts/messageContext/MessageContext';
type MessageFooterComponentProps = {
    date?: string | Date;
    formattedDate?: string | Date;
    isDeleted?: boolean;
};
export type MessageFooterProps = Partial<Pick<ChannelContextValue, 'members'>> & MessageFooterComponentProps & {
    alignment?: Alignment;
    lastGroupMessage?: boolean;
    message?: LocalMessage;
    MessageStatus?: React.ComponentType<MessageStatusProps>;
    otherAttachments?: Attachment[];
    showMessageStatus?: boolean;
};
export declare const MessageFooter: (props: MessageFooterProps) => React.JSX.Element;
export {};
//# sourceMappingURL=MessageFooter.d.ts.map