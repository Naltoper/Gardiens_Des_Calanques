var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectDraftMessageFromDraft = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _schema = require("../../schema");
var _SqliteClient = require("../../SqliteClient");
var selectDraftMessageFromDraft = exports.selectDraftMessageFromDraft = function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* (_ref) {
    var cid = _ref.cid,
      parent_id = _ref.parent_id;
    var draftColumnNames = Object.keys(_schema.tables.draft.columns).map(function (name) {
      return `'${name}', a.${name}`;
    }).join(', ');
    var draftMessageColumnNames = Object.keys(_schema.tables.draftMessage.columns).map(function (name) {
      return `'${name}', b.${name}`;
    }).join(', ');
    _SqliteClient.SqliteClient.logger == null || _SqliteClient.SqliteClient.logger('info', 'selectDraftMessageFromDraft', {
      cid: cid,
      parent_id: parent_id
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
      WHERE a.cid = ? AND a.parentId is ?`, [cid, parent_id]);
    return result[0] ? JSON.parse(result[0].value) : undefined;
  });
  return function selectDraftMessageFromDraft(_x) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=selectDraftMessageFromDraft.js.map