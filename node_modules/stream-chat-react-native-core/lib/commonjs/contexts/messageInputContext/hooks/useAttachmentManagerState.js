Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAttachmentManagerState = void 0;
var _useMessageComposer2 = require("./useMessageComposer");
var _useStateStore2 = require("../../../hooks/useStateStore");
var stateSelector = function stateSelector(state) {
  return {
    attachments: state.attachments
  };
};
var useAttachmentManagerState = exports.useAttachmentManagerState = function useAttachmentManagerState() {
  var _useMessageComposer = (0, _useMessageComposer2.useMessageComposer)(),
    attachmentManager = _useMessageComposer.attachmentManager;
  var _useStateStore = (0, _useStateStore2.useStateStore)(attachmentManager.state, stateSelector),
    attachments = _useStateStore.attachments;
  return {
    attachments: attachments,
    availableUploadSlots: attachmentManager.availableUploadSlots,
    blockedUploadsCount: attachmentManager.blockedUploadsCount,
    failedUploadsCount: attachmentManager.failedUploadsCount,
    isUploadEnabled: attachmentManager.isUploadEnabled,
    pendingUploadsCount: attachmentManager.pendingUploadsCount,
    successfulUploadsCount: attachmentManager.successfulUploadsCount,
    uploadsInProgressCount: attachmentManager.uploadsInProgressCount
  };
};
//# sourceMappingURL=useAttachmentManagerState.js.map