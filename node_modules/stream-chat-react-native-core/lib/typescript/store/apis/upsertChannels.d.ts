import type { ChannelAPIResponse } from 'stream-chat';
import type { PreparedQueries } from '../types';
export declare const upsertChannels: ({ channels, execute, isLatestMessagesSet, }: {
    channels: ChannelAPIResponse[];
    execute?: boolean;
    isLatestMessagesSet?: boolean;
}) => Promise<PreparedQueries[]>;
//# sourceMappingURL=upsertChannels.d.ts.map