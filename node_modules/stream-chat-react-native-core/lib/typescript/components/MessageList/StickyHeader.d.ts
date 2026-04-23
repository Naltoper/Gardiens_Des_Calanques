import React from 'react';
import { MessagesContextValue } from '../../contexts/messagesContext/MessagesContext';
/**
 * Props for the StickyHeader component.
 */
export type StickyHeaderProps = Pick<MessagesContextValue, 'DateHeader'> & {
    /**
     * Date to be displayed in the sticky header.
     */
    date?: Date;
    /**
     * The formatted date string to be displayed in the sticky header.
     */
    dateString?: string | number;
};
export declare const StickyHeader: ({ date, DateHeader, dateString }: StickyHeaderProps) => React.JSX.Element | null;
//# sourceMappingURL=StickyHeader.d.ts.map