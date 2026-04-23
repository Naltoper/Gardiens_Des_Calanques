var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.insertReaction = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _mapReactionToStorable = require("../mappers/mapReactionToStorable");
var _createUpdateQuery = require("../sqlite-utils/createUpdateQuery");
var _createUpsertQuery = require("../sqlite-utils/createUpsertQuery");
var _SqliteClient = require("../SqliteClient");
var insertReaction = exports.insertReaction = function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* (_ref) {
    var _ref$execute = _ref.execute,
      execute = _ref$execute === void 0 ? true : _ref$execute,
      message = _ref.message,
      reaction = _ref.reaction;
    var queries = [];
    var storableReaction = (0, _mapReactionToStorable.mapReactionToStorable)(reaction);
    queries.push((0, _createUpsertQuery.createUpsertQuery)('reactions', storableReaction));
    var stringifiedNewReactionGroups = JSON.stringify(message.reaction_groups);
    queries.push((0, _createUpdateQuery.createUpdateQuery)('messages', {
      reactionGroups: stringifiedNewReactionGroups
    }, {
      id: reaction.message_id
    }));
    _SqliteClient.SqliteClient.logger == null || _SqliteClient.SqliteClient.logger('info', 'insertReaction', {
      execute: execute,
      reaction: storableReaction
    });
    if (execute) {
      yield _SqliteClient.SqliteClient.executeSqlBatch(queries);
    }
    return queries;
  });
  return function insertReaction(_x) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=insertReaction.js.map