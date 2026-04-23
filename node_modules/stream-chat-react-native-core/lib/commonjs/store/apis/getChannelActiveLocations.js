var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getChannelActiveLocations = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _selectActiveLocationsForChannels = require("./queries/selectActiveLocationsForChannels");
var _mapStorableToSharedLocation = require("../mappers/mapStorableToSharedLocation");
var getChannelActiveLocations = exports.getChannelActiveLocations = function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* (_ref) {
    var channelIds = _ref.channelIds;
    var cidVsLiveLocations = {};
    var locations = yield (0, _selectActiveLocationsForChannels.selectActiveLocationsForChannels)(channelIds);
    locations.forEach(function (location) {
      if (!cidVsLiveLocations[location.channelCid]) {
        cidVsLiveLocations[location.channelCid] = [];
      }
      cidVsLiveLocations[location.channelCid].push((0, _mapStorableToSharedLocation.mapStorableToSharedLocation)(location));
    });
    return cidVsLiveLocations;
  });
  return function getChannelActiveLocations(_x) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=getChannelActiveLocations.js.map