var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectMessageForId = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _schema = require("../../schema");
var _SqliteClient = require("../../SqliteClient");
var selectMessageForId = exports.selectMessageForId = function () {
  var _ref = (0, _asyncToGenerator2.default)(function* (msgId) {
    if (!msgId) {
      return undefined;
    }
    var messagesColumnNames = Object.keys(_schema.tables.messages.columns).map(function (name) {
      return `'${name}', a.${name}`;
    }).join(', ');
    var userColumnNames = Object.keys(_schema.tables.users.columns).map(function (name) {
      return `'${name}', b.${name}`;
    }).join(', ');
    _SqliteClient.SqliteClient.logger == null || _SqliteClient.SqliteClient.logger('info', 'selectMessagesForId', {
      msgId: msgId
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
      *
      FROM messages
      WHERE id = ?
    ) a
    LEFT JOIN
      users b
    ON b.id = a.userId`, [msgId]);
    return result[0] ? JSON.parse(result[0].value) : undefined;
  });
  return function selectMessageForId(_x) {
    return _ref.apply(this, arguments);
  };
}();
//# sourceMappingURL=selectMessageById.js.map