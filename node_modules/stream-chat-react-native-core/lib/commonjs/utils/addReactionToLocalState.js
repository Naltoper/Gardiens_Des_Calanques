var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addReactionToLocalState = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _apis = require("../store/apis");
var addReactionToLocalState = exports.addReactionToLocalState = function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* (_ref) {
    var channel = _ref.channel,
      enforceUniqueReaction = _ref.enforceUniqueReaction,
      messageId = _ref.messageId,
      reactionType = _ref.reactionType,
      user = _ref.user;
    var message = channel.state.messages.find(function (_ref3) {
      var id = _ref3.id;
      return id === messageId;
    });
    if (!message) {
      return;
    }
    var reaction = {
      created_at: new Date().toISOString(),
      message_id: messageId,
      type: reactionType,
      updated_at: new Date().toISOString(),
      user: user,
      user_id: user == null ? void 0 : user.id
    };
    var hasOwnReaction = message.own_reactions && message.own_reactions.length > 0;
    var messageWithReaction = channel.state.addReaction(reaction, undefined, enforceUniqueReaction);
    if (!messageWithReaction) {
      return;
    }
    if (enforceUniqueReaction && hasOwnReaction) {
      yield (0, _apis.updateReaction)({
        message: messageWithReaction,
        reaction: reaction
      });
    } else {
      yield (0, _apis.insertReaction)({
        message: messageWithReaction,
        reaction: reaction
      });
    }
  });
  return function addReactionToLocalState(_x) {
    return _ref2.apply(this, arguments);
  };
}();
//# sourceMappingURL=addReactionToLocalState.js.map