Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertFilterSortToQuery = void 0;
var convertFilterSortToQuery = exports.convertFilterSortToQuery = function convertFilterSortToQuery(_ref) {
  var filters = _ref.filters,
    sort = _ref.sort;
  return JSON.stringify(`${filters ? JSON.stringify(filters) : ''}-${sort ? JSON.stringify(sort) : ''}`);
};
//# sourceMappingURL=convertFilterSortToQuery.js.map