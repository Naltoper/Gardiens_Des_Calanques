import React from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import type { Attachment } from 'stream-chat';
import { MessageContextValue } from '../../contexts/messageContext/MessageContext';
export type AttachmentActionsPropsWithContext = Pick<Attachment, 'actions'> & Pick<MessageContextValue, 'handleAction'> & {
    styles?: Partial<{
        actionButton: StyleProp<ViewStyle>;
        buttonText: StyleProp<TextStyle>;
        container: StyleProp<ViewStyle>;
    }>;
};
export type AttachmentActionsProps = Attachment & Partial<Pick<MessageContextValue, 'handleAction'>>;
/**
 * AttachmentActions - The actions you can take on an attachment.
 * Actions in combination with attachments can be used to build [commands](https://getstream.io/chat/docs/#channel_commands).
 */
export declare const AttachmentActions: {
    (props: AttachmentActionsProps): React.JSX.Element;
    displayName: string;
};
//# sourceMappingURL=AttachmentActions.d.ts.map