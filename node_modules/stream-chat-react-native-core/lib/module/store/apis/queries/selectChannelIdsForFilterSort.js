var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectChannelIdsForFilterSort = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _createSelectQuery = require("../../sqlite-utils/createSelectQuery");
var _SqliteClient = require("../../SqliteClient");
var _convertFilterSortToQuery = require("../utils/convertFilterSortToQuery");
var selectChannelIdsForFilterSort = exports.selectChannelIdsForFilterSort = function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* (_ref) {
    var _results$;
    var filters = _ref.filters,
      sort = _ref.sort;
    var query = (0, _convertFilterSortToQuery.convertFilterSortToQuery)({
      filters: filters,
      sort: sort
    });
    _SqliteClient.SqliteClient.logger == null || _SqliteClient.SqliteClient.logger('info', 'selectChannelIdsForFilterSort', {
      query: query
    });
    var results = yield _SqliteClient.SqliteClient.executeSql.apply(null, (0, _createSelectQuery.createSelectQuery)('channelQueries', ['*'], {
      id: query
    }));
    var channelIdsStr = results == null || (_results$ = results[0]) == null ? void 0 : _results$.cids;
    return channelIdsStr ? JSON.parse(channelIdsStr) : null;
  });
  return function selectChannelIdsForFilterSort(_x) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=selectChannelIdsForFilterSort.js.map