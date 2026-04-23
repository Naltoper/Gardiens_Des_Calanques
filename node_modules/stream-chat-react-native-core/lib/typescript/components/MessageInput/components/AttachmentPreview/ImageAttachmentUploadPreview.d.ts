import React from 'react';
import { LocalImageAttachment } from 'stream-chat';
import { UploadAttachmentPreviewProps } from '../../../../types/types';
export type ImageAttachmentUploadPreviewProps<CustomLocalMetadata = Record<string, unknown>> = UploadAttachmentPreviewProps<LocalImageAttachment<CustomLocalMetadata>>;
export declare const ImageAttachmentUploadPreview: ({ attachment, handleRetry, removeAttachments, }: ImageAttachmentUploadPreviewProps) => React.JSX.Element;
//# sourceMappingURL=ImageAttachmentUploadPreview.d.ts.map