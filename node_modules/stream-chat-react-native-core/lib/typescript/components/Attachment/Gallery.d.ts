import React from 'react';
import type { LocalMessage } from 'stream-chat';
import { ImageGalleryContextValue } from '../../contexts/imageGalleryContext/ImageGalleryContext';
import { MessageContextValue } from '../../contexts/messageContext/MessageContext';
import { MessagesContextValue } from '../../contexts/messagesContext/MessagesContext';
import { OverlayContextValue } from '../../contexts/overlayContext/OverlayContext';
export type GalleryPropsWithContext = Pick<ImageGalleryContextValue, 'setSelectedMessage' | 'setMessages'> & Pick<MessageContextValue, 'alignment' | 'groupStyles' | 'images' | 'videos' | 'onLongPress' | 'onPress' | 'onPressIn' | 'preventPress' | 'threadList'> & Pick<MessagesContextValue, 'additionalPressableProps' | 'legacyImageViewerSwipeBehaviour' | 'VideoThumbnail' | 'ImageLoadingIndicator' | 'ImageLoadingFailedIndicator' | 'ImageReloadIndicator' | 'myMessageTheme'> & Pick<OverlayContextValue, 'setOverlay'> & {
    channelId: string | undefined;
    hasThreadReplies?: boolean;
    /**
     * `message` prop has been introduced here as part of `legacyImageViewerSwipeBehaviour` prop.
     * https://github.com/GetStream/stream-chat-react-native/commit/d5eac6193047916f140efe8e396a671675c9a63f
     * messageId and messageText may seem redundant now, but to avoid breaking change as part
     * of minor release, we are keeping those props.
     *
     * Also `message` type should ideally be imported from MessageContextValue and not be explicitely mentioned
     * here, but due to some circular dependencies within the SDK, it causes "excessive deep nesting" issue with
     * typescript within Channel component. We should take it as a mini-project and resolve all these circular imports.
     *
     * TODO: Fix circular dependencies of imports
     */
    message?: LocalMessage;
};
export type GalleryProps = Partial<GalleryPropsWithContext>;
/**
 * UI component for card in attachments.
 */
export declare const Gallery: {
    (props: GalleryProps): React.JSX.Element | null;
    displayName: string;
};
//# sourceMappingURL=Gallery.d.ts.map