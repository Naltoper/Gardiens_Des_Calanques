import type { ChannelAPIResponse } from 'stream-chat';
import type { TableRow } from '../types';
export declare const mapStorableToChannel: (channelRow: TableRow<"channels">) => Omit<ChannelAPIResponse, "duration" | "messages" | "members" | "pinned_messages">;
//# sourceMappingURL=mapStorableToChannel.d.ts.map