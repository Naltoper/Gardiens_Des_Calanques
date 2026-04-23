var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.upsertAppSettings = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _createUpsertQuery = require("../sqlite-utils/createUpsertQuery");
var _SqliteClient = require("../SqliteClient");
var upsertAppSettings = exports.upsertAppSettings = function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* (_ref) {
    var appSettings = _ref.appSettings,
      currentUserId = _ref.currentUserId,
      _ref$execute = _ref.execute,
      execute = _ref$execute === void 0 ? true : _ref$execute;
    var storableAppSettings = JSON.stringify(appSettings);
    var queries = [(0, _createUpsertQuery.createUpsertQuery)('userSyncStatus', {
      appSettings: storableAppSettings,
      userId: currentUserId
    })];
    _SqliteClient.SqliteClient.logger == null || _SqliteClient.SqliteClient.logger('info', 'upsertAppSettings', {
      appSettings: storableAppSettings,
      execute: execute,
      userId: currentUserId
    });
    if (execute) {
      yield _SqliteClient.SqliteClient.executeSqlBatch(queries);
    }
    return queries;
  });
  return function upsertAppSettings(_x) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=upsertAppSettings.js.map