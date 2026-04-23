var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var fs = require('fs');
var getEmojis = function () {
  var _ref = (0, _asyncToGenerator2.default)(function* () {
    try {
      var response = yield fetch('https://raw.githubusercontent.com/iamcal/emoji-data/master/emoji.json');
      var emojis = yield response.json();
      var emojiLib = emojis.map(function (emoji) {
        return Object.assign({
          id: emoji.short_name,
          name: emoji.short_name,
          names: emoji.short_names
        }, emoji.skin_variations ? {
          skins: Object.values(emoji.skin_variations).map(function (skin) {
            return String.fromCodePoint.apply(null, skin.unified.split('-').map(function (unicode) {
              return `0x${unicode}`;
            }));
          })
        } : {}, {
          unicode: String.fromCodePoint.apply(null, emoji.unified.split('-').map(function (unicode) {
            return `0x${unicode}`;
          }))
        });
      }).sort(function (a, b) {
        return a.name < b.name ? -1 : 1;
      });
      return {
        emojiLib: emojiLib
      };
    } catch (error) {
      console.log(error);
    }
  });
  return function getEmojis() {
    return _ref.apply(this, arguments);
  };
}();
getEmojis().then(function (_ref2) {
  var emojiLib = _ref2.emojiLib;
  var stingified = JSON.stringify(emojiLib).replace(/(["'])require(?:(?=(\\?))\2.)*?\1/g, function (value) {
    return value.replace(/"/g, '');
  });
  fs.writeFile('src/emoji-data/index.ts', `export type Emoji = {
      id: string;
      name: string;
      names: string[];
      unicode: string;
      skins?: string[];
    };

    export type Emojis = Emoji[];

    export const compiledEmojis: Emojis = ${stingified}`, function (err) {
    if (err) {
      throw err;
    }
  });
});
//# sourceMappingURL=compile.js.map