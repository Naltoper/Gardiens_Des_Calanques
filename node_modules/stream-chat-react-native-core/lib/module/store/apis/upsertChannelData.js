var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.upsertChannelData = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _mapChannelDataToStorable = require("../mappers/mapChannelDataToStorable");
var _createUpsertQuery = require("../sqlite-utils/createUpsertQuery");
var _SqliteClient = require("../SqliteClient");
var upsertChannelData = exports.upsertChannelData = function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* (_ref) {
    var channel = _ref.channel,
      _ref$execute = _ref.execute,
      execute = _ref$execute === void 0 ? true : _ref$execute;
    var storableChannel = (0, _mapChannelDataToStorable.mapChannelDataToStorable)(channel);
    var query = (0, _createUpsertQuery.createUpsertQuery)('channels', storableChannel);
    _SqliteClient.SqliteClient.logger == null || _SqliteClient.SqliteClient.logger('info', 'upsertChannelData', {
      channel: storableChannel,
      execute: execute
    });
    if (execute) {
      yield _SqliteClient.SqliteClient.executeSqlBatch([query]);
    }
    return [query];
  });
  return function upsertChannelData(_x) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=upsertChannelData.js.map