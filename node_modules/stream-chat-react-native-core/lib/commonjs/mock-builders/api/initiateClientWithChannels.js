var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initiateClientWithChannels = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _getOrCreateChannel = require("./getOrCreateChannel");
var _useMockedApis = require("./useMockedApis");
var _channel = require("../generator/channel");
var _member = require("../generator/member");
var _user = require("../generator/user");
var _mock = require("../mock");
var initChannelFromData = function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* (_ref) {
    var channelData = _ref.channelData,
      client = _ref.client,
      defaultGenerateChannelOptions = _ref.defaultGenerateChannelOptions;
    var mockedChannelData = (0, _channel.generateChannel)(Object.assign({}, defaultGenerateChannelOptions, channelData));
    (0, _useMockedApis.useMockedApis)(client, [(0, _getOrCreateChannel.getOrCreateChannelApi)(mockedChannelData)]);
    var channel = client.channel(mockedChannelData.channel.type, mockedChannelData.channel.id);
    yield channel.watch();
    jest.spyOn(channel, 'getConfig').mockImplementation(function () {
      return mockedChannelData.channel.config;
    });
    return channel;
  });
  return function initChannelFromData(_x) {
    return _ref2.apply(this, arguments);
  };
}();
var initiateClientWithChannels = exports.initiateClientWithChannels = function () {
  var _ref3 = (0, _asyncToGenerator2.default)(function* () {
    var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      channelsData = _ref4.channelsData,
      customUser = _ref4.customUser;
    var user = customUser || (0, _user.generateUser)();
    var client = yield (0, _mock.getTestClientWithUser)(user);
    var defaultGenerateChannelOptions = {
      members: [(0, _member.generateMember)({
        user: user
      })]
    };
    var channels = yield Promise.all((channelsData != null ? channelsData : [defaultGenerateChannelOptions]).map(function (channelData) {
      return initChannelFromData({
        channelData: channelData,
        client: client,
        defaultGenerateChannelOptions: defaultGenerateChannelOptions
      });
    }));
    return {
      channels: channels,
      client: client
    };
  });
  return function initiateClientWithChannels() {
    return _ref3.apply(this, arguments);
  };
}();
//# sourceMappingURL=initiateClientWithChannels.js.map