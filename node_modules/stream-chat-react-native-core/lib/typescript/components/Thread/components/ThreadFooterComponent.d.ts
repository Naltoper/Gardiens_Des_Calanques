import React from 'react';
import { MessagesContextValue } from '../../../contexts/messagesContext/MessagesContext';
import { ThreadContextValue } from '../../../contexts/threadContext/ThreadContext';
export declare const InlineLoadingMoreThreadIndicator: () => React.JSX.Element | null;
export type ThreadFooterComponentProps = Partial<Pick<MessagesContextValue, 'Message'>> & Partial<Pick<ThreadContextValue, 'parentMessagePreventPress' | 'thread'>>;
export declare const ThreadFooterComponent: (props: ThreadFooterComponentProps) => React.JSX.Element;
//# sourceMappingURL=ThreadFooterComponent.d.ts.map