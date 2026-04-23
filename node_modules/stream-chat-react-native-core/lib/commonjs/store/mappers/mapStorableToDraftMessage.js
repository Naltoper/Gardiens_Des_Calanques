Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapStorableToDraftMessage = void 0;
var mapStorableToDraftMessage = exports.mapStorableToDraftMessage = function mapStorableToDraftMessage(draftMessageRow) {
  var id = draftMessageRow.id,
    custom = draftMessageRow.custom,
    text = draftMessageRow.text,
    attachments = draftMessageRow.attachments,
    mentionedUsers = draftMessageRow.mentionedUsers,
    parentId = draftMessageRow.parentId,
    poll_id = draftMessageRow.poll_id,
    quotedMessageId = draftMessageRow.quotedMessageId,
    showInChannel = draftMessageRow.showInChannel,
    silent = draftMessageRow.silent,
    type = draftMessageRow.type;
  return {
    attachments: attachments ? JSON.parse(attachments) : undefined,
    custom: custom ? JSON.parse(custom) : undefined,
    id: id,
    mentioned_users: mentionedUsers ? JSON.parse(mentionedUsers) : undefined,
    parent_id: parentId,
    poll_id: poll_id,
    quoted_message_id: quotedMessageId,
    show_in_channel: showInChannel,
    silent: silent,
    text: text,
    type: type
  };
};
//# sourceMappingURL=mapStorableToDraftMessage.js.map