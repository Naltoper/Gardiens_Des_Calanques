import React from 'react';
import { MessageTextContainerProps } from './MessageTextContainer';
export type StreamingMessageViewProps = Pick<MessageTextContainerProps, 'message'> & {
    letterInterval?: number;
    renderingLetterCount?: number;
};
export declare const StreamingMessageView: {
    (props: StreamingMessageViewProps): React.JSX.Element;
    displayName: string;
};
//# sourceMappingURL=StreamingMessageView.d.ts.map