import type { ReactionFilters, ReactionResponse, ReactionSort } from 'stream-chat';
/**
 * Fetches reactions for a message from the database based on the provided filters and sort.
 * @param currentMessageId The message ID for which reactions are to be fetched.
 * @param filters The filters to be applied while fetching reactions.
 * @param sort The sort to be applied while fetching reactions.
 * @param limit The limit of how many reactions should be returned.
 */
export declare const getReactionsForFilterSort: ({ messageId, filters, sort, limit, }: {
    messageId: string;
    filters?: Pick<ReactionFilters, "type">;
    sort?: ReactionSort;
    limit?: number;
}) => Promise<ReactionResponse[] | null>;
//# sourceMappingURL=getReactionsforFilterSort.d.ts.map