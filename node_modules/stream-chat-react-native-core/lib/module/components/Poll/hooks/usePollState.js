var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.usePollState = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _react = require("react");
var _usePollStateStore2 = require("./usePollStateStore");
var _contexts = require("../../../contexts");
var selector = function selector(nextValue) {
  return {
    allowAnswers: nextValue.allow_answers,
    allowUserSuggestedOptions: nextValue.allow_user_suggested_options,
    answersCount: nextValue.answers_count,
    createdBy: nextValue.created_by,
    enforceUniqueVote: nextValue.enforce_unique_vote,
    isClosed: nextValue.is_closed,
    latestVotesByOption: nextValue.latest_votes_by_option,
    maxVotedOptionIds: nextValue.maxVotedOptionIds,
    maxVotesAllowed: nextValue.max_votes_allowed,
    name: nextValue.name,
    options: nextValue.options,
    ownAnswer: nextValue.ownAnswer,
    ownVotesByOptionId: nextValue.ownVotesByOptionId,
    voteCountsByOption: nextValue.vote_counts_by_option,
    votingVisibility: nextValue.voting_visibility
  };
};
var usePollState = exports.usePollState = function usePollState() {
  var _usePollContext = (0, _contexts.usePollContext)(),
    message = _usePollContext.message,
    poll = _usePollContext.poll;
  var _usePollStateStore = (0, _usePollStateStore2.usePollStateStore)(selector),
    allowAnswers = _usePollStateStore.allowAnswers,
    allowUserSuggestedOptions = _usePollStateStore.allowUserSuggestedOptions,
    answersCount = _usePollStateStore.answersCount,
    createdBy = _usePollStateStore.createdBy,
    enforceUniqueVote = _usePollStateStore.enforceUniqueVote,
    isClosed = _usePollStateStore.isClosed,
    latestVotesByOption = _usePollStateStore.latestVotesByOption,
    maxVotedOptionIds = _usePollStateStore.maxVotedOptionIds,
    maxVotesAllowed = _usePollStateStore.maxVotesAllowed,
    name = _usePollStateStore.name,
    options = _usePollStateStore.options,
    ownAnswer = _usePollStateStore.ownAnswer,
    ownVotesByOptionId = _usePollStateStore.ownVotesByOptionId,
    voteCountsByOption = _usePollStateStore.voteCountsByOption,
    votingVisibility = _usePollStateStore.votingVisibility;
  var addOption = (0, _react.useCallback)(function () {
    var _ref = (0, _asyncToGenerator2.default)(function* (optionText) {
      var _yield$poll$createOpt = yield poll.createOption({
          text: optionText
        }),
        poll_option = _yield$poll$createOpt.poll_option;
      yield poll.castVote(poll_option.id, message.id);
    });
    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }(), [message, poll]);
  var addComment = (0, _react.useCallback)(function (answerText) {
    return poll.addAnswer(answerText, message.id);
  }, [message.id, poll]);
  var endVote = (0, _react.useCallback)(function () {
    return poll.close();
  }, [poll]);
  return {
    addComment: addComment,
    addOption: addOption,
    allowAnswers: allowAnswers,
    allowUserSuggestedOptions: allowUserSuggestedOptions,
    answersCount: answersCount,
    createdBy: createdBy,
    endVote: endVote,
    enforceUniqueVote: enforceUniqueVote,
    isClosed: isClosed,
    latestVotesByOption: latestVotesByOption,
    maxVotedOptionIds: maxVotedOptionIds,
    maxVotesAllowed: maxVotesAllowed,
    name: name,
    options: options,
    ownAnswer: ownAnswer,
    ownVotesByOptionId: ownVotesByOptionId,
    voteCountsByOption: voteCountsByOption,
    votingVisibility: votingVisibility
  };
};
//# sourceMappingURL=usePollState.js.map