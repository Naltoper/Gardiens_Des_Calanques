import { StreamingMessageViewProps } from '../MessageSimple/StreamingMessageView';
export type UseStreamingMessageProps = Pick<StreamingMessageViewProps, 'letterInterval' | 'renderingLetterCount'> & {
    text: string;
};
/**
 * A hook that returns text in a streamed, typewriter fashion. The speed of streaming is
 * configurable.
 * @param {number} [letterInterval=0] - The timeout between each typing animation in milliseconds.
 * @param {number} [renderingLetterCount=2] - The number of letters to be rendered each time we update.
 * @param {string} text - The text that we want to render in a typewriter fashion.
 * @returns {{ streamedMessageText: string }} - A substring of the text property, up until we've finished rendering the typewriter animation.
 */
export declare const useStreamingMessage: ({ letterInterval, renderingLetterCount, text, }: UseStreamingMessageProps) => {
    streamedMessageText: string;
};
//# sourceMappingURL=useStreamingMessage.d.ts.map