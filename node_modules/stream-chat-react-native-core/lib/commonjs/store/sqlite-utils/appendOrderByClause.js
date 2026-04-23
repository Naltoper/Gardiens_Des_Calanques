Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.appendOrderByClause = void 0;
var appendOrderByClause = exports.appendOrderByClause = function appendOrderByClause(selectQuery, orderBy) {
  if (!orderBy) {
    return [selectQuery, []];
  }
  var orderByClause = [];
  for (var key in orderBy) {
    var order = orderBy[key];
    if (order === undefined) {
      continue;
    }
    orderByClause.push(`${key} ${order === 1 ? 'ASC' : 'DESC'}`);
  }
  if (!orderByClause.length) {
    return [selectQuery, []];
  }
  return [`${selectQuery} ORDER BY ${orderByClause.join(', ')}`];
};
//# sourceMappingURL=appendOrderByClause.js.map