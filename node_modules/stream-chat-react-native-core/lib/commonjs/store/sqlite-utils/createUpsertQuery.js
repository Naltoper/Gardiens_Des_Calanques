Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createUpsertQuery = void 0;
var _schema = require("../schema");
var createUpsertQuery = exports.createUpsertQuery = function createUpsertQuery(table, row, conflictCheckKeys) {
  var filteredRow = {};
  for (var key in row) {
    if (row[key] !== undefined) {
      filteredRow[key] = row[key];
    }
  }
  var fields = Object.keys(filteredRow);
  var questionMarks = Array(Object.keys(fields).length).fill('?').join(',');
  var conflictKeys = conflictCheckKeys || _schema.tables[table].primaryKey || [];
  var conflictMatchersWithoutPK = fields.filter(function (f) {
    return !conflictKeys.includes(f);
  }).map(function (f) {
    return `${f}=excluded.${f}`;
  });
  var conflictConstraint = conflictKeys.length > 0 ? `ON CONFLICT(${conflictKeys.join(',')}) DO UPDATE SET
  ${conflictMatchersWithoutPK.join(',')}` : '';
  return [`INSERT INTO ${table} (${fields.join(',')}) VALUES (${questionMarks}) ${conflictConstraint}`, Object.values(filteredRow)];
};
//# sourceMappingURL=createUpsertQuery.js.map