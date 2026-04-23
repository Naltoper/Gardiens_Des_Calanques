Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapDraftToStorable = void 0;
var _mapDateTimeToStorable = require("./mapDateTimeToStorable");
var mapDraftToStorable = exports.mapDraftToStorable = function mapDraftToStorable(_ref) {
  var draft = _ref.draft;
  var channel_cid = draft.channel_cid,
    created_at = draft.created_at,
    parent_id = draft.parent_id,
    message = draft.message,
    quoted_message = draft.quoted_message;
  var createdAt = (0, _mapDateTimeToStorable.mapDateTimeToStorable)(created_at);
  return {
    cid: channel_cid,
    createdAt: createdAt,
    draftMessageId: message.id,
    parentId: parent_id,
    quotedMessageId: quoted_message == null ? void 0 : quoted_message.id
  };
};
//# sourceMappingURL=mapDraftToStorable.js.map