Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useMessageComposerHasSendableData = void 0;
var _useMessageComposer = require("./useMessageComposer");
var _useStateStore = require("../../../hooks/useStateStore");
var editingAuditStateStateSelector = function editingAuditStateStateSelector(state) {
  return state;
};
var useMessageComposerHasSendableData = exports.useMessageComposerHasSendableData = function useMessageComposerHasSendableData() {
  var messageComposer = (0, _useMessageComposer.useMessageComposer)();
  (0, _useStateStore.useStateStore)(messageComposer.editingAuditState, editingAuditStateStateSelector);
  return messageComposer.hasSendableData;
};
//# sourceMappingURL=useMessageComposerHasSendableData.js.map