var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectChannels = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _createSelectQuery = require("../../sqlite-utils/createSelectQuery");
var _SqliteClient = require("../../SqliteClient");
var selectChannels = exports.selectChannels = function () {
  var _ref = (0, _asyncToGenerator2.default)(function* () {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      channelIds = _ref2.channelIds;
    var query = (0, _createSelectQuery.createSelectQuery)('channels', ['*'], channelIds ? {
      cid: channelIds
    } : undefined);
    _SqliteClient.SqliteClient.logger == null || _SqliteClient.SqliteClient.logger('info', 'selectChannels', {
      channelIds: channelIds
    });
    var result = yield _SqliteClient.SqliteClient.executeSql.apply(null, query);
    if (channelIds) {
      return result.sort(function (a, b) {
        return channelIds.indexOf(a.cid) - channelIds.indexOf(b.cid);
      });
    } else {
      return result;
    }
  });
  return function selectChannels() {
    return _ref.apply(this, arguments);
  };
}();
//# sourceMappingURL=selectChannels.js.map