var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useCanCreatePoll = void 0;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _react = require("react");
var _useMessageComposer2 = require("../../../contexts/messageInputContext/hooks/useMessageComposer");
var useCanCreatePoll = exports.useCanCreatePoll = function useCanCreatePoll() {
  var _useMessageComposer = (0, _useMessageComposer2.useMessageComposer)(),
    pollComposer = _useMessageComposer.pollComposer;
  var _useState = (0, _react.useState)(pollComposer.canCreatePoll),
    _useState2 = (0, _slicedToArray2.default)(_useState, 2),
    canCreatePoll = _useState2[0],
    setCanCreatePoll = _useState2[1];
  (0, _react.useEffect)(function () {
    return pollComposer.state.subscribe(function () {
      setCanCreatePoll(pollComposer.canCreatePoll);
    });
  }, [pollComposer]);
  return canCreatePoll;
};
//# sourceMappingURL=useCanCreatePoll.js.map