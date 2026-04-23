var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useIsChannelMuted = void 0;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _react = require("react");
var _ChatContext = require("../../../contexts/chatContext/ChatContext");
var defaultMuteStatus = {
  createdAt: null,
  expiresAt: null,
  muted: false
};
var useIsChannelMuted = exports.useIsChannelMuted = function useIsChannelMuted(channel) {
  var _useChatContext = (0, _ChatContext.useChatContext)(),
    client = _useChatContext.client;
  var _useState = (0, _react.useState)(function () {
      return channel.muteStatus();
    }),
    _useState2 = (0, _slicedToArray2.default)(_useState, 2),
    muted = _useState2[0],
    setMuted = _useState2[1];
  (0, _react.useEffect)(function () {
    var handleEvent = function handleEvent() {
      var _newMuteStatus$create, _muted$createdAt, _newMuteStatus$expire, _muted$expiresAt;
      var newMuteStatus = channel.muteStatus();
      if (newMuteStatus.muted === muted.muted && ((_newMuteStatus$create = newMuteStatus.createdAt) == null || _newMuteStatus$create.getTime == null ? void 0 : _newMuteStatus$create.getTime()) === ((_muted$createdAt = muted.createdAt) == null || _muted$createdAt.getTime == null ? void 0 : _muted$createdAt.getTime()) && ((_newMuteStatus$expire = newMuteStatus.expiresAt) == null || _newMuteStatus$expire.getTime == null ? void 0 : _newMuteStatus$expire.getTime()) === ((_muted$expiresAt = muted.expiresAt) == null || _muted$expiresAt.getTime == null ? void 0 : _muted$expiresAt.getTime())) {
        return;
      }
      setMuted(channel.muteStatus());
    };
    var listeners = [client.on('notification.channel_mutes_updated', handleEvent), client.on('health.check', function (event) {
      if (event.me) {
        handleEvent();
      }
    })];
    return function () {
      listeners.forEach(function (listener) {
        return listener.unsubscribe();
      });
    };
  }, [channel, client, muted]);
  return muted != null ? muted : defaultMuteStatus;
};
//# sourceMappingURL=useIsChannelMuted.js.map