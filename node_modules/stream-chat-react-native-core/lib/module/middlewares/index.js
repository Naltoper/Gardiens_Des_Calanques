Object.defineProperty(exports, "__esModule", {
  value: true
});
var _attachments = require("./attachments");
Object.keys(_attachments).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _attachments[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _attachments[key];
    }
  });
});
var _emojiControl = require("./emojiControl");
Object.keys(_emojiControl).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _emojiControl[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _emojiControl[key];
    }
  });
});
//# sourceMappingURL=index.js.map