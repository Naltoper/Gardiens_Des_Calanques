var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAppSettings = void 0;
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _react = require("react");
var _useIsMountedRef = require("../../../hooks/useIsMountedRef");
var useAppSettings = exports.useAppSettings = function useAppSettings(client, isOnline, enableOfflineSupport, initialisedDatabase) {
  var _useState = (0, _react.useState)(null),
    _useState2 = (0, _slicedToArray2.default)(_useState, 2),
    appSettings = _useState2[0],
    setAppSettings = _useState2[1];
  var appSettingsPromise = (0, _react.useRef)(null);
  var fetchedAppSettings = (0, _react.useRef)(false);
  var isMounted = (0, _useIsMountedRef.useIsMountedRef)();
  (0, _react.useEffect)(function () {
    if (fetchedAppSettings.current) {
      return;
    }
    var fetchAppSettings = function fetchAppSettings() {
      if (appSettingsPromise.current) {
        return appSettingsPromise.current;
      }
      appSettingsPromise.current = client.getAppSettings();
      return appSettingsPromise.current;
    };
    var enforceAppSettings = function () {
      var _ref = (0, _asyncToGenerator2.default)(function* () {
        if (!client.userID) return;
        if (enableOfflineSupport && !initialisedDatabase) return;
        var userId = client.userID;
        if (!isOnline && client.offlineDb) {
          var _appSettings = yield client.offlineDb.getAppSettings({
            userId: userId
          });
          setAppSettings(_appSettings);
          return;
        }
        try {
          var _appSettings2 = yield fetchAppSettings();
          if (isMounted.current && _appSettings2) {
            var _client$offlineDb;
            setAppSettings(_appSettings2);
            fetchedAppSettings.current = true;
            (_client$offlineDb = client.offlineDb) == null || _client$offlineDb.executeQuerySafely(function (db) {
              return db.upsertAppSettings({
                appSettings: _appSettings2,
                userId: userId
              });
            }, {
              method: 'upsertAppSettings'
            });
          }
        } catch (error) {
          if (error instanceof Error) {
            console.error(`An error occurred while getting app settings: ${error}`);
          }
        }
      });
      return function enforceAppSettings() {
        return _ref.apply(this, arguments);
      };
    }();
    enforceAppSettings();
  }, [client, isOnline, initialisedDatabase, isMounted, enableOfflineSupport]);
  return appSettings;
};
//# sourceMappingURL=useAppSettings.js.map