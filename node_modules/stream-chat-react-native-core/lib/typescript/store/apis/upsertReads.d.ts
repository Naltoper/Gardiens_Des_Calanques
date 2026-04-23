import type { ReadResponse } from 'stream-chat';
import type { PreparedQueries } from '../types';
export declare const upsertReads: ({ cid, execute, reads, }: {
    cid: string;
    reads: ReadResponse[];
    execute?: boolean;
}) => Promise<PreparedQueries[]>;
//# sourceMappingURL=upsertReads.d.ts.map