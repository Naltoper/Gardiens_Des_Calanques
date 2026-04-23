Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapSharedLocationToStorable = void 0;
var _mapDateTimeToStorable = require("./mapDateTimeToStorable");
var mapSharedLocationToStorable = exports.mapSharedLocationToStorable = function mapSharedLocationToStorable(location) {
  var channel_cid = location.channel_cid,
    created_at = location.created_at,
    created_by_device_id = location.created_by_device_id,
    end_at = location.end_at,
    latitude = location.latitude,
    longitude = location.longitude,
    message_id = location.message_id,
    updated_at = location.updated_at,
    user_id = location.user_id;
  return {
    channelCid: channel_cid,
    createdAt: (0, _mapDateTimeToStorable.mapDateTimeToStorable)(created_at),
    createdByDeviceId: created_by_device_id,
    endAt: (0, _mapDateTimeToStorable.mapDateTimeToStorable)(end_at),
    latitude: latitude,
    longitude: longitude,
    messageId: message_id,
    updatedAt: (0, _mapDateTimeToStorable.mapDateTimeToStorable)(updated_at),
    userId: user_id
  };
};
//# sourceMappingURL=mapSharedLocationToStorable.js.map