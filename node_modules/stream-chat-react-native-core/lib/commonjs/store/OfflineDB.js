var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OfflineDB = void 0;
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _streamChat = require("stream-chat");
var api = _interopRequireWildcard(require("./apis"));
var _SqliteClient = require("./SqliteClient");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2.default)(o), (0, _possibleConstructorReturn2.default)(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2.default)(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
var OfflineDB = exports.OfflineDB = function (_AbstractOfflineDB) {
  function OfflineDB(_ref) {
    var _this;
    var client = _ref.client;
    (0, _classCallCheck2.default)(this, OfflineDB);
    _this = _callSuper(this, OfflineDB, [{
      client: client
    }]);
    _this.upsertCidsForQuery = api.upsertCidsForQuery;
    _this.upsertChannels = api.upsertChannels;
    _this.upsertUserSyncStatus = function (_ref2) {
      var userId = _ref2.userId,
        lastSyncedAt = _ref2.lastSyncedAt,
        execute = _ref2.execute;
      return api.upsertUserSyncStatus({
        currentUserId: userId,
        execute: execute,
        lastSyncedAt: lastSyncedAt
      });
    };
    _this.upsertAppSettings = function (_ref3) {
      var appSettings = _ref3.appSettings,
        userId = _ref3.userId,
        execute = _ref3.execute;
      return api.upsertAppSettings({
        appSettings: appSettings,
        currentUserId: userId,
        execute: execute
      });
    };
    _this.upsertPoll = api.upsertPoll;
    _this.upsertDraft = api.upsertDraft;
    _this.getDraft = api.getDraft;
    _this.deleteDraft = api.deleteDraft;
    _this.upsertChannelData = api.upsertChannelData;
    _this.upsertReads = api.upsertReads;
    _this.upsertMessages = api.upsertMessages;
    _this.upsertMembers = api.upsertMembers;
    _this.updateMessage = api.updateMessage;
    _this.getChannels = function (_ref4) {
      var cids = _ref4.cids,
        userId = _ref4.userId;
      return api.getChannels({
        channelIds: cids,
        currentUserId: userId
      });
    };
    _this.getChannelsForQuery = function (_ref5) {
      var userId = _ref5.userId,
        filters = _ref5.filters,
        sort = _ref5.sort;
      return api.getChannelsForFilterSort({
        currentUserId: userId,
        filters: filters,
        sort: sort
      });
    };
    _this.getAllChannelCids = api.getAllChannelIds;
    _this.getLastSyncedAt = function (_ref6) {
      var userId = _ref6.userId;
      return api.getLastSyncedAt({
        currentUserId: userId
      });
    };
    _this.getAppSettings = function (_ref7) {
      var userId = _ref7.userId;
      return api.getAppSettings({
        currentUserId: userId
      });
    };
    _this.getReactions = api.getReactionsForFilterSort;
    _this.addPendingTask = api.addPendingTask;
    _this.deletePendingTask = api.deletePendingTask;
    _this.deleteReaction = api.deleteReaction;
    _this.deleteMember = api.deleteMember;
    _this.deleteChannel = api.deleteChannel;
    _this.deleteMessagesForChannel = api.deleteMessagesForChannel;
    _this.dropPendingTasks = api.dropPendingTasks;
    _this.hardDeleteMessage = api.deleteMessage;
    _this.softDeleteMessage = api.softDeleteMessage;
    _this.getPendingTasks = api.getPendingTasks;
    _this.updateReaction = api.updateReaction;
    _this.insertReaction = api.insertReaction;
    _this.channelExists = api.channelExists;
    _this.resetDB = _SqliteClient.SqliteClient.resetDB;
    _this.executeSqlBatch = _SqliteClient.SqliteClient.executeSqlBatch;
    _this.initializeDB = _SqliteClient.SqliteClient.initializeDatabase;
    return _this;
  }
  (0, _inherits2.default)(OfflineDB, _AbstractOfflineDB);
  return (0, _createClass2.default)(OfflineDB);
}(_streamChat.AbstractOfflineDB);
//# sourceMappingURL=OfflineDB.js.map