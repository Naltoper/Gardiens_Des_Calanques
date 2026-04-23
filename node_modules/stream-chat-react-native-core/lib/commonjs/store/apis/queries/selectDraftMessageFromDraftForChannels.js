var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectDraftMessageFromDraftForChannels = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _schema = require("../../schema");
var _SqliteClient = require("../../SqliteClient");
var selectDraftMessageFromDraftForChannels = exports.selectDraftMessageFromDraftForChannels = function () {
  var _ref = (0, _asyncToGenerator2.default)(function* (cids) {
    if (!cids || cids.length === 0) {
      return [];
    }
    var questionMarks = Array(cids.length).fill('?').join(',');
    var draftColumnNames = Object.keys(_schema.tables.draft.columns).map(function (name) {
      return `'${name}', a.${name}`;
    }).join(', ');
    var draftMessageColumnNames = Object.keys(_schema.tables.draftMessage.columns).map(function (name) {
      return `'${name}', b.${name}`;
    }).join(', ');
    _SqliteClient.SqliteClient.logger == null || _SqliteClient.SqliteClient.logger('info', 'selectDraftMessageFromDraftForChannels', {
      cids: cids
    });
    var result = yield _SqliteClient.SqliteClient.executeSql(`SELECT
      json_object(
        'draftMessage', json_object(
          ${draftMessageColumnNames}
        ),
        ${draftColumnNames}
      ) as value
    FROM draft a
    LEFT JOIN
      draftMessage b
    ON b.id = a.draftMessageId
    WHERE cid in (${questionMarks}) ORDER BY datetime(a.createdAt) DESC`, cids);
    return result.map(function (r) {
      return JSON.parse(r.value);
    });
  });
  return function selectDraftMessageFromDraftForChannels(_x) {
    return _ref.apply(this, arguments);
  };
}();
//# sourceMappingURL=selectDraftMessageFromDraftForChannels.js.map