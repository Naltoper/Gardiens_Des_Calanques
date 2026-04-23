import React from 'react';
import { SharedValue } from 'react-native-reanimated';
import { PollComposerOption } from 'stream-chat';
export type CurrentOptionPositionsCache = {
    inverseIndexCache: {
        [key: number]: string;
    };
    positionCache: {
        [key: string]: {
            updatedIndex: number;
            updatedTop: number;
        };
    };
};
export type CreatePollOptionType = {
    boundaries: {
        maxBound: number;
        minBound: number;
    };
    currentOptionPositions: SharedValue<CurrentOptionPositionsCache>;
    draggedItemId: SharedValue<string | null>;
    error?: string;
    handleChangeText: (newText: string, index: number) => void;
    handleBlur: () => void;
    index: number;
    isDragging: SharedValue<1 | 0>;
    option: PollComposerOption;
    /**
     *
     * @param newOrder The inverse index object of the new options position after re-ordering.
     * @returns
     */
    onNewOrder: (newOrder: CurrentOptionPositionsCache['inverseIndexCache']) => void;
};
export declare const CreatePollOption: ({ boundaries, currentOptionPositions, draggedItemId, error, handleBlur, handleChangeText, index, isDragging, option, onNewOrder, }: CreatePollOptionType) => React.JSX.Element;
export type CreatePollOptionsProps = {
    currentOptionPositions: SharedValue<CurrentOptionPositionsCache>;
};
export declare const CreatePollOptions: ({ currentOptionPositions }: CreatePollOptionsProps) => React.JSX.Element;
//# sourceMappingURL=CreatePollOptions.d.ts.map