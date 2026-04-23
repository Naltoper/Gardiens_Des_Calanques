var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getReactionsForFilterSort = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _getReactions = require("./getReactions");
var _selectReactionsForMessages = require("./queries/selectReactionsForMessages");
var _SqliteClient = require("../SqliteClient");
var getReactionsForFilterSort = exports.getReactionsForFilterSort = function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* (_ref) {
    var messageId = _ref.messageId,
      filters = _ref.filters,
      sort = _ref.sort,
      limit = _ref.limit;
    if (!filters && !sort) {
      console.warn('Please provide the query (filters/sort) to fetch channels from DB');
      return null;
    }
    _SqliteClient.SqliteClient.logger == null || _SqliteClient.SqliteClient.logger('info', 'getReactionsForFilterSort', {
      filters: filters,
      sort: sort
    });
    var reactions = yield (0, _selectReactionsForMessages.selectReactionsForMessages)([messageId], limit, filters, sort);
    if (!reactions) {
      return null;
    }
    if (reactions.length === 0) {
      return [];
    }
    return (0, _getReactions.getReactions)({
      reactions: reactions
    });
  });
  return function getReactionsForFilterSort(_x) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=getReactionsforFilterSort.js.map