var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.upsertChannelDataFromChannel = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _mapChannelToStorable = require("../mappers/mapChannelToStorable");
var _createUpsertQuery = require("../sqlite-utils/createUpsertQuery");
var _SqliteClient = require("../SqliteClient");
var upsertChannelDataFromChannel = exports.upsertChannelDataFromChannel = function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* (_ref) {
    var channel = _ref.channel,
      _ref$execute = _ref.execute,
      execute = _ref$execute === void 0 ? true : _ref$execute;
    var storableChannel = (0, _mapChannelToStorable.mapChannelToStorable)(channel);
    if (!storableChannel) {
      return;
    }
    var query = (0, _createUpsertQuery.createUpsertQuery)('channels', storableChannel);
    if (execute) {
      yield _SqliteClient.SqliteClient.executeSqlBatch([query]);
    }
    return [query];
  });
  return function upsertChannelDataFromChannel(_x) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=upsertChannelDataFromChannel.js.map