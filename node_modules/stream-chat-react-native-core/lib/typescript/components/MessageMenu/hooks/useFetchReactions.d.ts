import { LocalMessage, ReactionResponse, ReactionSort } from 'stream-chat';
export type UseFetchReactionParams = {
    limit?: number;
    message?: LocalMessage;
    reactionType?: string;
    sort?: ReactionSort;
};
export declare const useFetchReactions: ({ limit, message, reactionType, sort, }: UseFetchReactionParams) => {
    loading: boolean;
    loadNextPage: () => Promise<void>;
    reactions: ReactionResponse[];
};
//# sourceMappingURL=useFetchReactions.d.ts.map