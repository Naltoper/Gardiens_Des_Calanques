import React from 'react';
import { SharedValue } from 'react-native-reanimated';
import type { Photo } from '../ImageGallery';
export type ImageGalleryHeaderCustomComponent = ({ hideOverlay, photo, }: {
    hideOverlay: () => void;
    photo?: Photo;
}) => React.ReactElement | null;
export type ImageGalleryHeaderCustomComponentProps = {
    centerElement?: ImageGalleryHeaderCustomComponent;
    CloseIcon?: React.ReactElement;
    leftElement?: ImageGalleryHeaderCustomComponent;
    rightElement?: ImageGalleryHeaderCustomComponent;
};
type Props = ImageGalleryHeaderCustomComponentProps & {
    opacity: SharedValue<number>;
    visible: SharedValue<number>;
    photo?: Photo;
};
export declare const ImageGalleryHeader: {
    (props: Props): React.JSX.Element;
    displayName: string;
};
export {};
//# sourceMappingURL=ImageGalleryHeader.d.ts.map