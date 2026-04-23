import type { LocalMessage, MessageResponse } from 'stream-chat';
export declare const upsertMessages: ({ execute, messages, }: {
    messages: (MessageResponse | LocalMessage)[];
    execute?: boolean;
}) => Promise<import("../types").PreparedQueries[]>;
//# sourceMappingURL=upsertMessages.d.ts.map