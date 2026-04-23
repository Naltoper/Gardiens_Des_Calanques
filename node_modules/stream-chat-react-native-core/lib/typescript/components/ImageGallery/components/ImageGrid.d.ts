import React from 'react';
import type { Photo } from '../ImageGallery';
export type ImageGalleryGridImageComponent = ({ item, }: {
    item: Photo & {
        selectAndClose: () => void;
        numberOfImageGalleryGridColumns?: number;
    };
}) => React.ReactElement | null;
export type ImageGalleryGridImageComponents = {
    avatarComponent?: ImageGalleryGridImageComponent;
    imageComponent?: ImageGalleryGridImageComponent;
};
export type GridImageItem = Photo & ImageGalleryGridImageComponents & {
    selectAndClose: () => void;
    numberOfImageGalleryGridColumns?: number;
};
export type ImageGridType = ImageGalleryGridImageComponents & {
    closeGridView: () => void;
    photos: Photo[];
    setSelectedMessage: React.Dispatch<React.SetStateAction<{
        messageId?: string | undefined;
        url?: string | undefined;
    } | undefined>>;
    numberOfImageGalleryGridColumns?: number;
};
export declare const ImageGrid: {
    (props: ImageGridType): React.JSX.Element;
    displayName: string;
};
//# sourceMappingURL=ImageGrid.d.ts.map