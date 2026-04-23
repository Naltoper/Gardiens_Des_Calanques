var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getChannelsForFilterSort = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _getChannels = require("./getChannels");
var _selectChannelIdsForFilterSort = require("./queries/selectChannelIdsForFilterSort");
var _SqliteClient = require("../SqliteClient");
var getChannelsForFilterSort = exports.getChannelsForFilterSort = function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* (_ref) {
    var currentUserId = _ref.currentUserId,
      filters = _ref.filters,
      sort = _ref.sort;
    if (!filters && !sort) {
      console.warn('Please provide the query (filters/sort) to fetch channels from DB');
      return null;
    }
    _SqliteClient.SqliteClient.logger == null || _SqliteClient.SqliteClient.logger('info', 'getChannelsForFilterSort', {
      filters: filters,
      sort: sort
    });
    var channelIds = yield (0, _selectChannelIdsForFilterSort.selectChannelIdsForFilterSort)({
      filters: filters,
      sort: sort
    });
    if (!channelIds) {
      return null;
    }
    if (channelIds.length === 0) {
      return [];
    }
    return yield (0, _getChannels.getChannels)({
      channelIds: channelIds,
      currentUserId: currentUserId
    });
  });
  return function getChannelsForFilterSort(_x) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=getChannelsForFilterSort.js.map