Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapStorableToSharedLocation = void 0;
var mapStorableToSharedLocation = exports.mapStorableToSharedLocation = function mapStorableToSharedLocation(row) {
  var channelCid = row.channelCid,
    createdAt = row.createdAt,
    createdByDeviceId = row.createdByDeviceId,
    endAt = row.endAt,
    latitude = row.latitude,
    longitude = row.longitude,
    messageId = row.messageId,
    updatedAt = row.updatedAt,
    userId = row.userId;
  return {
    channel_cid: channelCid,
    created_at: createdAt,
    created_by_device_id: createdByDeviceId,
    end_at: endAt,
    latitude: latitude,
    longitude: longitude,
    message_id: messageId,
    updated_at: updatedAt,
    user_id: userId
  };
};
//# sourceMappingURL=mapStorableToSharedLocation.js.map