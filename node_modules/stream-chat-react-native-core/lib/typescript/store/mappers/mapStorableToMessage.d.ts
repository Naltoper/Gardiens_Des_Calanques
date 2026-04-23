import type { MessageResponse } from 'stream-chat';
import type { TableRow, TableRowJoinedUser } from '../types';
export declare const mapStorableToMessage: ({ currentUserId, messageRow, pollRow, reactionRows, reminderRow, }: {
    currentUserId: string;
    messageRow: TableRowJoinedUser<"messages">;
    pollRow: TableRow<"poll">;
    reactionRows?: TableRowJoinedUser<"reactions">[];
    reminderRow?: TableRow<"reminders">;
}) => MessageResponse;
//# sourceMappingURL=mapStorableToMessage.d.ts.map