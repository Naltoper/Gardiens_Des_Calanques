var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useHandleLiveLocationEvents = void 0;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _react = require("react");
var _ChatContext = require("../../../contexts/chatContext/ChatContext");
var useHandleLiveLocationEvents = exports.useHandleLiveLocationEvents = function useHandleLiveLocationEvents(_ref) {
  var channel = _ref.channel,
    messageId = _ref.messageId,
    onLocationUpdate = _ref.onLocationUpdate;
  var _useChatContext = (0, _ChatContext.useChatContext)(),
    client = _useChatContext.client;
  var _useState = (0, _react.useState)(undefined),
    _useState2 = (0, _slicedToArray2.default)(_useState, 2),
    locationResponse = _useState2[0],
    setLocationResponse = _useState2[1];
  var _useState3 = (0, _react.useState)(null),
    _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
    isLiveLocationStopped = _useState4[0],
    setIsLiveLocationStopped = _useState4[1];
  (0, _react.useEffect)(function () {
    var handleMessageUpdate = function handleMessageUpdate(event) {
      var message = event.message;
      if (!message || !message.shared_location) {
        return;
      }
      var shared_location = message.shared_location;
      if (message.id === messageId) {
        setLocationResponse(message.shared_location);
        onLocationUpdate == null || onLocationUpdate(message.shared_location);
      }
      if (shared_location.end_at && shared_location.end_at <= new Date().toISOString()) {
        setIsLiveLocationStopped(true);
      }
    };
    var listener = [channel.on('message.updated', handleMessageUpdate)];
    return function () {
      listener.forEach(function (l) {
        return l.unsubscribe();
      });
    };
  }, [channel, client, messageId, onLocationUpdate]);
  return {
    isLiveLocationStopped: isLiveLocationStopped,
    locationResponse: locationResponse
  };
};
//# sourceMappingURL=useHandleLiveLocationEvents.js.map