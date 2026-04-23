var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteMessagesForChannel = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _SqliteClient = require("../SqliteClient");
var deleteMessagesForChannel = exports.deleteMessagesForChannel = function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* (_ref) {
    var cid = _ref.cid,
      truncated_at = _ref.truncated_at,
      _ref$execute = _ref.execute,
      execute = _ref$execute === void 0 ? true : _ref$execute;
    var timestamp = truncated_at ? new Date(truncated_at).toISOString() : new Date().toISOString();
    var query = [`DELETE FROM messages WHERE cid = ? AND createdAt <= ?`, [cid, timestamp]];
    _SqliteClient.SqliteClient.logger == null || _SqliteClient.SqliteClient.logger('info', 'deleteMessagesForChannel', {
      cid: cid,
      execute: execute,
      truncated_at: truncated_at
    });
    if (execute) {
      yield _SqliteClient.SqliteClient.executeSql.apply(null, query);
    }
    return [query];
  });
  return function deleteMessagesForChannel(_x) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=deleteMessagesForChannel.js.map