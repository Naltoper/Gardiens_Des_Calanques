Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapDraftMessageToStorable = void 0;
var mapDraftMessageToStorable = exports.mapDraftMessageToStorable = function mapDraftMessageToStorable(_ref) {
  var draftMessage = _ref.draftMessage;
  var id = draftMessage.id,
    custom = draftMessage.custom,
    text = draftMessage.text,
    attachments = draftMessage.attachments,
    mentioned_users = draftMessage.mentioned_users,
    parent_id = draftMessage.parent_id,
    poll_id = draftMessage.poll_id,
    quoted_message_id = draftMessage.quoted_message_id,
    show_in_channel = draftMessage.show_in_channel,
    silent = draftMessage.silent,
    type = draftMessage.type;
  return {
    attachments: attachments ? JSON.stringify(attachments) : undefined,
    custom: custom ? JSON.stringify(custom) : undefined,
    id: id,
    mentionedUsers: mentioned_users ? JSON.stringify(mentioned_users) : undefined,
    parentId: parent_id,
    poll_id: poll_id,
    quotedMessageId: quoted_message_id,
    showInChannel: show_in_channel,
    silent: silent,
    text: text,
    type: type
  };
};
//# sourceMappingURL=mapDraftMessageToStorable.js.map