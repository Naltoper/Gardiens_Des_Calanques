var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.upsertCidsForQuery = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _convertFilterSortToQuery = require("./utils/convertFilterSortToQuery");
var _createUpsertQuery = require("../sqlite-utils/createUpsertQuery");
var _SqliteClient = require("../SqliteClient");
var upsertCidsForQuery = exports.upsertCidsForQuery = function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* (_ref) {
    var cids = _ref.cids,
      filters = _ref.filters,
      _ref$execute = _ref.execute,
      execute = _ref$execute === void 0 ? true : _ref$execute,
      sort = _ref.sort;
    var cidsString = JSON.stringify(cids);
    var id = (0, _convertFilterSortToQuery.convertFilterSortToQuery)({
      filters: filters,
      sort: sort
    });
    var query = (0, _createUpsertQuery.createUpsertQuery)('channelQueries', {
      cids: cidsString,
      id: id
    });
    _SqliteClient.SqliteClient.logger == null || _SqliteClient.SqliteClient.logger('info', 'upsertCidsForQuery', {
      cids: cidsString,
      execute: execute,
      id: id
    });
    if (execute) {
      yield _SqliteClient.SqliteClient.executeSql.apply(null, query);
    }
    return [query];
  });
  return function upsertCidsForQuery(_x) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=upsertCidsForQuery.js.map