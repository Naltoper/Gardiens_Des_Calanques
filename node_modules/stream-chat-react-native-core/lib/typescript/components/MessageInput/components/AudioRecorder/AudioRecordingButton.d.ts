import React from 'react';
import { MessageInputContextValue } from '../../../../contexts/messageInputContext/MessageInputContext';
import { AudioRecordingReturnType } from '../../../../native';
export type AudioRecordingButtonProps = Partial<Pick<MessageInputContextValue, 'asyncMessagesMinimumPressDuration'> & {
    /**
     * The current voice recording that is in progress.
     */
    recording: AudioRecordingReturnType;
    /**
     * Size of the mic button.
     */
    buttonSize?: number;
    /**
     * Handler to determine what should happen on long press of the mic button.
     */
    handleLongPress?: () => void;
    /**
     * Handler to determine what should happen on press of the mic button.
     */
    handlePress?: () => void;
    /**
     * Boolean to determine if the audio recording permissions are granted.
     */
    permissionsGranted?: boolean;
    /**
     * Function to start the voice recording.
     */
    startVoiceRecording?: () => Promise<void>;
}>;
/**
 * Component to display the mic button on the Message Input.
 */
export declare const AudioRecordingButton: {
    (props: AudioRecordingButtonProps): React.JSX.Element;
    displayName: string;
};
//# sourceMappingURL=AudioRecordingButton.d.ts.map