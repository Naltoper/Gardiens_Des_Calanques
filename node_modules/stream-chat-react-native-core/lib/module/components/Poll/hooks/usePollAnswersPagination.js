var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.usePollAnswersPagination = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _react = require("react");
var _uniqBy = _interopRequireDefault(require("lodash/uniqBy"));
var _streamChat = require("stream-chat");
var _contexts = require("../../../contexts");
var usePollAnswersPagination = exports.usePollAnswersPagination = function usePollAnswersPagination() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    _ref$loadFirstPage = _ref.loadFirstPage,
    loadFirstPage = _ref$loadFirstPage === void 0 ? true : _ref$loadFirstPage,
    paginationParams = _ref.paginationParams;
  var _usePollContext = (0, _contexts.usePollContext)(),
    poll = _usePollContext.poll;
  var _useChatContext = (0, _contexts.useChatContext)(),
    client = _useChatContext.client;
  var _useState = (0, _react.useState)([]),
    _useState2 = (0, _slicedToArray2.default)(_useState, 2),
    pollAnswers = _useState2[0],
    setPollAnswers = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
    loading = _useState4[0],
    setLoading = _useState4[1];
  var _useState5 = (0, _react.useState)(),
    _useState6 = (0, _slicedToArray2.default)(_useState5, 2),
    error = _useState6[0],
    setError = _useState6[1];
  var cursorRef = (0, _react.useRef)(undefined);
  var queryInProgress = (0, _react.useRef)(false);
  var loadMore = (0, _react.useCallback)((0, _asyncToGenerator2.default)(function* () {
    if (cursorRef.current === null || queryInProgress.current) {
      return;
    }
    var next = cursorRef.current;
    setLoading(true);
    queryInProgress.current = true;
    try {
      var _yield$poll$queryAnsw = yield poll.queryAnswers({
          filter: paginationParams == null ? void 0 : paginationParams.filter,
          options: !next ? paginationParams == null ? void 0 : paginationParams.options : Object.assign({}, paginationParams == null ? void 0 : paginationParams.options, {
            next: next
          }),
          sort: Object.assign({
            updated_at: -1
          }, paginationParams == null ? void 0 : paginationParams.sort)
        }),
        newNext = _yield$poll$queryAnsw.next,
        answers = _yield$poll$queryAnsw.votes;
      cursorRef.current = newNext || null;
      setPollAnswers(function (prev) {
        return (0, _uniqBy.default)([].concat((0, _toConsumableArray2.default)(prev), (0, _toConsumableArray2.default)(answers)), 'id');
      });
    } catch (e) {
      setError(e);
    }
    queryInProgress.current = false;
    setLoading(false);
  }), [paginationParams, poll]);
  (0, _react.useEffect)(function () {
    if (!loadFirstPage || pollAnswers.length) {
      return;
    }
    loadMore();
  }, [loadFirstPage, loadMore, pollAnswers]);
  (0, _react.useEffect)(function () {
    var castedListeners = ['poll.vote_casted', 'poll.vote_changed'].map(function (eventName) {
      return client.on(eventName, function (event) {
        var _event$poll;
        if ((_event$poll = event.poll) != null && _event$poll.id && event.poll.id !== poll.id) {
          return;
        }
        var vote = event.poll_vote;
        if (vote && (0, _streamChat.isVoteAnswer)(vote)) {
          setPollAnswers([vote].concat((0, _toConsumableArray2.default)(pollAnswers.filter(function (answer) {
            return answer.id !== vote.id;
          }))));
        }
      });
    });
    var removedListener = client.on('poll.vote_removed', function (event) {
      var _event$poll2;
      if ((_event$poll2 = event.poll) != null && _event$poll2.id && event.poll.id !== poll.id) {
        return;
      }
      var vote = event.poll_vote;
      if (vote && (0, _streamChat.isVoteAnswer)(vote)) {
        setPollAnswers(pollAnswers.filter(function (item) {
          return item.id !== vote.id;
        }));
      }
    });
    return function () {
      castedListeners.forEach(function (listener) {
        return listener.unsubscribe();
      });
      removedListener.unsubscribe();
    };
  }, [client, poll, pollAnswers]);
  return {
    error: error,
    hasNextPage: cursorRef.current !== null,
    loading: loading,
    loadMore: loadMore,
    next: cursorRef.current,
    pollAnswers: pollAnswers
  };
};
//# sourceMappingURL=usePollAnswersPagination.js.map