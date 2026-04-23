import React from 'react';
import { CommandSuggestion, TextComposerSuggestion, UserSuggestion } from 'stream-chat';
import type { Emoji } from '../../types/types';
export type AutoCompleteSuggestionItemProps = {
    itemProps: TextComposerSuggestion;
    triggerType?: string;
};
export declare const MentionSuggestionItem: (item: UserSuggestion) => React.JSX.Element;
export declare const EmojiSuggestionItem: (item: Emoji) => React.JSX.Element;
export declare const CommandSuggestionItem: (item: CommandSuggestion) => React.JSX.Element;
export declare const AutoCompleteSuggestionItem: (props: AutoCompleteSuggestionItemProps) => React.JSX.Element;
//# sourceMappingURL=AutoCompleteSuggestionItem.d.ts.map