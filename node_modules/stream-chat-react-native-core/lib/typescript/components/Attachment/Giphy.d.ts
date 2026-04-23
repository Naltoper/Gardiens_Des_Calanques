import React from 'react';
import type { Attachment } from 'stream-chat';
import { ChatContextValue } from '../../contexts/chatContext/ChatContext';
import { ImageGalleryContextValue } from '../../contexts/imageGalleryContext/ImageGalleryContext';
import { MessageContextValue } from '../../contexts/messageContext/MessageContext';
import { MessagesContextValue } from '../../contexts/messagesContext/MessagesContext';
import { OverlayContextValue } from '../../contexts/overlayContext/OverlayContext';
export type GiphyPropsWithContext = Pick<ImageGalleryContextValue, 'setSelectedMessage' | 'setMessages'> & Pick<MessageContextValue, 'handleAction' | 'isMyMessage' | 'message' | 'onLongPress' | 'onPress' | 'onPressIn' | 'preventPress'> & Pick<ChatContextValue, 'ImageComponent'> & Pick<MessagesContextValue, 'giphyVersion' | 'additionalPressableProps' | 'ImageLoadingIndicator' | 'ImageLoadingFailedIndicator'> & {
    attachment: Attachment;
} & Pick<OverlayContextValue, 'setOverlay'>;
export type GiphyProps = Partial<GiphyPropsWithContext> & {
    attachment: Attachment;
};
/**
 * UI component for card in attachments.
 */
export declare const Giphy: {
    (props: GiphyProps): React.JSX.Element;
    displayName: string;
};
//# sourceMappingURL=Giphy.d.ts.map