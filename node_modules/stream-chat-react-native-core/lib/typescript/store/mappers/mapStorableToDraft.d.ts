import { DraftResponse } from 'stream-chat';
import type { TableRow, TableRowJoinedDraftMessage, TableRowJoinedUser } from '../types';
export declare const mapStorableToDraft: ({ currentUserId, draftRow, channelRow, pollRow, quotedMessageRow, }: {
    currentUserId: string;
    draftRow: TableRowJoinedDraftMessage<"draft">;
    channelRow: TableRow<"channels">;
    pollRow: TableRow<"poll">;
    quotedMessageRow?: TableRowJoinedUser<"messages">;
}) => DraftResponse;
//# sourceMappingURL=mapStorableToDraft.d.ts.map