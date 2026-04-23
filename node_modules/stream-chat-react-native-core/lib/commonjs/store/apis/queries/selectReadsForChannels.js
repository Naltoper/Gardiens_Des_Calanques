var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectReadsForChannels = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _schema = require("../../schema");
var _SqliteClient = require("../../SqliteClient");
var selectReadsForChannels = exports.selectReadsForChannels = function () {
  var _ref = (0, _asyncToGenerator2.default)(function* (cids) {
    var questionMarks = Array(cids.length).fill('?').join(',');
    var readsColumnNames = Object.keys(_schema.tables.reads.columns).map(function (name) {
      return `'${name}', a.${name}`;
    }).join(', ');
    var userColumnNames = Object.keys(_schema.tables.users.columns).map(function (name) {
      return `'${name}', b.${name}`;
    }).join(', ');
    _SqliteClient.SqliteClient.logger == null || _SqliteClient.SqliteClient.logger('info', 'selectReadsForChannels', {
      cids: cids
    });
    var result = yield _SqliteClient.SqliteClient.executeSql(`SELECT
      json_object(
        'user', json_object(
          ${userColumnNames}
        ),
        ${readsColumnNames}
      ) as value
    FROM reads a
    LEFT JOIN
      users b
    ON b.id = a.userId
    WHERE a.cid in (${questionMarks})`, cids);
    return result.map(function (r) {
      return JSON.parse(r.value);
    });
  });
  return function selectReadsForChannels(_x) {
    return _ref.apply(this, arguments);
  };
}();
//# sourceMappingURL=selectReadsForChannels.js.map