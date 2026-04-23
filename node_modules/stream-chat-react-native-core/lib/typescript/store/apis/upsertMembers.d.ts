import type { ChannelMemberResponse } from 'stream-chat';
import type { PreparedQueries } from '../types';
export declare const upsertMembers: ({ cid, execute, members, }: {
    cid: string;
    members: ChannelMemberResponse[];
    execute?: boolean;
}) => Promise<PreparedQueries[]>;
//# sourceMappingURL=upsertMembers.d.ts.map