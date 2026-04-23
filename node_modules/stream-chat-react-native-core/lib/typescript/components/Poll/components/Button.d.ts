import React from 'react';
import { LocalMessage, Poll, PollOption } from 'stream-chat';
export type PollButtonProps = {
    onPress?: ({ message, poll }: {
        message: LocalMessage;
        poll: Poll;
    }) => void;
};
export type PollVoteButtonProps = {
    option: PollOption;
} & Pick<PollButtonProps, 'onPress'>;
export declare const GenericPollButton: ({ onPress, title }: {
    onPress?: () => void;
    title?: string;
}) => React.JSX.Element;
//# sourceMappingURL=Button.d.ts.map