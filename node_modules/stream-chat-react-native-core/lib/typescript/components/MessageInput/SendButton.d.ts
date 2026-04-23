import React from 'react';
import { MessageInputContextValue } from '../../contexts/messageInputContext/MessageInputContext';
export type SendButtonProps = Partial<Pick<MessageInputContextValue, 'sendMessage'>> & {
    /** Disables the button */
    disabled: boolean;
};
export declare const SendButton: {
    (props: SendButtonProps): React.JSX.Element;
    displayName: string;
};
//# sourceMappingURL=SendButton.d.ts.map