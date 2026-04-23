import { MessageContextValue } from '../../../contexts/messageContext/MessageContext';
export type UseMessageDataProps = Partial<Pick<MessageContextValue, 'channel' | 'groupStyles' | 'isMyMessage' | 'message'>>;
export declare const useMessageData: ({ channel: propChannel, groupStyles: propGroupStyles, isMyMessage: propIsMyMessage, message: propMessage, }: UseMessageDataProps) => {
    hasThreadReplies: boolean;
    isMessageErrorType: boolean;
    isMessageReceivedOrErrorType: boolean;
    isMessageTypeDeleted: boolean;
    isVeryLastMessage: boolean;
    messageGroupedSingleOrBottom: boolean;
};
//# sourceMappingURL=useMessageData.d.ts.map