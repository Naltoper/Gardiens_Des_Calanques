import React from 'react';
import { ChannelsContextValue } from '../../contexts/channelsContext/ChannelsContext';
export type ChannelListMessengerPropsWithContext = Omit<ChannelsContextValue, 'HeaderErrorIndicator' | 'HeaderNetworkDownIndicator' | 'maxUnreadCount' | 'numberOfSkeletons' | 'onSelect' | 'Preview' | 'PreviewTitle' | 'PreviewStatus' | 'PreviewAvatar' | 'previewMessage' | 'Skeleton'>;
export type ChannelListMessengerProps = Partial<ChannelListMessengerPropsWithContext>;
/**
 * This UI component displays the preview list of channels and handles Channel navigation. It
 * receives all props from the ChannelList component.
 *
 * @example ./ChannelListMessenger.md
 */
export declare const ChannelListMessenger: {
    (props: ChannelListMessengerProps): React.JSX.Element;
    displayName: string;
};
//# sourceMappingURL=ChannelListMessenger.d.ts.map