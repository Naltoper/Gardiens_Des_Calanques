import React, { PropsWithChildren } from 'react';
import { LocalMessage } from 'stream-chat';
import type { UnknownType } from '../../types/types';
type SelectedMessage = {
    messageId?: string;
    url?: string;
};
export type ImageGalleryContextValue = {
    messages: LocalMessage[];
    setMessages: React.Dispatch<React.SetStateAction<LocalMessage[]>>;
    setSelectedMessage: React.Dispatch<React.SetStateAction<SelectedMessage | undefined>>;
    selectedMessage?: SelectedMessage;
};
export declare const ImageGalleryContext: React.Context<ImageGalleryContextValue>;
export declare const ImageGalleryProvider: ({ children }: PropsWithChildren<UnknownType>) => React.JSX.Element;
export declare const useImageGalleryContext: () => ImageGalleryContextValue;
export {};
//# sourceMappingURL=ImageGalleryContext.d.ts.map