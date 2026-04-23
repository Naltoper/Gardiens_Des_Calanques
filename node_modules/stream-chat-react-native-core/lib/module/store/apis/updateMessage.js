var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateMessage = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _mapMessageToStorable = require("../mappers/mapMessageToStorable");
var _mapReactionToStorable = require("../mappers/mapReactionToStorable");
var _mapUserToStorable = require("../mappers/mapUserToStorable");
var _createSelectQuery = require("../sqlite-utils/createSelectQuery");
var _createUpdateQuery = require("../sqlite-utils/createUpdateQuery");
var _createUpsertQuery = require("../sqlite-utils/createUpsertQuery");
var _SqliteClient = require("../SqliteClient");
var updateMessage = exports.updateMessage = function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* (_ref) {
    var _ref$execute = _ref.execute,
      execute = _ref$execute === void 0 ? true : _ref$execute,
      message = _ref.message;
    var queries = [];
    var messages = yield _SqliteClient.SqliteClient.executeSql.apply(null, (0, _createSelectQuery.createSelectQuery)('messages', ['*'], {
      id: message.id
    }));
    if (messages.length === 0) {
      return queries;
    }
    var storableMessage = (0, _mapMessageToStorable.mapMessageToStorable)(Object.assign({}, message));
    queries.push((0, _createUpdateQuery.createUpdateQuery)('messages', storableMessage, {
      id: message.id
    }));
    var storableUsers = [];
    if (message.user) {
      var storableUser = (0, _mapUserToStorable.mapUserToStorable)(message.user);
      storableUsers.push(storableUser);
      queries.push((0, _createUpsertQuery.createUpsertQuery)('users', storableUser));
    }
    var latestReactions = message.latest_reactions || [];
    var ownReactions = message.own_reactions || [];
    var storableReactions = [];
    [].concat((0, _toConsumableArray2.default)(latestReactions), (0, _toConsumableArray2.default)(ownReactions)).forEach(function (r) {
      if (r.user) {
        var _storableUser = (0, _mapUserToStorable.mapUserToStorable)(r.user);
        storableUsers.push(_storableUser);
        queries.push((0, _createUpsertQuery.createUpsertQuery)('users', _storableUser));
      }
      var storableReaction = (0, _mapReactionToStorable.mapReactionToStorable)(r);
      storableReactions.push(storableReaction);
      queries.push((0, _createUpsertQuery.createUpsertQuery)('reactions', storableReaction));
    });
    _SqliteClient.SqliteClient.logger == null || _SqliteClient.SqliteClient.logger('info', 'updateMessage', {
      message: storableMessage,
      reactions: storableReactions,
      users: storableUsers
    });
    if (execute) {
      yield _SqliteClient.SqliteClient.executeSqlBatch(queries);
    }
    return queries;
  });
  return function updateMessage(_x) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=updateMessage.js.map