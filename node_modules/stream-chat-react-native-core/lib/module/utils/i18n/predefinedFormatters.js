var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.predefinedFormatters = void 0;
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));
var _dayjs = require("dayjs");
var _getDateString = require("./getDateString");
var _excluded = ["calendarFormats"];
var predefinedFormatters = exports.predefinedFormatters = {
  durationFormatter: function durationFormatter(streamI18n) {
    return function (value, _, _ref) {
      var format = _ref.format,
        withSuffix = _ref.withSuffix;
      if (format && (0, _dayjs.isDayjs)(streamI18n.DateTimeParser)) {
        return streamI18n.DateTimeParser.duration(value).format(format);
      }
      return streamI18n.DateTimeParser.duration(value).humanize(!!withSuffix);
    };
  },
  timestampFormatter: function timestampFormatter(streamI18n) {
    return function (value, _, _ref2) {
      var calendarFormats = _ref2.calendarFormats,
        options = (0, _objectWithoutProperties2.default)(_ref2, _excluded);
      var parsedCalendarFormats;
      try {
        if (!options.calendar) {
          parsedCalendarFormats = {};
        } else if (typeof calendarFormats === 'string') {
          parsedCalendarFormats = JSON.parse(calendarFormats);
        } else if (typeof calendarFormats === 'object') {
          parsedCalendarFormats = calendarFormats;
        }
      } catch (e) {
        console.error('[TIMESTAMP FORMATTER]', e);
      }
      var result = (0, _getDateString.getDateString)(Object.assign({}, options, {
        calendarFormats: parsedCalendarFormats,
        date: value,
        tDateTimeParser: streamI18n.tDateTimeParser
      }));
      if (!result || typeof result === 'number') {
        return JSON.stringify(value);
      }
      return result;
    };
  }
};
//# sourceMappingURL=predefinedFormatters.js.map