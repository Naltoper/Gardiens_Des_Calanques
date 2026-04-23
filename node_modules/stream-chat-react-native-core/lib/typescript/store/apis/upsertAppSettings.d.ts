import type { AppSettingsAPIResponse } from 'stream-chat';
export declare const upsertAppSettings: ({ appSettings, currentUserId, execute, }: {
    appSettings: AppSettingsAPIResponse;
    currentUserId: string;
    execute?: boolean;
}) => Promise<import("../types").PreparedQueries[]>;
//# sourceMappingURL=upsertAppSettings.d.ts.map