var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.openUrlSafely = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _reactNative = require("react-native");
var openUrlSafely = exports.openUrlSafely = function () {
  var _ref = (0, _asyncToGenerator2.default)(function* (url) {
    var finalUrl = url;
    var pattern = new RegExp(/^\S+:\/\//);
    if (!pattern.test(finalUrl)) {
      finalUrl = 'http://' + url;
    }
    var supported = yield _reactNative.Linking.canOpenURL(finalUrl);
    if (supported) {
      _reactNative.Linking.openURL(finalUrl);
    } else {
      console.warn(`Don't know how to open URI: ${finalUrl}`);
    }
  });
  return function openUrlSafely(_x) {
    return _ref.apply(this, arguments);
  };
}();
//# sourceMappingURL=openUrlSafely.js.map