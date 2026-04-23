import type { Attachment } from 'stream-chat';
import type { GallerySizeAndThumbnailGrid, GallerySizeConfig } from './types';
import { ChatConfigContextValue } from '../../../../contexts/chatConfigContext/ChatConfigContext';
export declare function buildGalleryOfTwoImages({ images, resizableCDNHosts, sizeConfig, }: Pick<ChatConfigContextValue, 'resizableCDNHosts'> & {
    images: Attachment[];
    sizeConfig: GallerySizeConfig;
}): GallerySizeAndThumbnailGrid;
//# sourceMappingURL=buildGalleryOfTwoImages.d.ts.map