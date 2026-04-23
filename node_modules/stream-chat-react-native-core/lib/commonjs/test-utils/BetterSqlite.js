var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BetterSqlite = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _betterSqlite = _interopRequireDefault(require("better-sqlite3"));
var _schema = require("../store/schema");
var _BetterSqlite;
var BetterSqlite = exports.BetterSqlite = (0, _createClass2.default)(function BetterSqlite() {
  (0, _classCallCheck2.default)(this, BetterSqlite);
  this.db = null;
});
_BetterSqlite = BetterSqlite;
BetterSqlite.openDB = function () {
  _BetterSqlite.db = new _betterSqlite.default('foobar.db');
};
BetterSqlite.closeDB = function () {
  _BetterSqlite.db.close();
};
BetterSqlite.getTables = (0, _asyncToGenerator2.default)(function* () {
  var tablesInDb = yield _BetterSqlite.db.pragma('table_list;');
  return tablesInDb;
});
BetterSqlite.dropAllTables = function () {
  var tableNames = Object.keys(_schema.tables);
  tableNames.forEach(function (name) {
    var stmt = _BetterSqlite.db.prepare(`DROP TABLE IF EXISTS ${name}`);
    stmt.run();
  });
};
BetterSqlite.selectFromTable = function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* (table) {
    var stmt = yield _BetterSqlite.db.prepare(`SELECT * FROM ${table}`);
    var result = stmt.all();
    return result;
  });
  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=BetterSqlite.js.map