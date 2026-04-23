import React from 'react';
import type { Channel } from 'stream-chat';
import { ChannelsContextValue } from '../../contexts/channelsContext/ChannelsContext';
import { ChatContextValue } from '../../contexts/chatContext/ChatContext';
export type ChannelPreviewProps = Partial<Pick<ChatContextValue, 'client'>> & Partial<Pick<ChannelsContextValue, 'Preview' | 'forceUpdate'>> & {
    /**
     * Instance of Channel from stream-chat package.
     */
    channel: Channel;
};
export declare const ChannelPreview: (props: ChannelPreviewProps) => React.JSX.Element;
//# sourceMappingURL=ChannelPreview.d.ts.map