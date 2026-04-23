import React, { PropsWithChildren } from 'react';
import type { Channel, ChannelState, LocalMessage, StreamChat } from 'stream-chat';
export type DebugDataType = StreamChat['user'] | {
    data: Channel['data'];
    members: ChannelState['members'];
}[] | LocalMessage[];
export type DebugContextValue = {
    eventType?: string;
    sendEventParams?: {
        action: string;
        data: DebugDataType;
    };
    setEventType?: (data: string) => void;
    setSendEventParams?: (data: {
        action: string;
        data: DebugDataType;
    }) => void;
};
export declare const DebugContext: React.Context<React.MutableRefObject<DebugContextValue>>;
export declare const DebugContextProvider: ({ children, useFlipper, }: PropsWithChildren<{
    useFlipper: () => {
        updateData: (ref: React.RefObject<DebugContextValue>) => void;
    };
}>) => React.JSX.Element;
export declare const useDebugContext: () => React.MutableRefObject<DebugContextValue>;
//# sourceMappingURL=DebugContext.d.ts.map