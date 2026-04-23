var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectReactionsForMessages = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _schema = require("../../schema");
var _SqliteClient = require("../../SqliteClient");
var selectReactionsForMessages = exports.selectReactionsForMessages = function () {
  var _ref = (0, _asyncToGenerator2.default)(function* (messageIds) {
    var _sort$find;
    var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 25;
    var filters = arguments.length > 2 ? arguments[2] : undefined;
    var sort = arguments.length > 3 ? arguments[3] : undefined;
    var questionMarks = Array(messageIds.length).fill('?').join(',');
    var reactionsColumnNames = Object.keys(_schema.tables.reactions.columns).map(function (name) {
      return `'${name}', a.${name}`;
    }).join(', ');
    var userColumnNames = Object.keys(_schema.tables.users.columns).map(function (name) {
      return `'${name}', b.${name}`;
    }).join(', ');
    var filterValue = filters != null && filters.type ? [typeof filters.type === 'string' ? filters.type : filters.type.$eq] : [];
    var createdAtSort = Array.isArray(sort) ? (_sort$find = sort.find(function (s) {
      return !!s.created_at;
    })) == null ? void 0 : _sort$find.created_at : sort == null ? void 0 : sort.created_at;
    var orderByClause = createdAtSort ? `ORDER BY cast(strftime('%s', a.createdAt) AS INTEGER) ${createdAtSort === 1 ? 'ASC' : 'DESC'}` : '';
    _SqliteClient.SqliteClient.logger == null || _SqliteClient.SqliteClient.logger('info', 'selectReactionsForMessages', {
      messageIds: messageIds
    });
    var result = yield _SqliteClient.SqliteClient.executeSql(`SELECT
      json_object(
        'user', json_object(
          ${userColumnNames}
        ),
        ${reactionsColumnNames}
      ) as value
    FROM reactions a
    LEFT JOIN
      users b
    ON b.id = a.userId
    WHERE a.messageId in (${questionMarks}) ${filters != null && filters.type ? `AND a.type = ?` : ''}
    ${orderByClause}
    ${limit ? 'LIMIT ?' : ''}`, [].concat((0, _toConsumableArray2.default)(messageIds), filterValue, (0, _toConsumableArray2.default)(limit ? [limit] : [])));
    return result.map(function (r) {
      return JSON.parse(r.value);
    });
  });
  return function selectReactionsForMessages(_x) {
    return _ref.apply(this, arguments);
  };
}();
//# sourceMappingURL=selectReactionsForMessages.js.map