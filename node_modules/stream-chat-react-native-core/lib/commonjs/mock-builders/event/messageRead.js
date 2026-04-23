Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = exports.default = function _default(client, user) {
  var channel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var payload = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var newDate = new Date();
  var event = Object.assign({
    channel: channel,
    cid: channel.cid,
    created_at: newDate,
    received_at: newDate,
    type: 'message.read',
    user: user
  }, payload);
  client.dispatchEvent(event);
  return event;
};
//# sourceMappingURL=messageRead.js.map