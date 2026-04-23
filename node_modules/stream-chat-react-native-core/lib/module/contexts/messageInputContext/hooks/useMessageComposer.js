Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useMessageComposer = void 0;
var _useCreateMessageComposer = require("./useCreateMessageComposer");
var _MessageComposerContext = require("../../messageComposerContext/MessageComposerContext");
var useMessageComposer = exports.useMessageComposer = function useMessageComposer() {
  var messageComposerContext = (0, _MessageComposerContext.useMessageComposerContext)();
  return (0, _useCreateMessageComposer.useCreateMessageComposer)(messageComposerContext);
};
//# sourceMappingURL=useMessageComposer.js.map