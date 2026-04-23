import React from 'react';
import { ChannelPreviewProps } from './ChannelPreview';
import type { ChannelPreviewMessengerPropsWithContext } from './ChannelPreviewMessenger';
export type ChannelPreviewStatusProps = Pick<ChannelPreviewMessengerPropsWithContext, 'latestMessagePreview' | 'formatLatestMessageDate'> & Pick<ChannelPreviewProps, 'channel'>;
export declare const ChannelPreviewStatus: (props: ChannelPreviewStatusProps) => React.JSX.Element;
//# sourceMappingURL=ChannelPreviewStatus.d.ts.map