import type { ChannelFilters, ChannelSort } from 'stream-chat';
/**
 * Gets the channel ids from database for given filter and sort query.
 *
 * @param {Object} param
 * @param {Object} param.filters Filters for channels https://getstream.io/chat/docs/javascript/query_channels/?language=javascript&q=su#query-parameters
 * @param {Object} param.sort Sort for channels https://getstream.io/chat/docs/javascript/query_channels/?language=javascript&q=su#query-parameters
 *
 * @returns Array of channel ids corresponding to filters & sort. Returns null if filters + sort query doesn't exist in "channelQueries" table.
 */
export declare const selectChannelIdsForFilterSort: ({ filters, sort, }: {
    filters?: ChannelFilters;
    sort?: ChannelSort;
}) => Promise<string[] | null>;
//# sourceMappingURL=selectChannelIdsForFilterSort.d.ts.map