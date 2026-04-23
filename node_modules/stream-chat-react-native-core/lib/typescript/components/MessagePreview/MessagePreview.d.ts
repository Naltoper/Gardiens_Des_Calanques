import React from 'react';
export type MessagePreviewSkeletonProps = {
    /**
     * Whether the message text should be bold.
     */
    bold: boolean;
    /**
     * The text of the message preview.
     */
    text: string;
    /**
     * Whether the message is a draft.
     */
    draft?: boolean;
};
export type MessagePreviewProps = {
    previews: MessagePreviewSkeletonProps[];
};
export declare const MessagePreview: ({ previews }: MessagePreviewProps) => React.JSX.Element;
//# sourceMappingURL=MessagePreview.d.ts.map