var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractSortValue = void 0;
exports.findLastPinnedChannelIndex = findLastPinnedChannelIndex;
exports.findPinnedAtSortOrder = findPinnedAtSortOrder;
exports.shouldConsiderPinnedChannels = exports.shouldConsiderArchivedChannels = exports.isChannelPinned = exports.isChannelArchived = void 0;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var isChannelPinned = exports.isChannelPinned = function isChannelPinned(channel) {
  if (!channel) {
    return false;
  }
  var member = channel.state.membership;
  return !!(member != null && member.pinned_at);
};
var isChannelArchived = exports.isChannelArchived = function isChannelArchived(channel) {
  if (!channel) {
    return false;
  }
  var member = channel.state.membership;
  return !!(member != null && member.archived_at);
};
var shouldConsiderArchivedChannels = exports.shouldConsiderArchivedChannels = function shouldConsiderArchivedChannels(filters) {
  if (!filters) {
    return false;
  }
  return typeof filters.archived === 'boolean';
};
var extractSortValue = exports.extractSortValue = function extractSortValue(_ref) {
  var _option$targetKey, _option;
  var atIndex = _ref.atIndex,
    sort = _ref.sort,
    targetKey = _ref.targetKey;
  if (!sort) {
    return null;
  }
  var option = null;
  if (Array.isArray(sort)) {
    var _sort$atIndex;
    option = (_sort$atIndex = sort[atIndex]) != null ? _sort$atIndex : null;
  } else {
    var index = 0;
    for (var key in sort) {
      if (index !== atIndex) {
        index++;
        continue;
      }
      if (key !== targetKey) {
        return null;
      }
      option = sort;
      break;
    }
  }
  return (_option$targetKey = (_option = option) == null ? void 0 : _option[targetKey]) != null ? _option$targetKey : null;
};
var shouldConsiderPinnedChannels = exports.shouldConsiderPinnedChannels = function shouldConsiderPinnedChannels(sort) {
  var value = extractSortValue({
    atIndex: 0,
    sort: sort,
    targetKey: 'pinned_at'
  });
  if (typeof value !== 'number') {
    return false;
  }
  return Math.abs(value) === 1;
};
function findPinnedAtSortOrder(_ref2) {
  var sort = _ref2.sort;
  if (!sort) {
    return null;
  }
  if (Array.isArray(sort)) {
    var _sort = (0, _slicedToArray2.default)(sort, 1),
      option = _sort[0];
    if (!(option != null && option.pinned_at)) {
      return null;
    }
    return option.pinned_at;
  } else {
    if (!sort.pinned_at) {
      return null;
    }
    return sort.pinned_at;
  }
}
function findLastPinnedChannelIndex(_ref3) {
  var channels = _ref3.channels;
  var lastPinnedChannelIndex = null;
  for (var channel of channels) {
    if (!isChannelPinned(channel)) {
      break;
    }
    if (typeof lastPinnedChannelIndex === 'number') {
      lastPinnedChannelIndex++;
    } else {
      lastPinnedChannelIndex = 0;
    }
  }
  return lastPinnedChannelIndex;
}
//# sourceMappingURL=index.js.map