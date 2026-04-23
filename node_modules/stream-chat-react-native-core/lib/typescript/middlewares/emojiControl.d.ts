import type { Middleware, TextComposerMiddlewareExecutorState, TextComposerMiddlewareOptions, TextComposerSuggestion } from 'stream-chat';
import { Emoji, EmojiSearchIndex } from '../types/types';
export type EmojiSuggestion<T extends Emoji = Emoji> = TextComposerSuggestion<T>;
export type EmojiMiddleware<T extends Emoji = Emoji> = Middleware<TextComposerMiddlewareExecutorState<EmojiSuggestion<T>>, 'onChange' | 'onSuggestionItemSelect'>;
/**
 * TextComposer middleware for mentions
 * Usage:
 *
 *  const textComposer = new TextComposer(options);
 *
 *  textComposer.use(new createTextComposerEmojiMiddleware(emojiSearchIndex, {
 *   minChars: 2
 *  }));
 *
 * @param emojiSearchIndex
 * @param {{
 *     minChars: number;
 *     trigger: string;
 *   }} options
 * @returns
 */
export declare const createTextComposerEmojiMiddleware: ({ emojiSearchIndex, options, }: {
    emojiSearchIndex: EmojiSearchIndex;
    options?: Partial<TextComposerMiddlewareOptions>;
}) => EmojiMiddleware;
//# sourceMappingURL=emojiControl.d.ts.map