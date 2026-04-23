var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.upsertMembers = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _mapMemberToStorable = require("../mappers/mapMemberToStorable");
var _mapUserToStorable = require("../mappers/mapUserToStorable");
var _createUpsertQuery = require("../sqlite-utils/createUpsertQuery");
var _SqliteClient = require("../SqliteClient");
var upsertMembers = exports.upsertMembers = function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* (_ref) {
    var cid = _ref.cid,
      _ref$execute = _ref.execute,
      execute = _ref$execute === void 0 ? true : _ref$execute,
      members = _ref.members;
    var queries = [];
    var storableUsers = [];
    var storableMembers = [];
    members == null || members.forEach(function (member) {
      if (member.user) {
        var storableUser = (0, _mapUserToStorable.mapUserToStorable)(member.user);
        storableUsers.push(storableUser);
        queries.push((0, _createUpsertQuery.createUpsertQuery)('users', storableUser));
      }
      var storableMember = (0, _mapMemberToStorable.mapMemberToStorable)({
        cid: cid,
        member: member
      });
      storableMembers.push(storableMember);
      queries.push((0, _createUpsertQuery.createUpsertQuery)('members', storableMember));
    });
    _SqliteClient.SqliteClient.logger == null || _SqliteClient.SqliteClient.logger('info', 'upsertMembers', {
      cid: cid,
      execute: execute,
      storableMembers: storableMembers,
      storableUsers: storableUsers
    });
    if (execute) {
      yield _SqliteClient.SqliteClient.executeSqlBatch(queries);
    }
    return queries;
  });
  return function upsertMembers(_x) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=upsertMembers.js.map