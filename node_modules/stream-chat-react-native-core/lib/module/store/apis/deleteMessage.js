var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteMessage = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _createDeleteQuery = require("../sqlite-utils/createDeleteQuery");
var _SqliteClient = require("../SqliteClient");
var deleteMessage = exports.deleteMessage = function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* (_ref) {
    var _ref$execute = _ref.execute,
      execute = _ref$execute === void 0 ? true : _ref$execute,
      id = _ref.id;
    var queries = [];
    queries.push((0, _createDeleteQuery.createDeleteQuery)('messages', {
      id: id
    }));
    _SqliteClient.SqliteClient.logger == null || _SqliteClient.SqliteClient.logger('info', 'deleteMessage', {
      execute: execute,
      id: id
    });
    if (execute) {
      yield _SqliteClient.SqliteClient.executeSqlBatch(queries);
    }
    return queries;
  });
  return function deleteMessage(_x) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=deleteMessage.js.map