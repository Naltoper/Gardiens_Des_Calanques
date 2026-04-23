var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteDraft = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _createDeleteQuery = require("../sqlite-utils/createDeleteQuery");
var _SqliteClient = require("../SqliteClient");
var deleteDraft = exports.deleteDraft = function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* (_ref) {
    var cid = _ref.cid,
      parent_id = _ref.parent_id,
      _ref$execute = _ref.execute,
      execute = _ref$execute === void 0 ? true : _ref$execute;
    var query = (0, _createDeleteQuery.createDeleteQuery)('draft', {
      cid: cid,
      parentId: parent_id
    });
    _SqliteClient.SqliteClient.logger == null || _SqliteClient.SqliteClient.logger('info', 'deleteDraft', {
      cid: cid,
      execute: execute
    });
    if (execute) {
      yield _SqliteClient.SqliteClient.executeSql.apply(null, query);
    }
    return [query];
  });
  return function deleteDraft(_x) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=deleteDraft.js.map