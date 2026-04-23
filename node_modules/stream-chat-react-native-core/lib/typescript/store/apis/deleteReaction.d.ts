import { FormatMessageResponse, MessageResponse, ReactionResponse } from 'stream-chat';
import { PreparedQueries } from '../types';
export declare const deleteReaction: ({ execute, message, reaction, }: {
    reaction: ReactionResponse;
    message?: MessageResponse | FormatMessageResponse;
    execute?: boolean;
}) => Promise<PreparedQueries[]>;
//# sourceMappingURL=deleteReaction.d.ts.map