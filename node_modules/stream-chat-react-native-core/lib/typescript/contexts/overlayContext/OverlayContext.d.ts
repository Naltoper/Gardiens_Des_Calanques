import React from 'react';
import type { Attachment } from 'stream-chat';
import type { ImageGalleryCustomComponents } from '../../components/ImageGallery/ImageGallery';
import type { Streami18n } from '../../utils/i18n/Streami18n';
import type { DeepPartial } from '../themeContext/ThemeContext';
import type { Theme } from '../themeContext/utils/theme';
export type Overlay = 'alert' | 'gallery' | 'none';
export type OverlayContextValue = {
    overlay: Overlay;
    setOverlay: React.Dispatch<React.SetStateAction<Overlay>>;
    style?: DeepPartial<Theme>;
};
export declare const OverlayContext: React.Context<OverlayContextValue>;
export type OverlayProviderProps = ImageGalleryCustomComponents & {
    autoPlayVideo?: boolean;
    /**
     * The giphy version to render - check the keys of the [Image Object](https://developers.giphy.com/docs/api/schema#image-object) for possible values. Uses 'fixed_height' by default
     * */
    giphyVersion?: keyof NonNullable<Attachment['giphy']>;
    /** https://github.com/GetStream/stream-chat-react-native/wiki/Internationalization-(i18n) */
    i18nInstance?: Streami18n;
    imageGalleryGridHandleHeight?: number;
    imageGalleryGridSnapPoints?: [string | number, string | number];
    numberOfImageGalleryGridColumns?: number;
    value?: Partial<OverlayContextValue>;
};
export declare const useOverlayContext: () => OverlayContextValue;
//# sourceMappingURL=OverlayContext.d.ts.map