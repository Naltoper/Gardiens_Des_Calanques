var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.upsertPoll = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _mapPollToStorable = require("../mappers/mapPollToStorable");
var _createUpsertQuery = require("../sqlite-utils/createUpsertQuery");
var _SqliteClient = require("../SqliteClient");
var upsertPoll = exports.upsertPoll = function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* (_ref) {
    var _ref$execute = _ref.execute,
      execute = _ref$execute === void 0 ? true : _ref$execute,
      poll = _ref.poll;
    var queries = [];
    var storablePoll = (0, _mapPollToStorable.mapPollToStorable)(poll);
    queries.push((0, _createUpsertQuery.createUpsertQuery)('poll', storablePoll));
    _SqliteClient.SqliteClient.logger == null || _SqliteClient.SqliteClient.logger('info', 'upsertPoll', {
      poll: storablePoll
    });
    if (execute) {
      yield _SqliteClient.SqliteClient.executeSqlBatch(queries);
    }
    return queries;
  });
  return function upsertPoll(_x) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=upsertPoll.js.map