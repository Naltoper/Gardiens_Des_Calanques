import React from 'react';
import { LocalAudioAttachment, LocalFileAttachment, LocalVideoAttachment } from 'stream-chat';
import { UploadAttachmentPreviewProps } from '../../../../types/types';
export type FileAttachmentUploadPreviewProps<CustomLocalMetadata = Record<string, unknown>> = UploadAttachmentPreviewProps<LocalFileAttachment<CustomLocalMetadata> | LocalVideoAttachment<CustomLocalMetadata> | LocalAudioAttachment<CustomLocalMetadata>> & {
    flatListWidth: number;
};
export declare const FileAttachmentUploadPreview: ({ attachment, flatListWidth, handleRetry, removeAttachments, }: FileAttachmentUploadPreviewProps) => React.JSX.Element;
//# sourceMappingURL=FileAttachmentUploadPreview.d.ts.map