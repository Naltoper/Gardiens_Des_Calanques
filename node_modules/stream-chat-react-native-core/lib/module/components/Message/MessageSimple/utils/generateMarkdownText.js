var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateMarkdownText = void 0;
var _truncate = _interopRequireDefault(require("lodash/truncate"));
var _parseLinks = require("./parseLinks");
var _utils = require("../../../../utils/utils");
var generateMarkdownText = exports.generateMarkdownText = function generateMarkdownText(text) {
  if (!text) {
    return null;
  }
  var resultText = text.trim();
  var linkInfos = (0, _parseLinks.parseLinksFromText)(resultText);
  for (var linkInfo of linkInfos) {
    var displayLink = (0, _truncate.default)(linkInfo.raw, {
      length: 200,
      omission: '...'
    });
    var normalRegEx = new RegExp((0, _utils.escapeRegExp)(linkInfo.raw), 'g');
    var markdown = `[${displayLink}](${linkInfo.url})`;
    resultText = text.replace(normalRegEx, markdown);
    var mentionsRegex = new RegExp(`@\\[${(0, _utils.escapeRegExp)(displayLink)}\\]\\(${(0, _utils.escapeRegExp)(linkInfo.url)}\\)`, 'g');
    resultText = resultText.replace(mentionsRegex, `@${displayLink}`);
  }
  resultText = resultText.replace(/(```[\s\S]*?```|`.*?`)|[<"']/g, function (match, code) {
    if (code) {
      return code;
    }
    return `\\${match}`;
  });
  resultText = resultText.replace(/(```[\s\S]*?```|`.*?`)|\n[ ]{2,}/g, function (_, code) {
    if (code) {
      return code;
    }
    return '\n';
  });
  resultText = resultText.replace(/\n```/g, '\n\n```');
  return resultText;
};
//# sourceMappingURL=generateMarkdownText.js.map