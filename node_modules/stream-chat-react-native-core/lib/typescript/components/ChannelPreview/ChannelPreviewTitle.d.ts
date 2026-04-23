import React from 'react';
import type { ChannelPreviewProps } from './ChannelPreview';
export type ChannelPreviewTitleProps = Pick<ChannelPreviewProps, 'channel'> & {
    /**
     * Formatted name for the previewed channel.
     */
    displayName: string;
};
export declare const ChannelPreviewTitle: (props: ChannelPreviewTitleProps) => React.JSX.Element;
//# sourceMappingURL=ChannelPreviewTitle.d.ts.map