import React from 'react';
import { SharedValue } from 'react-native-reanimated';
import type { UserResponse } from 'stream-chat';
import { ImageGalleryFooterCustomComponentProps } from './components/ImageGalleryFooter';
import { ImageGalleryHeaderCustomComponentProps } from './components/ImageGalleryHeader';
import { ImageGalleryGridImageComponents } from './components/ImageGrid';
import { ImageGalleryGridHandleCustomComponentProps } from './components/ImageGridHandle';
import { OverlayProviderProps } from '../../contexts/overlayContext/OverlayContext';
export declare enum HasPinched {
    FALSE = 0,
    TRUE = 1
}
export declare enum IsSwiping {
    UNDETERMINED = 0,
    TRUE = 1,
    FALSE = 2
}
export type ImageGalleryCustomComponents = {
    /**
     * Override props for following UI components, which are part of [image gallery](https://github.com/GetStream/stream-chat-react-native/wiki/Cookbook-v3.0#gallery-components).
     *
     * - [ImageGalleryFooter](#ImageGalleryFooter)
     *
     * - [ImageGrid](#ImageGrid)
     *
     * - [ImageGridHandle](#ImageGridHandle)
     *
     * - [ImageGalleryHeader](#ImageGalleryHeader)
     *
     * e.g.,
     *
     * ```js
     * {
     *  footer: {
     *    ShareIcon: CustomShareIconComponent
     *  },
     *  grid: {
     *    avatarComponent: CustomAvatarComponent
     *  },
     *  gridHandle: {
     *    centerComponent: CustomCenterComponent
     *  },
     *  header: {
     *    CloseIcon: CustomCloseButtonComponent
     *  },
     * }
     * ```
     * @overrideType object
     */
    imageGalleryCustomComponents?: {
        footer?: ImageGalleryFooterCustomComponentProps;
        grid?: ImageGalleryGridImageComponents;
        gridHandle?: ImageGalleryGridHandleCustomComponentProps;
        header?: ImageGalleryHeaderCustomComponentProps;
    };
};
type Props = ImageGalleryCustomComponents & {
    overlayOpacity: SharedValue<number>;
} & Pick<OverlayProviderProps, 'giphyVersion' | 'imageGalleryGridSnapPoints' | 'imageGalleryGridHandleHeight' | 'numberOfImageGalleryGridColumns' | 'autoPlayVideo'>;
export declare const ImageGallery: {
    (props: Props): React.JSX.Element;
    displayName: string;
};
/**
 * Clamping worklet to clamp the scaling
 */
export declare const clamp: (value: number, lowerBound: number, upperBound: number) => number;
export type Photo = {
    id: string;
    uri: string;
    channelId?: string;
    created_at?: string | Date;
    duration?: number;
    messageId?: string;
    mime_type?: string;
    original_height?: number;
    original_width?: number;
    paused?: boolean;
    progress?: number;
    thumb_url?: string;
    type?: string;
    user?: UserResponse | null;
    user_id?: string;
};
export {};
//# sourceMappingURL=ImageGallery.d.ts.map