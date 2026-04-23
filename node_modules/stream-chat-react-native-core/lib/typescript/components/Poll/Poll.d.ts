import React from 'react';
import { MessagesContextValue, PollContextValue } from '../../contexts';
export type PollProps = Pick<PollContextValue, 'poll' | 'message'> & Pick<MessagesContextValue, 'PollContent'>;
export type PollContentProps = {
    PollButtons?: React.ComponentType;
    PollHeader?: React.ComponentType;
};
export declare const PollHeader: () => React.JSX.Element;
export declare const PollContent: ({ PollButtons: PollButtonsOverride, PollHeader: PollHeaderOverride, }: PollContentProps) => React.JSX.Element;
export declare const Poll: ({ message, poll, PollContent: PollContentOverride }: PollProps) => React.JSX.Element;
//# sourceMappingURL=Poll.d.ts.map