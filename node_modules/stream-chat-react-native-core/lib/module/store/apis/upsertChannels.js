var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.upsertChannels = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _upsertDraft = require("./upsertDraft");
var _upsertLocation = require("./upsertLocation");
var _upsertMembers = require("./upsertMembers");
var _upsertMessages = require("./upsertMessages");
var _upsertReads = require("./upsertReads");
var _mapChannelDataToStorable = require("../mappers/mapChannelDataToStorable");
var _createUpsertQuery = require("../sqlite-utils/createUpsertQuery");
var _SqliteClient = require("../SqliteClient");
var upsertChannels = exports.upsertChannels = function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* (_ref) {
    var channels = _ref.channels,
      _ref$execute = _ref.execute,
      execute = _ref$execute === void 0 ? true : _ref$execute,
      isLatestMessagesSet = _ref.isLatestMessagesSet;
    var queries = [];
    var channelIds = channels.map(function (channel) {
      return channel.channel.cid;
    });
    _SqliteClient.SqliteClient.logger == null || _SqliteClient.SqliteClient.logger('info', 'upsertChannels', {
      channelIds: channelIds
    });
    var _loop = function* _loop() {
      queries.push((0, _createUpsertQuery.createUpsertQuery)('channels', (0, _mapChannelDataToStorable.mapChannelDataToStorable)(channel.channel)));
      var active_live_locations = channel.active_live_locations,
        draft = channel.draft,
        members = channel.members,
        membership = channel.membership,
        messages = channel.messages,
        read = channel.read;
      if (membership && !members.includes(function (m) {
        var _m$user, _membership$user;
        return ((_m$user = m.user) == null ? void 0 : _m$user.id) === ((_membership$user = membership.user) == null ? void 0 : _membership$user.id);
      })) {
        var _membership$user2;
        members.push(Object.assign({}, membership, {
          user_id: (_membership$user2 = membership.user) == null ? void 0 : _membership$user2.id
        }));
      }
      if (active_live_locations && active_live_locations.length > 0) {
        active_live_locations.forEach(function () {
          var _ref3 = (0, _asyncToGenerator2.default)(function* (location) {
            queries = queries.concat(yield (0, _upsertLocation.upsertLocation)({
              execute: false,
              location: location
            }));
          });
          return function (_x2) {
            return _ref3.apply(this, arguments);
          };
        }());
      }
      if (draft) {
        queries = queries.concat(yield (0, _upsertDraft.upsertDraft)({
          draft: draft,
          execute: false
        }));
      }
      queries = queries.concat(yield (0, _upsertMembers.upsertMembers)({
        cid: channel.channel.cid,
        execute: false,
        members: members
      }));
      if (read) {
        queries = queries.concat(yield (0, _upsertReads.upsertReads)({
          cid: channel.channel.cid,
          execute: false,
          reads: read
        }));
      }
      if (isLatestMessagesSet) {
        queries = queries.concat(yield (0, _upsertMessages.upsertMessages)({
          execute: false,
          messages: messages
        }));
      }
    };
    for (var channel of channels) {
      yield* _loop();
    }
    if (execute) {
      yield _SqliteClient.SqliteClient.executeSqlBatch(queries);
    }
    return queries;
  });
  return function upsertChannels(_x) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=upsertChannels.js.map