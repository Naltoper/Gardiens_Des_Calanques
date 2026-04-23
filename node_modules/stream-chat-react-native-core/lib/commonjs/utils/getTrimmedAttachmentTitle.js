Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTrimmedAttachmentTitle = void 0;
var getTrimmedAttachmentTitle = exports.getTrimmedAttachmentTitle = function getTrimmedAttachmentTitle(title, maxLength) {
  var maxLengthValue = maxLength || 18;
  if (!title) return '';
  var ellipsis = '...';
  if (title.length <= maxLengthValue) {
    return title;
  }
  var start = title.slice(0, maxLengthValue / 2);
  var end = title.slice(title.length - maxLengthValue / 2);
  return `${start}${ellipsis}${end}`;
};
//# sourceMappingURL=getTrimmedAttachmentTitle.js.map