var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectMembersForChannels = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _schema = require("../../schema");
var _SqliteClient = require("../../SqliteClient");
var selectMembersForChannels = exports.selectMembersForChannels = function () {
  var _ref = (0, _asyncToGenerator2.default)(function* (cids) {
    var questionMarks = Array(cids.length).fill('?').join(',');
    var membersColumnNames = Object.keys(_schema.tables.members.columns).map(function (name) {
      return `'${name}', a.${name}`;
    }).join(', ');
    var userColumnNames = Object.keys(_schema.tables.users.columns).map(function (name) {
      return `'${name}', b.${name}`;
    }).join(', ');
    _SqliteClient.SqliteClient.logger == null || _SqliteClient.SqliteClient.logger('info', 'selectMembersForChannels', {
      cids: cids
    });
    var result = yield _SqliteClient.SqliteClient.executeSql(`SELECT
      json_object(
        'user', json_object(
          ${userColumnNames}
        ),
        ${membersColumnNames}
      ) as value
    FROM members a
    LEFT JOIN
      users b
    ON b.id = a.userId
    WHERE cid in (${questionMarks}) ORDER BY datetime(a.createdAt) DESC`, cids);
    return result.map(function (r) {
      return JSON.parse(r.value);
    });
  });
  return function selectMembersForChannels(_x) {
    return _ref.apply(this, arguments);
  };
}();
//# sourceMappingURL=selectMembersForChannels.js.map