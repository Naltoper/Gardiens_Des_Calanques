import React from 'react';
import { MessageInputContextValue } from '../../../contexts/messageInputContext/MessageInputContext';
export type CommandInputProps = Partial<Pick<MessageInputContextValue, 'additionalTextInputProps' | 'cooldownEndsAt'>> & {
    disabled: boolean;
};
export declare const CommandInput: {
    ({ cooldownEndsAt: propCooldownEndsAt, disabled, }: CommandInputProps): React.JSX.Element | null;
    displayName: string;
};
//# sourceMappingURL=CommandInput.d.ts.map