var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDraftAttachmentsCompositionMiddleware = exports.createAttachmentsCompositionMiddleware = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));
var _streamChat = require("stream-chat");
var _excluded = ["localMetadata"];
var localAttachmentToAttachment = function localAttachmentToAttachment(localAttachment) {
  var localMetadata = localAttachment.localMetadata,
    attachment = (0, _objectWithoutProperties2.default)(localAttachment, _excluded);
  if ((0, _streamChat.isLocalImageAttachment)(localAttachment)) {
    var isRemoteUri = !!attachment.image_url;
    if (isRemoteUri) return attachment;
    return Object.assign({}, attachment, {
      image_url: localMetadata == null ? void 0 : localMetadata.previewUri,
      originalFile: localMetadata.file
    });
  } else {
    var _isRemoteUri = !!attachment.asset_url;
    if (_isRemoteUri) return attachment;
    return Object.assign({}, attachment, {
      asset_url: localMetadata.file.uri,
      originalFile: localMetadata.file
    });
  }
};
var createAttachmentsCompositionMiddleware = exports.createAttachmentsCompositionMiddleware = function createAttachmentsCompositionMiddleware(composer) {
  return {
    handlers: {
      compose: function compose(_ref) {
        var _state$message$attach;
        var state = _ref.state,
          next = _ref.next,
          forward = _ref.forward;
        var attachmentManager = composer.attachmentManager;
        if (!attachmentManager) return forward();
        var attachments = ((_state$message$attach = state.message.attachments) != null ? _state$message$attach : []).concat(attachmentManager.attachments.map(localAttachmentToAttachment));
        if (!attachments.length) return forward();
        return next(Object.assign({}, state, {
          localMessage: Object.assign({}, state.localMessage, {
            attachments: (0, _toConsumableArray2.default)(attachments)
          }),
          message: Object.assign({}, state.message, {
            attachments: (0, _toConsumableArray2.default)(attachments)
          })
        }));
      }
    },
    id: 'stream-io/message-composer-middleware/attachments'
  };
};
var createDraftAttachmentsCompositionMiddleware = exports.createDraftAttachmentsCompositionMiddleware = function createDraftAttachmentsCompositionMiddleware(composer) {
  return {
    handlers: {
      compose: function compose(_ref2) {
        var _state$draft$attachme;
        var state = _ref2.state,
          next = _ref2.next,
          forward = _ref2.forward;
        var attachmentManager = composer.attachmentManager;
        if (!attachmentManager) return forward();
        var attachments = ((_state$draft$attachme = state.draft.attachments) != null ? _state$draft$attachme : []).concat(attachmentManager.attachments.map(localAttachmentToAttachment));
        return next(Object.assign({}, state, {
          draft: Object.assign({}, state.draft, {
            attachments: attachments
          })
        }));
      }
    },
    id: 'stream-io/message-composer-middleware/draft-attachments'
  };
};
//# sourceMappingURL=attachments.js.map