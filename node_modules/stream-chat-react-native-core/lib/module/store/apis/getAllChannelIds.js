var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllChannelIds = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _selectChannels = require("./queries/selectChannels");
var _SqliteClient = require("../SqliteClient");
var getAllChannelIds = exports.getAllChannelIds = function () {
  var _ref = (0, _asyncToGenerator2.default)(function* () {
    var channels = yield (0, _selectChannels.selectChannels)();
    _SqliteClient.SqliteClient.logger == null || _SqliteClient.SqliteClient.logger('info', 'getAllChannelIds');
    return channels.map(function (c) {
      return c.cid;
    });
  });
  return function getAllChannelIds() {
    return _ref.apply(this, arguments);
  };
}();
//# sourceMappingURL=getAllChannelIds.js.map