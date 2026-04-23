Object.defineProperty(exports, "__esModule", {
  value: true
});
var _LiveLocationManagerContext = require("./LiveLocationManagerContext");
Object.keys(_LiveLocationManagerContext).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _LiveLocationManagerContext[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _LiveLocationManagerContext[key];
    }
  });
});
var _useHandleLiveLocationEvents = require("./hooks/useHandleLiveLocationEvents");
Object.keys(_useHandleLiveLocationEvents).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _useHandleLiveLocationEvents[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _useHandleLiveLocationEvents[key];
    }
  });
});
//# sourceMappingURL=index.js.map