Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useMessageReminder = void 0;
var _react = require("react");
var _useStateStore2 = require("./useStateStore");
var _ChatContext = require("../contexts/chatContext/ChatContext");
var useMessageReminder = exports.useMessageReminder = function useMessageReminder(messageId) {
  var _useChatContext = (0, _ChatContext.useChatContext)(),
    client = _useChatContext.client;
  var reminderSelector = (0, _react.useCallback)(function (state) {
    return {
      reminder: state.reminders.get(messageId)
    };
  }, [messageId]);
  var _useStateStore = (0, _useStateStore2.useStateStore)(client.reminders.state, reminderSelector),
    reminder = _useStateStore.reminder;
  return reminder;
};
//# sourceMappingURL=useMessageReminder.js.map