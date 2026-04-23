var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.upsertUserSyncStatus = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _createUpsertQuery = require("../sqlite-utils/createUpsertQuery");
var _SqliteClient = require("../SqliteClient");
var upsertUserSyncStatus = exports.upsertUserSyncStatus = function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* (_ref) {
    var currentUserId = _ref.currentUserId,
      lastSyncedAt = _ref.lastSyncedAt,
      _ref$execute = _ref.execute,
      execute = _ref$execute === void 0 ? true : _ref$execute;
    var queries = [(0, _createUpsertQuery.createUpsertQuery)('userSyncStatus', {
      lastSyncedAt: lastSyncedAt,
      userId: currentUserId
    })];
    _SqliteClient.SqliteClient.logger == null || _SqliteClient.SqliteClient.logger('info', 'upsertUserSyncStatus', {
      lastSyncedAt: lastSyncedAt,
      userId: currentUserId
    });
    if (execute) {
      yield _SqliteClient.SqliteClient.executeSqlBatch(queries);
    }
    return queries;
  });
  return function upsertUserSyncStatus(_x) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=upsertUserSyncStatus.js.map