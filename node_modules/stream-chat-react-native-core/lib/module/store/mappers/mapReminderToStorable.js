Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapReminderToStorable = void 0;
var _mapDateTimeToStorable = require("./mapDateTimeToStorable");
var mapReminderToStorable = exports.mapReminderToStorable = function mapReminderToStorable(reminder) {
  var channel_cid = reminder.channel_cid,
    created_at = reminder.created_at,
    message_id = reminder.message_id,
    remind_at = reminder.remind_at,
    updated_at = reminder.updated_at,
    user_id = reminder.user_id;
  return {
    channelCid: channel_cid,
    createdAt: (0, _mapDateTimeToStorable.mapDateTimeToStorable)(created_at),
    messageId: message_id,
    remindAt: (0, _mapDateTimeToStorable.mapDateTimeToStorable)(remind_at),
    updatedAt: (0, _mapDateTimeToStorable.mapDateTimeToStorable)(updated_at),
    userId: user_id
  };
};
//# sourceMappingURL=mapReminderToStorable.js.map