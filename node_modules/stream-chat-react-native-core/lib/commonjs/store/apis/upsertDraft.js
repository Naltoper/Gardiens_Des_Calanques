var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.upsertDraft = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _upsertMessages = require("./upsertMessages");
var _mapDraftMessageToStorable = require("../mappers/mapDraftMessageToStorable");
var _mapDraftToStorable = require("../mappers/mapDraftToStorable");
var _createDeleteQuery = require("../sqlite-utils/createDeleteQuery");
var _createUpsertQuery = require("../sqlite-utils/createUpsertQuery");
var _SqliteClient = require("../SqliteClient");
var upsertDraft = exports.upsertDraft = function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* (_ref) {
    var _ref$execute = _ref.execute,
      execute = _ref$execute === void 0 ? true : _ref$execute,
      draft = _ref.draft;
    var queries = [];
    var channel_cid = draft.channel_cid,
      parent_id = draft.parent_id,
      message = draft.message;
    var deleteQuery = (0, _createDeleteQuery.createDeleteQuery)('draft', {
      cid: channel_cid,
      parentId: parent_id
    });
    queries.push(deleteQuery);
    var storableDraftMessage = (0, _mapDraftMessageToStorable.mapDraftMessageToStorable)({
      draftMessage: message
    });
    queries.push((0, _createUpsertQuery.createUpsertQuery)('draftMessage', storableDraftMessage));
    var storableDraft = (0, _mapDraftToStorable.mapDraftToStorable)({
      draft: draft
    });
    queries.push((0, _createUpsertQuery.createUpsertQuery)('draft', storableDraft));
    _SqliteClient.SqliteClient.logger == null || _SqliteClient.SqliteClient.logger('info', 'upsertDraft', {
      draftMessage: storableDraftMessage
    });
    var messagesToUpsert = [];
    if (draft.quoted_message) {
      messagesToUpsert.push(draft.quoted_message);
    }
    if (draft.parent_message) {
      messagesToUpsert.push(draft.parent_message);
    }
    if (messagesToUpsert.length > 0) {
      var query = yield (0, _upsertMessages.upsertMessages)({
        execute: false,
        messages: messagesToUpsert
      });
      queries.concat(query);
    }
    if (execute) {
      yield _SqliteClient.SqliteClient.executeSqlBatch(queries);
    }
    return queries;
  });
  return function upsertDraft(_x) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=upsertDraft.js.map