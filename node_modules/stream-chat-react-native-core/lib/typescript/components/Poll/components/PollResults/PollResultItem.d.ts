import React from 'react';
import { LocalMessage, Poll, PollOption } from 'stream-chat';
export type ShowAllVotesButtonProps = {
    option: PollOption;
    onPress?: ({ message, option, poll, }: {
        message: LocalMessage;
        option: PollOption;
        poll: Poll;
    }) => void;
};
export declare const ShowAllVotesButton: (props: ShowAllVotesButtonProps) => React.JSX.Element;
export type PollResultItemProps = {
    option: PollOption;
};
export declare const PollResultsItem: ({ option }: PollResultItemProps) => React.JSX.Element;
//# sourceMappingURL=PollResultItem.d.ts.map