import { Channel, ChannelSortBase } from 'stream-chat';
import { ChannelListProps } from '../../ChannelList';
export declare const isChannelPinned: (channel: Channel) => boolean;
export declare const isChannelArchived: (channel: Channel) => boolean;
export declare const shouldConsiderArchivedChannels: (filters: ChannelListProps["filters"]) => boolean;
export declare const extractSortValue: ({ atIndex, sort, targetKey, }: {
    atIndex: number;
    targetKey: keyof ChannelSortBase;
    sort?: ChannelListProps["sort"];
}) => import("stream-chat").AscDesc | null;
/**
 * Returns true only if `{ pinned_at: -1 }` or `{ pinned_at: 1 }` option is first within the `sort` array.
 */
export declare const shouldConsiderPinnedChannels: (sort: ChannelListProps["sort"]) => boolean;
export declare function findPinnedAtSortOrder({ sort }: {
    sort: ChannelListProps['sort'];
}): import("stream-chat").AscDesc | null;
export declare function findLastPinnedChannelIndex({ channels }: {
    channels: Channel[];
}): number | null;
//# sourceMappingURL=index.d.ts.map