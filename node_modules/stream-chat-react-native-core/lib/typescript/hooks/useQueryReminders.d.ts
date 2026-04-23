import { ReminderResponse } from 'stream-chat';
/**
 * Custom hook to query reminders from the Stream Chat client.
 * It handles fetching, updating, and deleting reminders, and provides
 * a way to refresh the list and load more reminders.
 *
 * @returns {Object} - Contains data, isLoading, onEndReached, onRefresh, and setData.
 */
export declare const useQueryReminders: () => {
    data: ReminderResponse[];
    isLoading: boolean;
    loadNext: () => Promise<void>;
    setData: import("react").Dispatch<import("react").SetStateAction<ReminderResponse[]>>;
};
//# sourceMappingURL=useQueryReminders.d.ts.map