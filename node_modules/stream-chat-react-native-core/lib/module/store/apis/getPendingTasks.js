var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPendingTasks = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _mapStorableToTask = require("../mappers/mapStorableToTask");
var _createSelectQuery = require("../sqlite-utils/createSelectQuery");
var _SqliteClient = require("../SqliteClient");
var getPendingTasks = exports.getPendingTasks = function () {
  var _ref = (0, _asyncToGenerator2.default)(function* () {
    var conditions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var query = (0, _createSelectQuery.createSelectQuery)('pendingTasks', ['*'], conditions, {
      createdAt: 1
    });
    _SqliteClient.SqliteClient.logger == null || _SqliteClient.SqliteClient.logger('info', 'getPendingTasks', {
      conditions: conditions
    });
    var result = yield _SqliteClient.SqliteClient.executeSql.apply(null, query);
    return result.map(function (r) {
      return (0, _mapStorableToTask.mapStorableToTask)(r);
    });
  });
  return function getPendingTasks() {
    return _ref.apply(this, arguments);
  };
}();
//# sourceMappingURL=getPendingTasks.js.map