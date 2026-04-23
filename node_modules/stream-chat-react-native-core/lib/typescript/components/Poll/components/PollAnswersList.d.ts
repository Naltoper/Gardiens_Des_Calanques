import React from 'react';
import { type FlatListProps } from 'react-native';
import { PollAnswer } from 'stream-chat';
import { PollButtonProps } from './Button';
import { PollContextValue } from '../../../contexts';
export declare const AnswerListAddCommentButton: (props: PollButtonProps) => React.JSX.Element;
export type PollAnswersListProps = PollContextValue & {
    additionalFlatListProps?: Partial<FlatListProps<PollAnswer>>;
    PollAnswersListContent?: React.ComponentType;
};
export declare const PollAnswerListItem: ({ answer }: {
    answer: PollAnswer;
}) => React.JSX.Element;
export declare const PollAnswersListContent: ({ additionalFlatListProps, }: Pick<PollAnswersListProps, "additionalFlatListProps">) => React.JSX.Element;
export declare const PollAnswersList: ({ additionalFlatListProps, message, poll, PollAnswersListContent: PollAnswersListOverride, }: PollAnswersListProps) => React.JSX.Element;
//# sourceMappingURL=PollAnswersList.d.ts.map