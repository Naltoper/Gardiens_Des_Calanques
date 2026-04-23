var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _structuredClone = _interopRequireDefault(require("@ungap/structured-clone"));
(function () {
  if (!window.structuredClone) {
    window.structuredClone = _structuredClone.default;
  }
  if (!Array.prototype.at) {
    Object.defineProperty(Array.prototype, 'at', {
      configurable: true,
      enumerable: false,
      value: function at(index) {
        var len = this.length;
        var relativeIndex = Number(index) || 0;
        if (relativeIndex < 0) {
          relativeIndex += len;
        }
        if (relativeIndex < 0 || relativeIndex >= len) {
          return undefined;
        }
        return this[relativeIndex];
      },
      writable: true
    });
  }
})();
//# sourceMappingURL=polyfills.js.map