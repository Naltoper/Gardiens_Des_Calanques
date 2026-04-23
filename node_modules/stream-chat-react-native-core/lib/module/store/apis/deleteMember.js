var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteMember = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _createDeleteQuery = require("../sqlite-utils/createDeleteQuery");
var _SqliteClient = require("../SqliteClient");
var deleteMember = exports.deleteMember = function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* (_ref) {
    var cid = _ref.cid,
      _ref$execute = _ref.execute,
      execute = _ref$execute === void 0 ? true : _ref$execute,
      member = _ref.member;
    var query = (0, _createDeleteQuery.createDeleteQuery)('members', {
      cid: cid,
      userId: member.user_id
    });
    _SqliteClient.SqliteClient.logger == null || _SqliteClient.SqliteClient.logger('info', 'deleteMember', {
      cid: cid,
      execute: execute,
      userId: member.user_id
    });
    if (execute) {
      yield _SqliteClient.SqliteClient.executeSql.apply(null, query);
    }
    return [query];
  });
  return function deleteMember(_x) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=deleteMember.js.map