var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.openInAppNotification = exports.inAppNotificationsStore = exports.closeInAppNotification = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _streamChat = require("stream-chat");
var INITIAL_STATE = {
  notifications: []
};
var inAppNotificationsStore = exports.inAppNotificationsStore = new _streamChat.StateStore(INITIAL_STATE);
var openInAppNotification = exports.openInAppNotification = function openInAppNotification(notification) {
  if (!notification.id) {
    console.warn('Notification must have an id to be opened!');
    return;
  }
  var _inAppNotificationsSt = inAppNotificationsStore.getLatestValue(),
    notifications = _inAppNotificationsSt.notifications;
  if (notifications.some(function (n) {
    return n.id === notification.id;
  })) {
    console.warn('Notification with the same id already exists!');
    return;
  }
  inAppNotificationsStore.partialNext({
    notifications: [].concat((0, _toConsumableArray2.default)(notifications), [notification])
  });
};
var closeInAppNotification = exports.closeInAppNotification = function closeInAppNotification(id) {
  if (!id) {
    console.warn('Notification id is required to be closed!');
    return;
  }
  var _inAppNotificationsSt2 = inAppNotificationsStore.getLatestValue(),
    notifications = _inAppNotificationsSt2.notifications;
  inAppNotificationsStore.partialNext({
    notifications: notifications.filter(function (notification) {
      return notification.id !== id;
    })
  });
};
//# sourceMappingURL=in-app-notifications-store.js.map