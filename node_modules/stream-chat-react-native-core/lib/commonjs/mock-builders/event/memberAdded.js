Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = exports.default = function _default(client, member) {
  var channel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  client.dispatchEvent({
    channel_id: channel.id,
    channel_type: channel.type,
    cid: channel.cid,
    member: member,
    type: 'member.added',
    user: member.user
  });
};
//# sourceMappingURL=memberAdded.js.map