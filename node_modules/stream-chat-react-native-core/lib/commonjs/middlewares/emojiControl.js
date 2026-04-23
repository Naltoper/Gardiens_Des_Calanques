var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTextComposerEmojiMiddleware = void 0;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _mergeWith = _interopRequireDefault(require("lodash/mergeWith"));
var _streamChat = require("stream-chat");
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2.default)(o), (0, _possibleConstructorReturn2.default)(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2.default)(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
var EmojiSearchSource = function (_BaseSearchSource) {
  function EmojiSearchSource(emojiSearchIndex, options) {
    var _this;
    (0, _classCallCheck2.default)(this, EmojiSearchSource);
    _this = _callSuper(this, EmojiSearchSource, [options]);
    _this.type = 'emoji';
    _this.emojiSearchIndex = emojiSearchIndex;
    return _this;
  }
  (0, _inherits2.default)(EmojiSearchSource, _BaseSearchSource);
  return (0, _createClass2.default)(EmojiSearchSource, [{
    key: "query",
    value: function () {
      var _query = (0, _asyncToGenerator2.default)(function* (searchQuery) {
        var _yield$this$emojiSear;
        if (searchQuery.length === 0) {
          return {
            items: [],
            next: null
          };
        }
        var emojis = (_yield$this$emojiSear = yield this.emojiSearchIndex.search(searchQuery)) != null ? _yield$this$emojiSear : [];
        return {
          items: emojis.filter(Boolean).slice(0, 7).map(function (_ref) {
            var _ref$emoticons = _ref.emoticons,
              emoticons = _ref$emoticons === void 0 ? [] : _ref$emoticons,
              id = _ref.id,
              name = _ref.name,
              native = _ref.native,
              _ref$skins = _ref.skins,
              skins = _ref$skins === void 0 ? [] : _ref$skins;
            var _skins = (0, _slicedToArray2.default)(skins, 1),
              firstSkin = _skins[0];
            return {
              emoticons: emoticons,
              id: id,
              name: name,
              native: native != null ? native : firstSkin.native
            };
          }),
          next: null
        };
      });
      function query(_x) {
        return _query.apply(this, arguments);
      }
      return query;
    }()
  }, {
    key: "filterQueryResults",
    value: function filterQueryResults(items) {
      var _this2 = this;
      return items.map(function (item) {
        return Object.assign({}, item, (0, _streamChat.getTokenizedSuggestionDisplayName)({
          displayName: item.id,
          searchToken: _this2.searchQuery
        }));
      });
    }
  }]);
}(_streamChat.BaseSearchSource);
var DEFAULT_OPTIONS = {
  minChars: 1,
  trigger: ':'
};
var createTextComposerEmojiMiddleware = exports.createTextComposerEmojiMiddleware = function createTextComposerEmojiMiddleware(_ref2) {
  var emojiSearchIndex = _ref2.emojiSearchIndex,
    options = _ref2.options;
  var finalOptions = (0, _mergeWith.default)(DEFAULT_OPTIONS, options != null ? options : {});
  var emojiSearchSource = new EmojiSearchSource(emojiSearchIndex);
  emojiSearchSource.activate();
  return {
    handlers: {
      onChange: function () {
        var _onChange = (0, _asyncToGenerator2.default)(function* (_ref3) {
          var complete = _ref3.complete,
            forward = _ref3.forward,
            next = _ref3.next,
            state = _ref3.state;
          if (!state.selection) {
            return forward();
          }
          var triggerWithToken = (0, _streamChat.getTriggerCharWithToken)({
            acceptTrailingSpaces: false,
            text: state.text.slice(0, state.selection.end),
            trigger: finalOptions.trigger
          });
          var triggerWasRemoved = !triggerWithToken || triggerWithToken.length < finalOptions.minChars;
          if (triggerWasRemoved) {
            var _state$suggestions;
            var hasSuggestionsForTrigger = ((_state$suggestions = state.suggestions) == null ? void 0 : _state$suggestions.trigger) === finalOptions.trigger;
            var newState = Object.assign({}, state);
            if (hasSuggestionsForTrigger && newState.suggestions) {
              delete newState.suggestions;
            }
            return next(newState);
          }
          var newSearchTriggerred = triggerWithToken && triggerWithToken === finalOptions.trigger;
          if (newSearchTriggerred) {
            emojiSearchSource.resetStateAndActivate();
          }
          var textWithReplacedWord = yield (0, _streamChat.replaceWordWithEntity)({
            caretPosition: state.selection.end,
            getEntityString: function () {
              var _getEntityString = (0, _asyncToGenerator2.default)(function* (word) {
                var _emoji$skins, _emoji$native;
                var _yield$emojiSearchSou = yield emojiSearchSource.query(word),
                  items = _yield$emojiSearchSou.items;
                var emoji = items.filter(Boolean).slice(0, 10).find(function (_ref4) {
                  var emoticons = _ref4.emoticons;
                  return !!(emoticons != null && emoticons.includes(word));
                });
                if (!emoji) {
                  return null;
                }
                var _ref5 = (_emoji$skins = emoji.skins) != null ? _emoji$skins : [],
                  _ref6 = (0, _slicedToArray2.default)(_ref5, 1),
                  firstSkin = _ref6[0];
                return (_emoji$native = emoji.native) != null ? _emoji$native : firstSkin.native;
              });
              function getEntityString(_x3) {
                return _getEntityString.apply(this, arguments);
              }
              return getEntityString;
            }(),
            text: state.text
          });
          if (textWithReplacedWord !== state.text) {
            return complete(Object.assign({}, state, {
              suggestions: undefined,
              text: textWithReplacedWord
            }));
          }
          return complete(Object.assign({}, state, {
            suggestions: {
              query: triggerWithToken.slice(1),
              searchSource: emojiSearchSource,
              trigger: finalOptions.trigger
            }
          }));
        });
        function onChange(_x2) {
          return _onChange.apply(this, arguments);
        }
        return onChange;
      }(),
      onSuggestionItemSelect: function onSuggestionItemSelect(_ref7) {
        var _state$change, _state$suggestions2;
        var complete = _ref7.complete,
          forward = _ref7.forward,
          state = _ref7.state;
        var _ref8 = (_state$change = state.change) != null ? _state$change : {},
          selectedSuggestion = _ref8.selectedSuggestion;
        if (!selectedSuggestion || ((_state$suggestions2 = state.suggestions) == null ? void 0 : _state$suggestions2.trigger) !== finalOptions.trigger) {
          return forward();
        }
        emojiSearchSource.resetStateAndActivate();
        return complete(Object.assign({}, state, (0, _streamChat.insertItemWithTrigger)({
          insertText: `${'native' in selectedSuggestion ? selectedSuggestion.native : ''} `,
          selection: state.selection,
          text: state.text,
          trigger: finalOptions.trigger
        }), {
          suggestions: undefined
        }));
      }
    },
    id: 'stream-io/react-native-sdk/emoji-middleware'
  };
};
//# sourceMappingURL=emojiControl.js.map