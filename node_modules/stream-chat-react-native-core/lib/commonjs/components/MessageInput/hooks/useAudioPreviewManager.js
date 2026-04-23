var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAudioPreviewManager = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _react = require("react");
var useAudioPreviewManager = exports.useAudioPreviewManager = function useAudioPreviewManager(files) {
  var _useState = (0, _react.useState)({}),
    _useState2 = (0, _slicedToArray2.default)(_useState, 2),
    audioAttachmentsStateMap = _useState2[0],
    setAudioAttachmentsStateMap = _useState2[1];
  (0, _react.useEffect)(function () {
    setAudioAttachmentsStateMap(function (prevState) {
      var updatedStateMap = Object.fromEntries(files.map(function (attachment) {
        var _ref, _attachment$duration, _prevState$id, _prevState$id$paused, _prevState$id2, _prevState$id$progres, _prevState$id3;
        var id = attachment.localMetadata.id;
        var config = {
          duration: (_ref = (_attachment$duration = attachment.duration) != null ? _attachment$duration : (_prevState$id = prevState[id]) == null ? void 0 : _prevState$id.duration) != null ? _ref : 0,
          paused: (_prevState$id$paused = (_prevState$id2 = prevState[id]) == null ? void 0 : _prevState$id2.paused) != null ? _prevState$id$paused : true,
          progress: (_prevState$id$progres = (_prevState$id3 = prevState[id]) == null ? void 0 : _prevState$id3.progress) != null ? _prevState$id$progres : 0
        };
        return [id, config];
      }));
      return updatedStateMap;
    });
  }, [files]);
  var onLoad = (0, _react.useCallback)(function (index, duration) {
    setAudioAttachmentsStateMap(function (prevState) {
      return Object.assign({}, prevState, (0, _defineProperty2.default)({}, index, Object.assign({}, prevState[index], {
        duration: duration
      })));
    });
  }, []);
  var onProgress = (0, _react.useCallback)(function (index, progress) {
    setAudioAttachmentsStateMap(function (prevState) {
      return Object.assign({}, prevState, (0, _defineProperty2.default)({}, index, Object.assign({}, prevState[index], {
        progress: progress
      })));
    });
  }, []);
  var onPlayPause = (0, _react.useCallback)(function (index, pausedStatus) {
    if (pausedStatus === false) {
      setAudioAttachmentsStateMap(function (prevState) {
        var newState = Object.assign({}, prevState);
        Object.keys(newState).forEach(function (key) {
          if (key !== index) {
            newState[key].paused = true;
          }
        });
        return Object.assign({}, newState, (0, _defineProperty2.default)({}, index, Object.assign({}, newState[index], {
          paused: false
        })));
      });
    } else {
      setAudioAttachmentsStateMap(function (prevState) {
        return Object.assign({}, prevState, (0, _defineProperty2.default)({}, index, Object.assign({}, prevState[index], {
          paused: true
        })));
      });
    }
  }, []);
  return {
    audioAttachmentsStateMap: audioAttachmentsStateMap,
    onLoad: onLoad,
    onPlayPause: onPlayPause,
    onProgress: onProgress,
    setAudioAttachmentsStateMap: setAudioAttachmentsStateMap
  };
};
//# sourceMappingURL=useAudioPreviewManager.js.map