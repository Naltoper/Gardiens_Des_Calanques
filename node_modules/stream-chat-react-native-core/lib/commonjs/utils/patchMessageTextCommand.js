Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patchMessageTextCommand = patchMessageTextCommand;
function patchMessageTextCommand(messageText, mentionedUserIds) {
  if (mentionedUserIds.length === 0) {
    return messageText;
  }
  var trimmedMessageText = messageText.trim();
  if (trimmedMessageText.startsWith('/mute ') || trimmedMessageText.startsWith('/unmute ') || trimmedMessageText.startsWith('/unban ')) {
    return trimmedMessageText.replace(/@.+/, `@${mentionedUserIds[0]}`);
  }
  if (trimmedMessageText.startsWith('/ban ')) {
    var _trimmedMessageText$s;
    var reasonText = (_trimmedMessageText$s = trimmedMessageText.split(' ').pop()) != null ? _trimmedMessageText$s : '';
    return `/ban @${mentionedUserIds[0]} ${reasonText}`.trim();
  }
  return messageText;
}
//# sourceMappingURL=patchMessageTextCommand.js.map