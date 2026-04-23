import type { LocalMessage, MessageResponse, ReactionResponse } from 'stream-chat';
import type { PreparedQueries } from '../types';
export declare const insertReaction: ({ execute, message, reaction, }: {
    message: MessageResponse | LocalMessage;
    reaction: ReactionResponse;
    execute?: boolean;
}) => Promise<PreparedQueries[]>;
//# sourceMappingURL=insertReaction.d.ts.map