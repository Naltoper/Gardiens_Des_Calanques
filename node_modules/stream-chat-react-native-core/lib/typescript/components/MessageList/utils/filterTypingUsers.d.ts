import type { ChatContextValue } from '../../../contexts/chatContext/ChatContext';
import type { ThreadContextValue } from '../../../contexts/threadContext/ThreadContext';
import type { TypingContextValue } from '../../../contexts/typingContext/TypingContext';
type FilterTypingUsersParams = Pick<TypingContextValue, 'typing'> & Pick<ChatContextValue, 'client'> & Pick<ThreadContextValue, 'thread'>;
export declare const filterTypingUsers: ({ client, thread, typing }: FilterTypingUsersParams) => string[];
export {};
//# sourceMappingURL=filterTypingUsers.d.ts.map