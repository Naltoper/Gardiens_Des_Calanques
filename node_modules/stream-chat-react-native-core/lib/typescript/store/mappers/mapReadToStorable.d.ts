import type { ReadResponse } from 'stream-chat';
import type { TableRow } from '../types';
export declare const mapReadToStorable: ({ cid, read, }: {
    cid: string;
    read: ReadResponse;
}) => TableRow<"reads">;
//# sourceMappingURL=mapReadToStorable.d.ts.map