import React from 'react';
import type { ChannelPreviewProps } from './ChannelPreview';
import { ChatContextValue } from '../../contexts/chatContext/ChatContext';
export type ChannelAvatarProps = Pick<ChannelPreviewProps, 'channel'> & {
    /**
     * The size of the avatar.
     */
    size?: number;
};
/**
 * This UI component displays an avatar for a particular channel.
 */
export declare const ChannelAvatarWithContext: (props: ChannelAvatarProps & Pick<ChatContextValue, "ImageComponent">) => React.JSX.Element;
export declare const ChannelAvatar: (props: ChannelAvatarProps) => React.JSX.Element;
//# sourceMappingURL=ChannelAvatar.d.ts.map