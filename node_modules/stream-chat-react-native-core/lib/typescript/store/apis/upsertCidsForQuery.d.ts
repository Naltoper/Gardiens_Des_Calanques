import type { ChannelFilters, ChannelSort } from 'stream-chat';
export declare const upsertCidsForQuery: ({ cids, filters, execute, sort, }: {
    cids: string[];
    filters?: ChannelFilters;
    execute?: boolean;
    sort?: ChannelSort;
}) => Promise<import("../types").PreparedQueries[]>;
//# sourceMappingURL=upsertCidsForQuery.d.ts.map