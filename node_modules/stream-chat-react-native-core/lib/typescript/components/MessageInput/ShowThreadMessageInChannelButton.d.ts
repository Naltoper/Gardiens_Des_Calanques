import React from 'react';
import { ChannelContextValue } from '../../contexts/channelContext/ChannelContext';
import { ThreadContextValue } from '../../contexts/threadContext/ThreadContext';
import { TranslationContextValue } from '../../contexts/translationContext/TranslationContext';
export type ShowThreadMessageInChannelButtonWithContextProps = Pick<ThreadContextValue, 'allowThreadMessagesInChannel'> & Pick<TranslationContextValue, 't'> & {
    threadList?: ChannelContextValue['threadList'];
};
export declare const ShowThreadMessageInChannelButtonWithContext: (props: ShowThreadMessageInChannelButtonWithContextProps) => React.JSX.Element | null;
export type ShowThreadMessageInChannelButtonProps = Partial<ShowThreadMessageInChannelButtonWithContextProps>;
export declare const ShowThreadMessageInChannelButton: {
    (props: ShowThreadMessageInChannelButtonProps): React.JSX.Element;
    displayName: string;
};
//# sourceMappingURL=ShowThreadMessageInChannelButton.d.ts.map