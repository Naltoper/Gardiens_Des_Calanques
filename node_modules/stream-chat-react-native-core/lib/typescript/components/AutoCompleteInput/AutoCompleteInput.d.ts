import React from 'react';
import { TextInput as RNTextInput, TextInputProps } from 'react-native';
import { ChannelContextValue } from '../../contexts/channelContext/ChannelContext';
import { MessageInputContextValue } from '../../contexts/messageInputContext/MessageInputContext';
import { TranslationContextValue } from '../../contexts/translationContext/TranslationContext';
type AutoCompleteInputPropsWithContext = TextInputProps & Pick<ChannelContextValue, 'channel'> & Pick<MessageInputContextValue, 'setInputBoxRef'> & Pick<TranslationContextValue, 't'> & {
    /**
     * This is currently passed in from MessageInput to avoid rerenders
     * that would happen if we put this in the MessageInputContext
     */
    cooldownActive?: boolean;
    TextInputComponent?: React.ComponentType<TextInputProps & {
        ref: React.Ref<RNTextInput> | undefined;
    }>;
};
type AutoCompleteInputProps = Partial<AutoCompleteInputPropsWithContext>;
export declare const AutoCompleteInput: {
    (props: AutoCompleteInputProps): React.JSX.Element;
    displayName: string;
};
export {};
//# sourceMappingURL=AutoCompleteInput.d.ts.map