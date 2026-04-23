import type { ChannelAPIResponse } from 'stream-chat';
/**
 * Returns the list of channels with state enriched for given channel ids.
 *
 * @param {Object} param
 * @param {Array} param.channelIds List of channel ids to fetch.
 * @param {Array} param.currentUserId Id of the current logged in user.
 *
 * @returns {Array} Channels with enriched state.
 */
export declare const getChannels: ({ channelIds, currentUserId, }: {
    channelIds: string[];
    currentUserId: string;
}) => Promise<Omit<ChannelAPIResponse, "duration">[]>;
//# sourceMappingURL=getChannels.d.ts.map