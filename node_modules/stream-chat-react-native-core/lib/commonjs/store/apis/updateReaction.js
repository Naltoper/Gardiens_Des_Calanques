var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateReaction = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _mapMessageToStorable2 = require("../mappers/mapMessageToStorable");
var _mapReactionToStorable = require("../mappers/mapReactionToStorable");
var _mapUserToStorable = require("../mappers/mapUserToStorable");
var _createDeleteQuery = require("../sqlite-utils/createDeleteQuery");
var _createUpdateQuery = require("../sqlite-utils/createUpdateQuery");
var _createUpsertQuery = require("../sqlite-utils/createUpsertQuery");
var _SqliteClient = require("../SqliteClient");
var updateReaction = exports.updateReaction = function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* (_ref) {
    var _ref$execute = _ref.execute,
      execute = _ref$execute === void 0 ? true : _ref$execute,
      message = _ref.message,
      reaction = _ref.reaction;
    var queries = [];
    var storableUser;
    if (reaction.user) {
      storableUser = (0, _mapUserToStorable.mapUserToStorable)(reaction.user);
      queries.push((0, _createUpsertQuery.createUpsertQuery)('users', (0, _mapUserToStorable.mapUserToStorable)(reaction.user)));
    }
    var storableReaction = (0, _mapReactionToStorable.mapReactionToStorable)(reaction);
    queries.push((0, _createDeleteQuery.createDeleteQuery)('reactions', {
      messageId: reaction.message_id,
      userId: reaction.user_id
    }));
    queries.push((0, _createUpsertQuery.createUpsertQuery)('reactions', storableReaction));
    var updatedReactionGroups;
    if (message.reaction_groups) {
      var _mapMessageToStorable = (0, _mapMessageToStorable2.mapMessageToStorable)(message),
        reactionGroups = _mapMessageToStorable.reactionGroups;
      updatedReactionGroups = reactionGroups;
      queries.push((0, _createUpdateQuery.createUpdateQuery)('messages', {
        reactionGroups: reactionGroups
      }, {
        id: message.id
      }));
    }
    _SqliteClient.SqliteClient.logger == null || _SqliteClient.SqliteClient.logger('info', 'updateReaction', {
      addedUser: storableUser,
      execute: execute,
      updatedReaction: storableReaction,
      updatedReactionGroups: updatedReactionGroups
    });
    if (execute) {
      yield _SqliteClient.SqliteClient.executeSqlBatch(queries);
    }
    return queries;
  });
  return function updateReaction(_x) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=updateReaction.js.map