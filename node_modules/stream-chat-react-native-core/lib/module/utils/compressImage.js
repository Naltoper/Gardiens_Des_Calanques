var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compressedImageURI = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _native = require("../native");
var compressedImageURI = exports.compressedImageURI = function () {
  var _ref = (0, _asyncToGenerator2.default)(function* (image, compressImageQuality) {
    var uri = image.uri || '';
    var compressedUri = yield !image.height || !image.width || typeof compressImageQuality !== 'number' || compressImageQuality === 1 ? uri : _native.NativeHandlers.compressImage({
      compressImageQuality: compressImageQuality,
      height: image.height,
      uri: uri,
      width: image.width
    });
    return compressedUri;
  });
  return function compressedImageURI(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
//# sourceMappingURL=compressImage.js.map