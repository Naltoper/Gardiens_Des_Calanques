var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteReactionsForMessage = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _createDeleteQuery = require("../sqlite-utils/createDeleteQuery");
var _SqliteClient = require("../SqliteClient");
var deleteReactionsForMessage = exports.deleteReactionsForMessage = function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* (_ref) {
    var _ref$execute = _ref.execute,
      execute = _ref$execute === void 0 ? true : _ref$execute,
      messageId = _ref.messageId;
    var query = (0, _createDeleteQuery.createDeleteQuery)('reactions', {
      messageId: messageId
    });
    console.log('deleteReactionsForMessage', {
      execute: execute,
      messageId: messageId
    });
    if (execute) {
      yield _SqliteClient.SqliteClient.executeSql.apply(null, query);
    }
    return [query];
  });
  return function deleteReactionsForMessage(_x) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=deleteReactions.js.map