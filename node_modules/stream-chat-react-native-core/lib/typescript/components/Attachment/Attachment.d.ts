import React from 'react';
import type { Attachment as AttachmentType } from 'stream-chat';
import { MessagesContextValue } from '../../contexts/messagesContext/MessagesContext';
export type ActionHandler = (name: string, value: string) => void;
export type AttachmentPropsWithContext = Pick<MessagesContextValue, 'AttachmentActions' | 'Card' | 'FileAttachment' | 'Gallery' | 'giphyVersion' | 'Giphy' | 'isAttachmentEqual' | 'UrlPreview' | 'myMessageTheme'> & {
    /**
     * The attachment to render
     */
    attachment: AttachmentType;
};
export type AttachmentProps = Partial<Pick<MessagesContextValue, 'AttachmentActions' | 'Card' | 'FileAttachment' | 'Gallery' | 'Giphy' | 'giphyVersion' | 'myMessageTheme' | 'UrlPreview' | 'isAttachmentEqual'>> & Pick<AttachmentPropsWithContext, 'attachment'>;
/**
 * Attachment - The message attachment
 */
export declare const Attachment: (props: AttachmentProps) => React.JSX.Element | null;
//# sourceMappingURL=Attachment.d.ts.map