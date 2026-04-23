import type { Attachment } from 'stream-chat';
import type { GallerySizeAndThumbnailGrid, GallerySizeConfig } from './types';
import { ChatConfigContextValue } from '../../../../contexts/chatConfigContext/ChatConfigContext';
/**
 * Builds and returns a gallery of optimized images to be rendered on UI.
 * This function take a object parameter with following properties:
 *
 * @param {Attachment[]} images - Array of image attachments
 * @param {GallerySizeConfig} sizeConfig - Theme config for the gallery
 *
 * The returned object contains following properties:
 *
 * - height {number[]} - Height of the gallery
 * - width {number[]} - Width of the gallery
 * - thumbnailGrid {number[][]} - Grid of thumbnail images
 * - invertedDirections {boolean} - Whether to invert the direction of the grid. By default grid is rendered with column as primary direction and row as secondary direction.
 *
 * @return {GallerySizeAndThumbnailGrid}
 */
export declare function buildGallery({ images, resizableCDNHosts, sizeConfig, }: Pick<ChatConfigContextValue, 'resizableCDNHosts'> & {
    images: Attachment[];
    sizeConfig: GallerySizeConfig;
}): GallerySizeAndThumbnailGrid;
//# sourceMappingURL=buildGallery.d.ts.map