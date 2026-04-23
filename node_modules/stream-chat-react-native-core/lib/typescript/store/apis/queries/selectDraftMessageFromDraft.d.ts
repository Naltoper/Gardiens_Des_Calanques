import { TableRowJoinedDraftMessage } from '../../types';
export declare const selectDraftMessageFromDraft: ({ cid, parent_id, }: {
    cid: string;
    parent_id: string | null;
}) => Promise<TableRowJoinedDraftMessage<"draft"> | undefined>;
//# sourceMappingURL=selectDraftMessageFromDraft.d.ts.map