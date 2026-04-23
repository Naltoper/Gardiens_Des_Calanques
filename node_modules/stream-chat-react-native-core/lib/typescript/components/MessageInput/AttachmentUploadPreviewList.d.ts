import React from 'react';
import { MessageInputContextValue } from '../../contexts/messageInputContext/MessageInputContext';
export type AttachmentUploadPreviewListPropsWithContext = Pick<MessageInputContextValue, 'AudioAttachmentUploadPreview' | 'FileAttachmentUploadPreview' | 'ImageAttachmentUploadPreview' | 'VideoAttachmentUploadPreview'>;
export type AttachmentUploadPreviewListProps = Partial<AttachmentUploadPreviewListPropsWithContext>;
/**
 * AttachmentUploadPreviewList
 * UI Component to preview the files set for upload
 */
export declare const AttachmentUploadPreviewList: {
    (props: AttachmentUploadPreviewListProps): React.JSX.Element;
    displayName: string;
};
//# sourceMappingURL=AttachmentUploadPreviewList.d.ts.map