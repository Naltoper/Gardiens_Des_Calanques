Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapStorableToReminder = void 0;
var mapStorableToReminder = exports.mapStorableToReminder = function mapStorableToReminder(row) {
  var channelCid = row.channelCid,
    createdAt = row.createdAt,
    messageId = row.messageId,
    remindAt = row.remindAt,
    updatedAt = row.updatedAt,
    userId = row.userId;
  return {
    channel_cid: channelCid,
    created_at: createdAt,
    message_id: messageId,
    remind_at: remindAt,
    updated_at: updatedAt,
    user_id: userId
  };
};
//# sourceMappingURL=mapStorableToReminder.js.map