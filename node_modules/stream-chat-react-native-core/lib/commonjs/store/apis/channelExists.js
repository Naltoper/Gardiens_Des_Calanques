var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.channelExists = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _SqliteClient = require("../SqliteClient");
var channelExists = exports.channelExists = function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* (_ref) {
    var cid = _ref.cid;
    var channels = yield _SqliteClient.SqliteClient.executeSql('SELECT EXISTS(SELECT 1 FROM channels WHERE cid = ?)', [cid]);
    _SqliteClient.SqliteClient.logger == null || _SqliteClient.SqliteClient.logger('info', 'channelExists', {
      cid: cid
    });
    return channels.length > 0;
  });
  return function channelExists(_x) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=channelExists.js.map