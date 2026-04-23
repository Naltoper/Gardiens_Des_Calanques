import type { Attachment } from 'stream-chat';
import type { GallerySizeAndThumbnailGrid, GallerySizeConfig } from './types';
import { ChatConfigContextValue } from '../../../../contexts/chatConfigContext/ChatConfigContext';
export declare function buildGalleryOfSingleImage({ image, resizableCDNHosts, sizeConfig, }: Pick<ChatConfigContextValue, 'resizableCDNHosts'> & {
    image: Attachment;
    sizeConfig: GallerySizeConfig;
}): GallerySizeAndThumbnailGrid;
//# sourceMappingURL=buildGalleryOfSingleImage.d.ts.map