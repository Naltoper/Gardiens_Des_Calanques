var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addPendingTask = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _mapTaskToStorable = require("../mappers/mapTaskToStorable");
var _createDeleteQuery = require("../sqlite-utils/createDeleteQuery");
var _createUpsertQuery = require("../sqlite-utils/createUpsertQuery");
var _SqliteClient = require("../SqliteClient");
var addPendingTask = exports.addPendingTask = function () {
  var _ref = (0, _asyncToGenerator2.default)(function* (task) {
    var storable = (0, _mapTaskToStorable.mapTaskToStorable)(task);
    var channelId = storable.channelId,
      channelType = storable.channelType,
      threadId = storable.threadId,
      payload = storable.payload,
      type = storable.type;
    var queries = [];
    if (type === 'create-draft' || type === 'delete-draft') {
      queries.push((0, _createDeleteQuery.createDeleteQuery)('pendingTasks', {
        channelId: channelId,
        channelType: channelType,
        threadId: threadId,
        type: ['create-draft', 'delete-draft']
      }));
    }
    queries.push((0, _createUpsertQuery.createUpsertQuery)('pendingTasks', storable));
    _SqliteClient.SqliteClient.logger == null || _SqliteClient.SqliteClient.logger('info', 'addPendingTask', {
      channelId: channelId,
      channelType: channelType,
      id: task.id,
      type: type
    });
    yield _SqliteClient.SqliteClient.executeSqlBatch(queries);
    return (0, _asyncToGenerator2.default)(function* () {
      _SqliteClient.SqliteClient.logger == null || _SqliteClient.SqliteClient.logger('info', 'deletePendingTaskAfterAddition', {
        channelId: channelId,
        channelType: channelType,
        id: task.id,
        type: type
      });
      var query = (0, _createDeleteQuery.createDeleteQuery)('pendingTasks', {
        channelId: channelId,
        channelType: channelType,
        payload: payload,
        type: type
      });
      yield _SqliteClient.SqliteClient.executeSqlBatch([query]);
    });
  });
  return function addPendingTask(_x) {
    return _ref.apply(this, arguments);
  };
}();
//# sourceMappingURL=addPendingTask.js.map