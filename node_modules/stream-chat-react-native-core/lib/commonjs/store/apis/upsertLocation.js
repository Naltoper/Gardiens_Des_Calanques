var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.upsertLocation = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _mapSharedLocationToStorable = require("../mappers/mapSharedLocationToStorable");
var _createUpsertQuery = require("../sqlite-utils/createUpsertQuery");
var _SqliteClient = require("../SqliteClient");
var upsertLocation = exports.upsertLocation = function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* (_ref) {
    var _ref$execute = _ref.execute,
      execute = _ref$execute === void 0 ? true : _ref$execute,
      location = _ref.location;
    var queries = [];
    queries.push((0, _createUpsertQuery.createUpsertQuery)('locations', (0, _mapSharedLocationToStorable.mapSharedLocationToStorable)(location)));
    _SqliteClient.SqliteClient.logger == null || _SqliteClient.SqliteClient.logger('info', 'upsertLocation', {
      cid: location.channel_cid,
      execute: execute,
      location: location
    });
    if (execute) {
      yield _SqliteClient.SqliteClient.executeSqlBatch(queries);
    }
    return queries;
  });
  return function upsertLocation(_x) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=upsertLocation.js.map