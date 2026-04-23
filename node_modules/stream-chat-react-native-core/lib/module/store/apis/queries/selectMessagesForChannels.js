var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectMessagesForChannels = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _schema = require("../../schema");
var _SqliteClient = require("../../SqliteClient");
var selectMessagesForChannels = exports.selectMessagesForChannels = function () {
  var _ref = (0, _asyncToGenerator2.default)(function* (cids) {
    var questionMarks = Array(cids.length).fill('?').join(',');
    var messagesColumnNames = Object.keys(_schema.tables.messages.columns).map(function (name) {
      return `'${name}', a.${name}`;
    }).join(', ');
    var userColumnNames = Object.keys(_schema.tables.users.columns).map(function (name) {
      return `'${name}', b.${name}`;
    }).join(', ');
    _SqliteClient.SqliteClient.logger == null || _SqliteClient.SqliteClient.logger('info', 'selectMessagesForChannels', {
      cids: cids
    });
    var result = yield _SqliteClient.SqliteClient.executeSql(`SELECT
      json_object(
        'user', json_object(
          ${userColumnNames}
        ),
        ${messagesColumnNames}
      ) as value
    FROM (
      SELECT
        *,
        ROW_NUMBER() OVER (
          PARTITION BY cid
          ORDER BY createdAt DESC
        ) RowNum
      FROM messages
      WHERE cid in (${questionMarks})
    ) a
    LEFT JOIN
      users b
    ON b.id = a.userId
    WHERE RowNum < 25
    ORDER BY a.createdAt ASC`, cids);
    return result.map(function (r) {
      return JSON.parse(r.value);
    });
  });
  return function selectMessagesForChannels(_x) {
    return _ref.apply(this, arguments);
  };
}();
//# sourceMappingURL=selectMessagesForChannels.js.map