import React from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import type { Attachment } from 'stream-chat';
import { MessageContextValue } from '../../contexts/messageContext/MessageContext';
import { MessagesContextValue } from '../../contexts/messagesContext/MessagesContext';
export type FileAttachmentPropsWithContext = Pick<MessageContextValue, 'onLongPress' | 'onPress' | 'onPressIn' | 'preventPress'> & Pick<MessagesContextValue, 'additionalPressableProps' | 'AttachmentActions' | 'FileAttachmentIcon'> & {
    /** The attachment to render */
    attachment: Attachment;
    attachmentSize?: number;
    styles?: Partial<{
        container: StyleProp<ViewStyle>;
        details: StyleProp<ViewStyle>;
        size: StyleProp<TextStyle>;
        title: StyleProp<TextStyle>;
    }>;
};
export type FileAttachmentProps = Partial<Omit<FileAttachmentPropsWithContext, 'attachment'>> & Pick<FileAttachmentPropsWithContext, 'attachment'>;
export declare const FileAttachment: {
    (props: FileAttachmentProps): React.JSX.Element;
    displayName: string;
};
export declare const getFileSizeDisplayText: (size?: number | string) => string | undefined;
//# sourceMappingURL=FileAttachment.d.ts.map