import type { Channel } from 'stream-chat';
export declare const getChannelPreviewDisplayName: ({ channelName, characterLimit, currentUserId, members, }: {
    characterLimit: number;
    channelName?: string;
    currentUserId?: string;
    members?: Channel["state"]["members"];
}) => string;
export declare const useChannelPreviewDisplayName: (channel?: Channel, characterLength?: number) => string;
//# sourceMappingURL=useChannelPreviewDisplayName.d.ts.map