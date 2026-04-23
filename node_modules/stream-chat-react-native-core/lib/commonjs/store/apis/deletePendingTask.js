var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deletePendingTask = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _createDeleteQuery = require("../sqlite-utils/createDeleteQuery");
var _SqliteClient = require("../SqliteClient");
var deletePendingTask = exports.deletePendingTask = function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* (_ref) {
    var id = _ref.id;
    var query = (0, _createDeleteQuery.createDeleteQuery)('pendingTasks', {
      id: id
    });
    _SqliteClient.SqliteClient.logger == null || _SqliteClient.SqliteClient.logger('info', 'deletePendingTask', {
      id: id
    });
    yield _SqliteClient.SqliteClient.executeSql.apply(null, query);
    return [query];
  });
  return function deletePendingTask(_x) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=deletePendingTask.js.map