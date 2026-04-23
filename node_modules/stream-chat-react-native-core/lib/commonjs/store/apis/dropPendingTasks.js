var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dropPendingTasks = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _createDeleteQuery = require("../sqlite-utils/createDeleteQuery");
var _SqliteClient = require("../SqliteClient");
var dropPendingTasks = exports.dropPendingTasks = function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* (_ref) {
    var messageId = _ref.messageId,
      _ref$execute = _ref.execute,
      execute = _ref$execute === void 0 ? true : _ref$execute;
    var queries = [(0, _createDeleteQuery.createDeleteQuery)('pendingTasks', {
      messageId: messageId
    })];
    _SqliteClient.SqliteClient.logger == null || _SqliteClient.SqliteClient.logger('info', 'dropPendingTasks', {
      messageId: messageId
    });
    if (execute) {
      yield _SqliteClient.SqliteClient.executeSqlBatch(queries);
    }
    return queries;
  });
  return function dropPendingTasks(_x) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=dropPendingTasks.js.map