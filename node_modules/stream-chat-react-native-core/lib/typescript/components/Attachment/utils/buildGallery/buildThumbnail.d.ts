import type { ImageResizeMode } from 'react-native';
import type { Attachment } from 'stream-chat';
import type { Thumbnail } from './types';
import { ChatConfigContextValue } from '../../../../contexts/chatConfigContext/ChatConfigContext';
export type BuildThumbnailProps = Pick<ChatConfigContextValue, 'resizableCDNHosts'> & {
    height: number;
    image: Attachment;
    width: number;
    resizeMode?: ImageResizeMode;
};
export declare function buildThumbnail({ height, image, resizableCDNHosts, resizeMode, width, }: BuildThumbnailProps): Thumbnail;
//# sourceMappingURL=buildThumbnail.d.ts.map