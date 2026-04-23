import type { Attachment } from 'stream-chat';
import type { GallerySizeAndThumbnailGrid, GallerySizeConfig } from './types';
import { ChatConfigContextValue } from '../../../../contexts/chatConfigContext/ChatConfigContext';
export declare function buildGalleryOfThreeImages({ images, resizableCDNHosts, sizeConfig, }: Pick<ChatConfigContextValue, 'resizableCDNHosts'> & {
    images: Attachment[];
    sizeConfig: GallerySizeConfig;
}): GallerySizeAndThumbnailGrid;
//# sourceMappingURL=buildGalleryOfThreeImages.d.ts.map