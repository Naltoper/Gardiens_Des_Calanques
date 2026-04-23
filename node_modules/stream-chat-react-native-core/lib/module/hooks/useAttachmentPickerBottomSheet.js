Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAttachmentPickerBottomSheet = void 0;
var _react = require("react");
var useAttachmentPickerBottomSheet = exports.useAttachmentPickerBottomSheet = function useAttachmentPickerBottomSheet() {
  var bottomSheetCloseTimeoutRef = (0, _react.useRef)(undefined);
  var bottomSheetRef = (0, _react.useRef)(null);
  (0, _react.useEffect)(function () {
    return (function () {
        if (bottomSheetCloseTimeoutRef.current) {
          clearTimeout(bottomSheetCloseTimeoutRef.current);
        }
      }
    );
  }, []);
  var openPicker = (0, _react.useCallback)(function (ref) {
    var _ref$current;
    if (bottomSheetCloseTimeoutRef.current) {
      clearTimeout(bottomSheetCloseTimeoutRef.current);
    }
    if ((_ref$current = ref.current) != null && _ref$current.snapToIndex) {
      ref.current.snapToIndex(0);
    } else {
      console.warn('bottom and top insets must be set for the image picker to work correctly');
    }
  }, []);
  var closePicker = (0, _react.useCallback)(function (ref) {
    var _ref$current2;
    if ((_ref$current2 = ref.current) != null && _ref$current2.close) {
      if (bottomSheetCloseTimeoutRef.current) {
        clearTimeout(bottomSheetCloseTimeoutRef.current);
      }
      ref.current.close();
      bottomSheetCloseTimeoutRef.current = setTimeout(function () {
        var _ref$current3;
        (_ref$current3 = ref.current) == null || _ref$current3.close();
      }, 600);
    }
  }, []);
  (0, _react.useEffect)(function () {
    closePicker(bottomSheetRef);
  }, [closePicker]);
  return {
    bottomSheetCloseTimeoutRef: bottomSheetCloseTimeoutRef,
    bottomSheetRef: bottomSheetRef,
    closePicker: closePicker,
    openPicker: openPicker
  };
};
//# sourceMappingURL=useAttachmentPickerBottomSheet.js.map