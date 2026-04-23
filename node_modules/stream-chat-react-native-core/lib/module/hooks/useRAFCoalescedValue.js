var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useRAFCoalescedValue = void 0;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _react = require("react");
var useRAFCoalescedValue = exports.useRAFCoalescedValue = function useRAFCoalescedValue(value, isEnabled) {
  var _useState = (0, _react.useState)(value),
    _useState2 = (0, _slicedToArray2.default)(_useState, 2),
    emitted = _useState2[0],
    setEmitted = _useState2[1];
  var pendingRef = (0, _react.useRef)(value);
  var rafIdRef = (0, _react.useRef)(null);
  (0, _react.useEffect)(function () {
    if (value === pendingRef.current || !isEnabled) return;
    pendingRef.current = value;
    if (rafIdRef.current) return;
    var run = function run() {
      rafIdRef.current = null;
      setEmitted(pendingRef.current);
    };
    rafIdRef.current = requestAnimationFrame(run);
  }, [value, isEnabled]);
  (0, _react.useEffect)(function () {
    return function () {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, []);
  return isEnabled ? emitted : value;
};
//# sourceMappingURL=useRAFCoalescedValue.js.map