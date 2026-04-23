import React from 'react';
import { ChatContextValue } from '../../../contexts/chatContext/ChatContext';
import { MessageContextValue } from '../../../contexts/messageContext/MessageContext';
import { AvatarProps } from '../../Avatar/Avatar';
export type MessageAvatarPropsWithContext = Pick<MessageContextValue, 'alignment' | 'lastGroupMessage' | 'message' | 'showAvatar'> & Pick<ChatContextValue, 'ImageComponent'> & Partial<Pick<AvatarProps, 'size'>>;
export type MessageAvatarProps = Partial<MessageAvatarPropsWithContext>;
export declare const MessageAvatar: {
    (props: MessageAvatarProps): React.JSX.Element;
    displayName: string;
};
//# sourceMappingURL=MessageAvatar.d.ts.map