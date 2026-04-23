var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getChannels = void 0;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _getChannelActiveLocations = require("./getChannelActiveLocations");
var _getChannelMessages = require("./getChannelMessages");
var _getDraftsForChannels = require("./getDraftsForChannels");
var _getMembers = require("./getMembers");
var _getReads = require("./getReads");
var _selectChannels = require("./queries/selectChannels");
var _mapStorableToChannel = require("../mappers/mapStorableToChannel");
var _SqliteClient = require("../SqliteClient");
var getChannels = exports.getChannels = function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* (_ref) {
    var channelIds = _ref.channelIds,
      currentUserId = _ref.currentUserId;
    _SqliteClient.SqliteClient.logger == null || _SqliteClient.SqliteClient.logger('info', 'getChannels', {
      channelIds: channelIds,
      currentUserId: currentUserId
    });
    var _yield$Promise$all = yield Promise.all([(0, _selectChannels.selectChannels)({
        channelIds: channelIds
      }), (0, _getDraftsForChannels.getDraftForChannels)({
        channelIds: channelIds,
        currentUserId: currentUserId
      }), (0, _getMembers.getMembers)({
        channelIds: channelIds
      }), (0, _getReads.getReads)({
        channelIds: channelIds
      }), (0, _getChannelMessages.getChannelMessages)({
        channelIds: channelIds,
        currentUserId: currentUserId
      }), (0, _getChannelActiveLocations.getChannelActiveLocations)({
        channelIds: channelIds
      })]),
      _yield$Promise$all2 = (0, _slicedToArray2.default)(_yield$Promise$all, 6),
      channels = _yield$Promise$all2[0],
      cidVsDraft = _yield$Promise$all2[1],
      cidVsMembers = _yield$Promise$all2[2],
      cidVsReads = _yield$Promise$all2[3],
      cidVsMessages = _yield$Promise$all2[4],
      cidVsActiveLocations = _yield$Promise$all2[5];
    return channels.map(function (c) {
      return Object.assign({}, (0, _mapStorableToChannel.mapStorableToChannel)(c), {
        active_live_locations: cidVsActiveLocations[c.cid] || [],
        draft: cidVsDraft[c.cid],
        members: cidVsMembers[c.cid] || [],
        membership: (cidVsMembers[c.cid] || []).find(function (member) {
          return member.user_id === currentUserId;
        }),
        messages: cidVsMessages[c.cid] || [],
        pinned_messages: [],
        read: cidVsReads[c.cid] || []
      });
    });
  });
  return function getChannels(_x) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=getChannels.js.map