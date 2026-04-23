var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteReaction = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _createDeleteQuery = require("../sqlite-utils/createDeleteQuery");
var _createUpdateQuery = require("../sqlite-utils/createUpdateQuery");
var _SqliteClient = require("../SqliteClient");
var deleteReaction = exports.deleteReaction = function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* (_ref) {
    var _ref$execute = _ref.execute,
      execute = _ref$execute === void 0 ? true : _ref$execute,
      message = _ref.message,
      reaction = _ref.reaction;
    var queries = [];
    if (!message) {
      return [];
    }
    queries.push((0, _createDeleteQuery.createDeleteQuery)('reactions', {
      messageId: reaction.message_id,
      type: reaction.type,
      userId: reaction.user_id
    }));
    var stringifiedNewReactionGroups = JSON.stringify(message.reaction_groups);
    queries.push((0, _createUpdateQuery.createUpdateQuery)('messages', {
      reactionGroups: stringifiedNewReactionGroups
    }, {
      id: message.id
    }));
    _SqliteClient.SqliteClient.logger == null || _SqliteClient.SqliteClient.logger('info', 'deleteReaction', {
      reaction: reaction
    });
    if (execute) {
      yield _SqliteClient.SqliteClient.executeSqlBatch(queries);
    }
    return queries;
  });
  return function deleteReaction(_x) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=deleteReaction.js.map