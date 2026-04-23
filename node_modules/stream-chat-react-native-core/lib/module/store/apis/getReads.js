var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getReads = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _selectReadsForChannels = require("./queries/selectReadsForChannels");
var _mapStorableToRead = require("../mappers/mapStorableToRead");
var _SqliteClient = require("../SqliteClient");
var getReads = exports.getReads = function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* (_ref) {
    var channelIds = _ref.channelIds;
    _SqliteClient.SqliteClient.logger == null || _SqliteClient.SqliteClient.logger('info', 'getReads', {
      channelIds: channelIds
    });
    var reads = yield (0, _selectReadsForChannels.selectReadsForChannels)(channelIds);
    var cidVsReads = {};
    reads.forEach(function (read) {
      if (!cidVsReads[read.cid]) {
        cidVsReads[read.cid] = [];
      }
      cidVsReads[read.cid].push((0, _mapStorableToRead.mapStorableToRead)(read));
    });
    return cidVsReads;
  });
  return function getReads(_x) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=getReads.js.map