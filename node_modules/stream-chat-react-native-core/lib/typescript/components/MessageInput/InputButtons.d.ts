import React from 'react';
import { AttachmentPickerContextValue, OwnCapabilitiesContextValue } from '../../contexts';
import { MessageInputContextValue } from '../../contexts/messageInputContext/MessageInputContext';
export type InputButtonsProps = Partial<InputButtonsWithContextProps>;
export type InputButtonsWithContextProps = Pick<MessageInputContextValue, 'AttachButton' | 'CommandsButton' | 'hasCameraPicker' | 'hasCommands' | 'hasFilePicker' | 'hasImagePicker' | 'MoreOptionsButton' | 'toggleAttachmentPicker'> & Pick<AttachmentPickerContextValue, 'selectedPicker'> & Pick<OwnCapabilitiesContextValue, 'uploadFile'>;
export declare const InputButtonsWithContext: (props: InputButtonsWithContextProps) => React.JSX.Element | null;
export declare const InputButtons: (props: InputButtonsProps) => React.JSX.Element;
//# sourceMappingURL=InputButtons.d.ts.map