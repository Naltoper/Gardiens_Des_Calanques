import React from 'react';
import { ChannelPreviewProps } from './ChannelPreview';
import type { ChannelsContextValue } from '../../contexts/channelsContext/ChannelsContext';
export type ChannelPreviewUnreadCountProps = Pick<ChannelsContextValue, 'maxUnreadCount'> & Pick<ChannelPreviewProps, 'channel'> & {
    /**
     * Number of unread messages on the channel
     */
    unread?: number;
};
export declare const ChannelPreviewUnreadCount: (props: ChannelPreviewUnreadCountProps) => React.JSX.Element | null;
//# sourceMappingURL=ChannelPreviewUnreadCount.d.ts.map