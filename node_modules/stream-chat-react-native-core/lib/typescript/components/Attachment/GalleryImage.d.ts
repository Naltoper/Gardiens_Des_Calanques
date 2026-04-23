import React from 'react';
import { ImageProps } from 'react-native';
import { ChatContextValue } from '../../contexts/chatContext/ChatContext';
export type GalleryImageWithContextProps = GalleryImageProps & Pick<ChatContextValue, 'ImageComponent'>;
export declare const GalleryImageWithContext: (props: GalleryImageWithContextProps) => React.JSX.Element;
export declare const MemoizedGalleryImage: React.MemoExoticComponent<(props: GalleryImageWithContextProps) => React.JSX.Element>;
export type GalleryImageProps = Omit<ImageProps, 'height' | 'source'> & {
    uri: string;
};
export declare const GalleryImage: (props: GalleryImageProps) => React.JSX.Element;
//# sourceMappingURL=GalleryImage.d.ts.map