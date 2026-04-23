Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useStableCallback = void 0;
var _react = require("react");
var useStableCallback = exports.useStableCallback = function useStableCallback(callback) {
  var ref = (0, _react.useRef)(callback);
  ref.current = callback;
  return (0, _react.useCallback)(function () {
    return ref.current.apply(ref, arguments);
  }, []);
};
//# sourceMappingURL=useStableCallback.js.map