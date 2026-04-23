var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sqliteMock = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _betterSqlite = _interopRequireDefault(require("better-sqlite3"));
var db;
var sqliteMock = exports.sqliteMock = {
  open: function open() {
    db = new _betterSqlite.default('foobar.db');
    return {
      close: function close() {
        db.close();
        return {
          message: '',
          status: 0
        };
      },
      execute: function () {
        var _execute = (0, _asyncToGenerator2.default)(function* (queryInput, params) {
          var query = queryInput.trim().toLowerCase();
          var stmt = db.prepare(query);
          var result = [];
          if (query.indexOf('select') === 0) {
            var modifiedParams = (params == null ? void 0 : params.map(function (p) {
              return typeof p === 'boolean' ? Number(p) : p;
            })) || [];
            result = yield new Promise(function (resolve) {
              return resolve(stmt.all(modifiedParams));
            });
            return {
              message: '',
              rows: result,
              status: 0
            };
          }
          if (query.indexOf('pragma') === 0) {
            var pragmaQueryTokens = query.split(' ');
            if (pragmaQueryTokens[2] === '=') {
              db.pragma(`${pragmaQueryTokens[1]} = ${pragmaQueryTokens[3]}`);
            } else {
              result = db.pragma(`${pragmaQueryTokens[1]}`);
            }
            return {
              message: '',
              rows: result,
              status: 0
            };
          }
          yield new Promise(function (resolve) {
            if (params) {
              var _modifiedParams = params.map(function (p) {
                return typeof p === 'boolean' ? Number(p) : p;
              });
              stmt.run(_modifiedParams);
            } else {
              stmt.run();
            }
            resolve(undefined);
          });
          return {
            message: '',
            rows: result,
            status: 0
          };
        });
        function execute(_x, _x2) {
          return _execute.apply(this, arguments);
        }
        return execute;
      }(),
      executeBatch: function () {
        var _executeBatch = (0, _asyncToGenerator2.default)(function* (queriesArr) {
          var _loop = function* _loop() {
            var query = queryAndParams[0];
            var params = queryAndParams[1];
            var stmt = db.prepare(query);
            yield new Promise(function (resolve) {
              if (params) {
                var modifiedParams = params.map(function (p) {
                  return typeof p === 'boolean' ? Number(p) : p;
                });
                stmt.run(modifiedParams);
              } else {
                stmt.run();
              }
              resolve(undefined);
            });
          };
          for (var queryAndParams of queriesArr) {
            yield* _loop();
          }
          return {
            message: '',
            staus: 0
          };
        });
        function executeBatch(_x3) {
          return _executeBatch.apply(this, arguments);
        }
        return executeBatch;
      }()
    };
  }
};
//# sourceMappingURL=mock.js.map