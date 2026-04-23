var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.upsertReads = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _mapReadToStorable = require("../mappers/mapReadToStorable");
var _mapUserToStorable = require("../mappers/mapUserToStorable");
var _createUpsertQuery = require("../sqlite-utils/createUpsertQuery");
var _SqliteClient = require("../SqliteClient");
var upsertReads = exports.upsertReads = function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* (_ref) {
    var cid = _ref.cid,
      _ref$execute = _ref.execute,
      execute = _ref$execute === void 0 ? true : _ref$execute,
      reads = _ref.reads;
    var queries = [];
    var storableReads = [];
    var storableUsers = [];
    reads == null || reads.forEach(function (read) {
      if (read.user) {
        storableUsers.push((0, _mapUserToStorable.mapUserToStorable)(read.user));
      }
      storableReads.push((0, _mapReadToStorable.mapReadToStorable)({
        cid: cid,
        read: read
      }));
    });
    queries.push.apply(queries, (0, _toConsumableArray2.default)(storableUsers.map(function (storableUser) {
      return (0, _createUpsertQuery.createUpsertQuery)('users', storableUser);
    })));
    queries.push.apply(queries, (0, _toConsumableArray2.default)(storableReads.map(function (storableRead) {
      return (0, _createUpsertQuery.createUpsertQuery)('reads', storableRead);
    })));
    _SqliteClient.SqliteClient.logger == null || _SqliteClient.SqliteClient.logger('info', 'upsertReads', {
      execute: execute,
      reads: storableReads,
      users: storableUsers
    });
    if (execute) {
      yield _SqliteClient.SqliteClient.executeSqlBatch(queries);
    }
    return queries;
  });
  return function upsertReads(_x) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=upsertReads.js.map