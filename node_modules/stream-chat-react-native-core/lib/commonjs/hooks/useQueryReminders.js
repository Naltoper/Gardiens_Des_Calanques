var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useQueryReminders = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _react = require("react");
var _useStateStore2 = require("./useStateStore");
var _ChatContext = require("../contexts/chatContext/ChatContext");
var selector = function selector(nextValue) {
  return {
    isLoading: nextValue.isLoading,
    items: nextValue.items
  };
};
var sortRemindersByDate = function sortRemindersByDate(reminders) {
  return reminders.sort(function (a, b) {
    if (!a.remind_at || !b.remind_at) {
      return 0;
    }
    return new Date(a.remind_at).getTime() - new Date(b.remind_at).getTime();
  });
};
var isReminderOverdue = function isReminderOverdue(reminder) {
  return (reminder == null ? void 0 : reminder.remind_at) && new Date(reminder.remind_at) < new Date();
};
var isReminderUpcoming = function isReminderUpcoming(reminder) {
  return (reminder == null ? void 0 : reminder.remind_at) && new Date(reminder.remind_at) > new Date();
};
var showAllReminders = function showAllReminders(filters) {
  return filters && Object.keys(filters).length === 0;
};
var useQueryReminders = exports.useQueryReminders = function useQueryReminders() {
  var _useChatContext = (0, _ChatContext.useChatContext)(),
    client = _useChatContext.client;
  var _useStateStore = (0, _useStateStore2.useStateStore)(client.reminders.paginator.state, selector),
    isLoading = _useStateStore.isLoading,
    items = _useStateStore.items;
  var _useState = (0, _react.useState)(items != null ? items : []),
    _useState2 = (0, _slicedToArray2.default)(_useState, 2),
    data = _useState2[0],
    setData = _useState2[1];
  var deletedOrUpdatedRemindersCache = (0, _react.useRef)({});
  (0, _react.useEffect)(function () {
    setData(function (prevData) {
      if (!items) {
        return prevData;
      }
      var newData = [];
      items.forEach(function (reminder) {
        if (prevData.includes(reminder)) {
          newData.push(reminder);
        } else {
          if (!deletedOrUpdatedRemindersCache.current[reminder.message_id]) {
            newData.push(reminder);
          }
        }
      });
      return newData;
    });
  }, [items, client.reminders.paginator.filters]);
  (0, _react.useEffect)(function () {
    var handleReminderDeleted = function handleReminderDeleted(event) {
      var _event$reminder;
      if (!((_event$reminder = event.reminder) != null && _event$reminder.message_id)) {
        return;
      }
      deletedOrUpdatedRemindersCache.current[event.reminder.message_id] = event.reminder;
      setData(function (prevData) {
        return prevData.filter(function (item) {
          var _event$reminder2;
          return item.message_id !== ((_event$reminder2 = event.reminder) == null ? void 0 : _event$reminder2.message_id);
        });
      });
    };
    var handleReminderCreated = function handleReminderCreated(event) {
      setData(function (prevData) {
        if (!event.reminder) {
          return prevData;
        }
        var updatedData = [].concat((0, _toConsumableArray2.default)(prevData), [event.reminder]);
        return sortRemindersByDate(updatedData);
      });
    };
    var handleReminderUpdated = function handleReminderUpdated(event) {
      var reminder = event.reminder;
      if (!reminder || showAllReminders(client.reminders.paginator.filters)) {
        return;
      }
      deletedOrUpdatedRemindersCache.current[reminder.message_id] = reminder;
      setData(function (prevData) {
        var _event$reminder3, _event$reminder5;
        var existingReminder = prevData.find(function (item) {
          return item.message_id === (reminder == null ? void 0 : reminder.message_id);
        });
        if (!existingReminder) {
          return prevData;
        }
        if (existingReminder.remind_at && !((_event$reminder3 = event.reminder) != null && _event$reminder3.remind_at)) {
          return prevData.filter(function (item) {
            var _event$reminder4;
            return item.message_id !== ((_event$reminder4 = event.reminder) == null ? void 0 : _event$reminder4.message_id);
          });
        }
        if (!existingReminder.remind_at && (_event$reminder5 = event.reminder) != null && _event$reminder5.remind_at) {
          return prevData.filter(function (item) {
            var _event$reminder6;
            return item.message_id !== ((_event$reminder6 = event.reminder) == null ? void 0 : _event$reminder6.message_id);
          });
        }
        if (isReminderOverdue(existingReminder) && !isReminderOverdue(event.reminder)) {
          return prevData.filter(function (item) {
            var _event$reminder7;
            return item.message_id !== ((_event$reminder7 = event.reminder) == null ? void 0 : _event$reminder7.message_id);
          });
        }
        if (isReminderUpcoming(existingReminder) && !isReminderUpcoming(event.reminder)) {
          return prevData.filter(function (item) {
            var _event$reminder8;
            return item.message_id !== ((_event$reminder8 = event.reminder) == null ? void 0 : _event$reminder8.message_id);
          });
        }
        return prevData;
      });
    };
    var listeners = [client.on('reminder.created', handleReminderCreated), client.on('reminder.deleted', handleReminderDeleted), client.on('reminder.updated', handleReminderUpdated)];
    return function () {
      listeners.forEach(function (l) {
        return l.unsubscribe();
      });
    };
  }, [client]);
  var loadNext = (0, _react.useCallback)((0, _asyncToGenerator2.default)(function* () {
    yield client.reminders.queryNextReminders();
  }), [client.reminders]);
  return {
    data: data,
    isLoading: isLoading,
    loadNext: loadNext,
    setData: setData
  };
};
//# sourceMappingURL=useQueryReminders.js.map