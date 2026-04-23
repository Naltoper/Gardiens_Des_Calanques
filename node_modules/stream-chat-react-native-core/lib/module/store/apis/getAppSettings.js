var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAppSettings = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _createSelectQuery = require("../sqlite-utils/createSelectQuery");
var _SqliteClient = require("../SqliteClient");
var getAppSettings = exports.getAppSettings = function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* (_ref) {
    var _result$;
    var currentUserId = _ref.currentUserId;
    _SqliteClient.SqliteClient.logger == null || _SqliteClient.SqliteClient.logger('info', 'getAppSettings', {
      currentUserId: currentUserId
    });
    var result = yield _SqliteClient.SqliteClient.executeSql.apply(null, (0, _createSelectQuery.createSelectQuery)('userSyncStatus', ['*'], {
      userId: currentUserId
    }));
    return (_result$ = result[0]) != null && _result$.appSettings ? JSON.parse(result[0].appSettings) : null;
  });
  return function getAppSettings(_x) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=getAppSettings.js.map