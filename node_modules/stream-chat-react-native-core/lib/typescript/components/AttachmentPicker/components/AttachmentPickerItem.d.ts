import React from 'react';
import type { File } from '../../../types/types';
type AttachmentPickerItemType = {
    asset: File;
    ImageOverlaySelectedComponent: React.ComponentType;
    numberOfAttachmentPickerImageColumns?: number;
};
export declare const renderAttachmentPickerItem: ({ item }: {
    item: AttachmentPickerItemType;
}) => React.JSX.Element;
export {};
//# sourceMappingURL=AttachmentPickerItem.d.ts.map