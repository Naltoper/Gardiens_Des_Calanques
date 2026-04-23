import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
/**
 * This hook is used to manage the state of the attachment picker bottom sheet.
 * It provides functions to open and close the bottom sheet, as well as a reference to the bottom sheet itself.
 * It also handles the cleanup of the timeout used to close the bottom sheet.
 * The bottom sheet is used to display the attachment picker UI.
 * The `openPicker` function opens the bottom sheet, and the `closePicker` function closes it.
 * The `bottomSheetRef` is a reference to the bottom sheet component, which allows for programmatic control of the bottom sheet.
 * The `bottomSheetCloseTimeoutRef` is used to store the timeout ID for the close operation, allowing for cleanup if necessary.
 */
export declare const useAttachmentPickerBottomSheet: () => {
    bottomSheetCloseTimeoutRef: import("react").RefObject<number | undefined>;
    bottomSheetRef: import("react").RefObject<BottomSheetMethods | null>;
    closePicker: (ref: React.RefObject<BottomSheetMethods | null>) => void;
    openPicker: (ref: React.RefObject<BottomSheetMethods | null>) => void;
};
//# sourceMappingURL=useAttachmentPickerBottomSheet.d.ts.map