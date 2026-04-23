import React from 'react';
import type { Channel, Event } from 'stream-chat';
type Parameters = {
    setChannels: React.Dispatch<React.SetStateAction<Channel[]>>;
    onChannelUpdated?: (setChannels: React.Dispatch<React.SetStateAction<Channel[]>>, event: Event) => void;
};
export declare const useChannelUpdated: ({ onChannelUpdated, setChannels }: Parameters) => void;
export {};
//# sourceMappingURL=useChannelUpdated.d.ts.map