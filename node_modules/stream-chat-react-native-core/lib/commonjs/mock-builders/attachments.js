Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateVideoAttachment = exports.generateLocalFileUploadAttachmentData = exports.generateLocalAttachmentData = exports.generateImageAttachment = exports.generateFileReference = exports.generateFileAttachment = exports.generateAudioAttachment = void 0;
var _utils = require("../utils/utils");
var generateLocalAttachmentData = exports.generateLocalAttachmentData = function generateLocalAttachmentData() {
  return {
    localMetadata: {
      id: (0, _utils.generateRandomId)()
    }
  };
};
var generateLocalFileUploadAttachmentData = exports.generateLocalFileUploadAttachmentData = function generateLocalFileUploadAttachmentData(overrides, attachmentData) {
  var _overrides$file;
  return Object.assign({
    localMetadata: Object.assign({}, generateLocalAttachmentData().localMetadata, overrides, {
      file: generateFileReference((_overrides$file = overrides == null ? void 0 : overrides.file) != null ? _overrides$file : {})
    }),
    type: 'file'
  }, attachmentData);
};
var generateImageAttachment = exports.generateImageAttachment = function generateImageAttachment(a) {
  return Object.assign({
    fallback: (0, _utils.generateRandomId)() + '.png',
    image_url: 'https://' + (0, _utils.generateRandomId)() + '.png',
    type: 'image'
  }, a);
};
var generateAudioAttachment = exports.generateAudioAttachment = function generateAudioAttachment(a) {
  return Object.assign({
    asset_url: 'https://' + (0, _utils.generateRandomId)() + '.mp3',
    fallback: (0, _utils.generateRandomId)() + '.mp3',
    type: 'audio'
  }, a);
};
var generateFileAttachment = exports.generateFileAttachment = function generateFileAttachment(a) {
  return Object.assign({
    asset_url: 'https://' + (0, _utils.generateRandomId)() + '.xls',
    fallback: (0, _utils.generateRandomId)() + '.xls',
    type: 'file'
  }, a);
};
var generateVideoAttachment = exports.generateVideoAttachment = function generateVideoAttachment(a) {
  return Object.assign({
    fallback: (0, _utils.generateRandomId)() + '.mp4',
    image_url: 'https://' + (0, _utils.generateRandomId)() + '.mp4',
    type: 'video'
  }, a);
};
var fileName = (0, _utils.generateRandomId)() + '.png';
var generateFileReference = exports.generateFileReference = function generateFileReference(a) {
  return Object.assign({
    name: fileName,
    size: 1000,
    type: 'image/png',
    uri: 'file://' + (0, _utils.generateRandomId)() + '.png'
  }, a);
};
//# sourceMappingURL=attachments.js.map