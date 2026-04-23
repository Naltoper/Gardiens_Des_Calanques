import type { LocalMessage, MessageResponse, ReactionResponse } from 'stream-chat';
import type { PreparedQueries } from '../types';
export declare const updateReaction: ({ execute, message, reaction, }: {
    message: MessageResponse | LocalMessage;
    reaction: ReactionResponse;
    execute?: boolean;
}) => Promise<PreparedQueries[]>;
//# sourceMappingURL=updateReaction.d.ts.map