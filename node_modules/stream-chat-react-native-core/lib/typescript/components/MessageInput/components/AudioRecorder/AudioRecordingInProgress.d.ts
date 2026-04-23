import React from 'react';
import { MessageInputContextValue } from '../../../../contexts/messageInputContext/MessageInputContext';
type AudioRecordingInProgressPropsWithContext = Pick<MessageInputContextValue, 'AudioRecordingWaveform'> & {
    /**
     * The waveform data to be presented to show the audio levels.
     */
    waveformData: number[];
    /**
     * Maximum number of waveform lines that should be rendered in the UI.
     */
    maxDataPointsDrawn?: number;
    /**
     * The duration of the voice recording.
     */
    recordingDuration?: number;
};
export type AudioRecordingInProgressProps = Partial<AudioRecordingInProgressPropsWithContext> & {
    waveformData: number[];
};
/**
 * Component displayed when the audio is in the recording state.
 */
export declare const AudioRecordingInProgress: {
    (props: AudioRecordingInProgressProps): React.JSX.Element;
    displayName: string;
};
export {};
//# sourceMappingURL=AudioRecordingInProgress.d.ts.map