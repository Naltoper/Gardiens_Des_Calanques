Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapStorableToDraft = void 0;
var _mapStorableToChannel = require("./mapStorableToChannel");
var _mapStorableToDraftMessage = require("./mapStorableToDraftMessage");
var _mapStorableToMessage = require("./mapStorableToMessage");
var mapStorableToDraft = exports.mapStorableToDraft = function mapStorableToDraft(_ref) {
  var currentUserId = _ref.currentUserId,
    draftRow = _ref.draftRow,
    channelRow = _ref.channelRow,
    pollRow = _ref.pollRow,
    quotedMessageRow = _ref.quotedMessageRow;
  var createdAt = draftRow.createdAt,
    cid = draftRow.cid,
    parentId = draftRow.parentId;
  var message = (0, _mapStorableToDraftMessage.mapStorableToDraftMessage)(draftRow.draftMessage);
  var channel = (0, _mapStorableToChannel.mapStorableToChannel)(channelRow);
  var quotedMessage = quotedMessageRow ? (0, _mapStorableToMessage.mapStorableToMessage)({
    currentUserId: currentUserId,
    messageRow: quotedMessageRow,
    pollRow: pollRow
  }) : undefined;
  return {
    channel: channel.channel,
    channel_cid: cid,
    created_at: createdAt,
    message: message,
    parent_id: parentId,
    quoted_message: quotedMessage
  };
};
//# sourceMappingURL=mapStorableToDraft.js.map