var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDraft = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _selectDraftMessageFromDraft = require("./queries/selectDraftMessageFromDraft");
var _selectMessageById = require("./queries/selectMessageById");
var _mapStorableToDraft = require("../mappers/mapStorableToDraft");
var _createSelectQuery = require("../sqlite-utils/createSelectQuery");
var _SqliteClient = require("../SqliteClient");
var getDraft = exports.getDraft = function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* (_ref) {
    var cid = _ref.cid,
      userId = _ref.userId,
      parent_id = _ref.parent_id;
    _SqliteClient.SqliteClient.logger == null || _SqliteClient.SqliteClient.logger('info', 'getDraft', {
      cid: cid,
      parent_id: parent_id
    });
    try {
      var draftRowsWithMessage = yield (0, _selectDraftMessageFromDraft.selectDraftMessageFromDraft)({
        cid: cid,
        parent_id: parent_id != null ? parent_id : null
      });
      if (!draftRowsWithMessage) return null;
      var draftRowWithMessage = draftRowsWithMessage;
      if (!draftRowWithMessage) {
        return null;
      }
      var channelQuery = (0, _createSelectQuery.createSelectQuery)('channels', ['*'], {
        cid: cid
      });
      var channelRows = yield _SqliteClient.SqliteClient.executeSql.apply(null, channelQuery);
      var quotedMessageRows = yield (0, _selectMessageById.selectMessageForId)(draftRowWithMessage.quotedMessageId);
      var polls = yield _SqliteClient.SqliteClient.executeSql.apply(null, (0, _createSelectQuery.createSelectQuery)('poll', ['*'], {
        id: quotedMessageRows == null ? void 0 : quotedMessageRows.poll_id
      }));
      return (0, _mapStorableToDraft.mapStorableToDraft)({
        channelRow: channelRows[0],
        currentUserId: userId,
        draftRow: draftRowWithMessage,
        pollRow: polls[0],
        quotedMessageRow: quotedMessageRows
      });
    } catch (error) {
      console.error('Error in getDraft:', error);
      throw error;
    }
  });
  return function getDraft(_x) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=getDraft.js.map