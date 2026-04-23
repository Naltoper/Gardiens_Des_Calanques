import type { PendingTask } from 'stream-chat';
export declare const mapTaskToStorable: (task: PendingTask) => {
    createdAt: string;
    payload: string;
    channelId?: string;
    channelType?: string;
    messageId?: string;
    id?: number;
    threadId?: string;
    type: import("stream-chat").PendingTaskTypes["sendReaction"];
} | {
    createdAt: string;
    payload: string;
    channelId?: string;
    channelType?: string;
    messageId?: string;
    id?: number;
    threadId?: string;
    type: import("stream-chat").PendingTaskTypes["deleteMessage"];
} | {
    createdAt: string;
    payload: string;
    channelId?: string;
    channelType?: string;
    messageId?: string;
    id?: number;
    threadId?: string;
    type: import("stream-chat").PendingTaskTypes["deleteReaction"];
} | {
    createdAt: string;
    payload: string;
    channelId?: string;
    channelType?: string;
    messageId?: string;
    id?: number;
    threadId?: string;
    type: import("stream-chat").PendingTaskTypes["sendMessage"];
} | {
    createdAt: string;
    payload: string;
    channelId?: string;
    channelType?: string;
    messageId?: string;
    id?: number;
    threadId?: string;
    type: import("stream-chat").PendingTaskTypes["createDraft"];
} | {
    createdAt: string;
    payload: string;
    channelId?: string;
    channelType?: string;
    messageId?: string;
    id?: number;
    threadId?: string;
    type: import("stream-chat").PendingTaskTypes["deleteDraft"];
};
//# sourceMappingURL=mapTaskToStorable.d.ts.map