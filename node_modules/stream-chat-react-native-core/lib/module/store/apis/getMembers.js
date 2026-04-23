var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMembers = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _selectMembersForChannels = require("./queries/selectMembersForChannels");
var _mapStorableToMember = require("../mappers/mapStorableToMember");
var _SqliteClient = require("../SqliteClient");
var getMembers = exports.getMembers = function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* (_ref) {
    var channelIds = _ref.channelIds;
    _SqliteClient.SqliteClient.logger == null || _SqliteClient.SqliteClient.logger('info', 'getMembers', {
      channelIds: channelIds
    });
    var memberRows = yield (0, _selectMembersForChannels.selectMembersForChannels)(channelIds);
    var cidVsMembers = {};
    memberRows.forEach(function (member) {
      if (!cidVsMembers[member.cid]) {
        cidVsMembers[member.cid] = [];
      }
      cidVsMembers[member.cid].push((0, _mapStorableToMember.mapStorableToMember)(member));
    });
    return cidVsMembers;
  });
  return function getMembers(_x) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=getMembers.js.map