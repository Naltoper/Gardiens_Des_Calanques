var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDraftForChannels = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _selectDraftMessageFromDraftForChannels = require("./queries/selectDraftMessageFromDraftForChannels");
var _selectMessageById = require("./queries/selectMessageById");
var _mapStorableToDraft = require("../mappers/mapStorableToDraft");
var _createSelectQuery = require("../sqlite-utils/createSelectQuery");
var _SqliteClient = require("../SqliteClient");
var getDraftForChannels = exports.getDraftForChannels = function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* (_ref) {
    var channelIds = _ref.channelIds,
      currentUserId = _ref.currentUserId;
    _SqliteClient.SqliteClient.logger == null || _SqliteClient.SqliteClient.logger('info', 'getDraftsForChannel', {
      channelIds: channelIds
    });
    var draftRowsWithMessage = yield (0, _selectDraftMessageFromDraftForChannels.selectDraftMessageFromDraftForChannels)(channelIds);
    var rowsWithoutParentID = draftRowsWithMessage.filter(function (row) {
      return row.parentId === null;
    });
    var cidVsDrafts = {};
    for (var row of rowsWithoutParentID) {
      var channelQuery = (0, _createSelectQuery.createSelectQuery)('channels', ['*'], {
        cid: row.cid
      });
      var channelRows = yield _SqliteClient.SqliteClient.executeSql.apply(null, channelQuery);
      var quotedMessageRow = yield (0, _selectMessageById.selectMessageForId)(row.quotedMessageId);
      var polls = yield _SqliteClient.SqliteClient.executeSql.apply(null, (0, _createSelectQuery.createSelectQuery)('poll', ['*'], {
        id: quotedMessageRow == null ? void 0 : quotedMessageRow.poll_id
      }));
      cidVsDrafts[row.cid] = (0, _mapStorableToDraft.mapStorableToDraft)({
        channelRow: channelRows[0],
        currentUserId: currentUserId,
        draftRow: row,
        pollRow: polls[0],
        quotedMessageRow: quotedMessageRow
      });
    }
    return cidVsDrafts;
  });
  return function getDraftForChannels(_x) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=getDraftsForChannels.js.map