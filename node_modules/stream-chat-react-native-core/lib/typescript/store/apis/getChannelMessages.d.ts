import type { MessageResponse } from 'stream-chat';
export declare const getChannelMessages: ({ channelIds, currentUserId, }: {
    channelIds: string[];
    currentUserId: string;
}) => Promise<Record<string, MessageResponse[]>>;
//# sourceMappingURL=getChannelMessages.d.ts.map