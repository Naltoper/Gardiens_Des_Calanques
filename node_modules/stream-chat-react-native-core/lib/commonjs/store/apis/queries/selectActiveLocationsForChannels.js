var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectActiveLocationsForChannels = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _SqliteClient = require("../../SqliteClient");
var selectActiveLocationsForChannels = exports.selectActiveLocationsForChannels = function () {
  var _ref = (0, _asyncToGenerator2.default)(function* (cids) {
    var questionMarks = Array(cids.length).fill('?').join(',');
    _SqliteClient.SqliteClient.logger == null || _SqliteClient.SqliteClient.logger('info', 'selectActiveLocationsForChannels', {
      cids: cids
    });
    var locations = yield _SqliteClient.SqliteClient.executeSql(`SELECT * FROM locations WHERE channelCid IN (${questionMarks}) AND endAt IS NOT NULL AND endAt > ?`, [].concat((0, _toConsumableArray2.default)(cids), [new Date().toISOString()]));
    return locations;
  });
  return function selectActiveLocationsForChannels(_x) {
    return _ref.apply(this, arguments);
  };
}();
//# sourceMappingURL=selectActiveLocationsForChannels.js.map