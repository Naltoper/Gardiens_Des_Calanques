import type { ChannelMemberResponse } from 'stream-chat';
import type { TableRow } from '../types';
export declare const mapMemberToStorable: ({ cid, member, }: {
    cid: string;
    member: ChannelMemberResponse;
}) => TableRow<"members">;
//# sourceMappingURL=mapMemberToStorable.d.ts.map