import React from 'react';
import { SharedValue } from 'react-native-reanimated';
import { VideoType } from '../../../native';
import type { Photo } from '../ImageGallery';
export type ImageGalleryFooterCustomComponent = ({ openGridView, photo, share, shareMenuOpen, }: {
    openGridView: () => void;
    share: () => Promise<void>;
    shareMenuOpen: boolean;
    photo?: Photo;
}) => React.ReactElement | null;
export type ImageGalleryFooterVideoControlProps = {
    duration: number;
    onPlayPause: (status?: boolean) => void;
    paused: boolean;
    progress: number;
    videoRef: React.RefObject<VideoType>;
};
export type ImageGalleryFooterVideoControlComponent = ({ duration, onPlayPause, paused, progress, }: ImageGalleryFooterVideoControlProps) => React.ReactElement | null;
export type ImageGalleryFooterCustomComponentProps = {
    centerElement?: ImageGalleryFooterCustomComponent;
    GridIcon?: React.ReactElement;
    leftElement?: ImageGalleryFooterCustomComponent;
    rightElement?: ImageGalleryFooterCustomComponent;
    ShareIcon?: React.ReactElement;
    videoControlElement?: ImageGalleryFooterVideoControlComponent;
};
type ImageGalleryFooterPropsWithContext = ImageGalleryFooterCustomComponentProps & {
    accessibilityLabel: string;
    duration: number;
    onPlayPause: () => void;
    opacity: SharedValue<number>;
    openGridView: () => void;
    paused: boolean;
    photo: Photo;
    photoLength: number;
    progress: number;
    selectedIndex: number;
    videoRef: React.RefObject<VideoType>;
    visible: SharedValue<number>;
};
export declare const ImageGalleryFooterWithContext: (props: ImageGalleryFooterPropsWithContext) => React.JSX.Element;
export type ImageGalleryFooterProps = ImageGalleryFooterPropsWithContext;
export declare const ImageGalleryFooter: {
    (props: ImageGalleryFooterProps): React.JSX.Element;
    displayName: string;
};
export {};
//# sourceMappingURL=ImageGalleryFooter.d.ts.map