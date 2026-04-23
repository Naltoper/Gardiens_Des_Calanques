Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOrCreateChannelApi = void 0;
var _utils = require("./utils");
var getOrCreateChannelApi = exports.getOrCreateChannelApi = function getOrCreateChannelApi() {
  var channel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    channel: {},
    draft: {},
    members: [],
    messages: [],
    pinnedMessages: [],
    read: []
  };
  var result = {
    channel: channel.channel,
    draft: channel.draft,
    duration: 0.01,
    members: channel.members,
    messages: channel.messages,
    pinnedMessages: channel.pinnedMessages,
    read: channel.read
  };
  return (0, _utils.mockedApiResponse)(result, 'post');
};
//# sourceMappingURL=getOrCreateChannel.js.map