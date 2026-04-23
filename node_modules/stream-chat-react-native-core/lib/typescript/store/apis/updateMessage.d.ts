import type { LocalMessage, MessageResponse } from 'stream-chat';
import type { PreparedQueries } from '../types';
export declare const updateMessage: ({ execute, message, }: {
    message: MessageResponse | LocalMessage;
    execute?: boolean;
}) => Promise<PreparedQueries[]>;
//# sourceMappingURL=updateMessage.d.ts.map