import type { Channel as ChannelType } from 'stream-chat';
import type { ChannelsStateContextValue, ChannelState, Keys } from './ChannelsStateContext';
type StateManagerParams<Key extends Keys> = ChannelsStateContextValue & {
    cid: string;
    key: Key;
};
export declare function useStateManager<Key extends Keys>({ cid, key, setState, state }: StateManagerParams<Key>, initialValue?: ChannelState[Key]): readonly [ChannelState[Key], (value: ChannelState[Key]) => void];
export type UseChannelStateValue = {
    setThreadMessages: (value: ChannelState['threadMessages']) => void;
    threadMessages: ChannelState['threadMessages'];
};
export declare function useChannelState(channel: ChannelType | undefined, threadId?: string): UseChannelStateValue;
export {};
//# sourceMappingURL=useChannelState.d.ts.map