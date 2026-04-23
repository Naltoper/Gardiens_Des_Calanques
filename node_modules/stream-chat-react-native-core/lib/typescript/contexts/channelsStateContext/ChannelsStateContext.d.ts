import React, { ReactNode } from 'react';
import type { ThreadContextValue } from '../threadContext/ThreadContext';
export type ChannelState = {
    threadMessages: ThreadContextValue['threadMessages'];
};
type ChannelsState = {
    [cid: string]: ChannelState;
};
export type Keys = keyof ChannelState;
export type Payload<Key extends Keys = Keys> = {
    cid: string;
    key: Key;
    value: ChannelState[Key];
};
export type ChannelsStateContextValue = {
    setState: (value: Payload) => void;
    state: ChannelsState;
};
export declare const ChannelsStateProvider: ({ children }: {
    children: ReactNode;
}) => React.JSX.Element;
export declare const useChannelsStateContext: () => ChannelsStateContextValue;
export {};
//# sourceMappingURL=ChannelsStateContext.d.ts.map