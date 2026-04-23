import type { ReactionFilters, ReactionSort } from 'stream-chat';
import type { TableRowJoinedUser } from '../../types';
/**
 * Fetches reactions for a message from the database for messageIds.
 * @param messageIds The message IDs for which reactions are to be fetched.
 * @param limit The limit of how many reactions should be returned.
 * @param filters A ReactionFilter for the reactions we want to fetch. Only type is currently supported.
 * @param sort A sort for reactions to be used when querying. Custom data is currently not supported for sorting.
 */
export declare const selectReactionsForMessages: (messageIds: string[], limit?: number | null, filters?: Pick<ReactionFilters, "type">, sort?: ReactionSort) => Promise<TableRowJoinedUser<"reactions">[]>;
//# sourceMappingURL=selectReactionsForMessages.d.ts.map