Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useClientNotifications = void 0;
var _useStateStore2 = require("./useStateStore");
var _ChatContext = require("../contexts/chatContext/ChatContext");
var selector = function selector(state) {
  return {
    notifications: state.notifications
  };
};
var useClientNotifications = exports.useClientNotifications = function useClientNotifications() {
  var _useChatContext = (0, _ChatContext.useChatContext)(),
    client = _useChatContext.client;
  var _useStateStore = (0, _useStateStore2.useStateStore)(client.notifications.store, selector),
    notifications = _useStateStore.notifications;
  return {
    notifications: notifications
  };
};
//# sourceMappingURL=useClientNotifications.js.map