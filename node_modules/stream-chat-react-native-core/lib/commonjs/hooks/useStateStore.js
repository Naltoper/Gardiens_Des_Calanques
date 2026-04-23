Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useStateStore = useStateStore;
var _react = require("react");
var _shim = require("use-sync-external-store/shim");
var noop = function noop() {};
function useStateStore(store, selector) {
  var wrappedSubscription = (0, _react.useCallback)(function (onStoreChange) {
    var unsubscribe = store == null ? void 0 : store.subscribeWithSelector(selector, onStoreChange);
    return unsubscribe != null ? unsubscribe : noop;
  }, [store, selector]);
  var wrappedSnapshot = (0, _react.useMemo)(function () {
    var cachedTuple;
    return function () {
      var currentValue = store == null ? void 0 : store.getLatestValue();
      if (!currentValue) return undefined;
      if (cachedTuple && cachedTuple[0] === currentValue) {
        return cachedTuple[1];
      }
      var newlySelected = selector(currentValue);
      if (cachedTuple) {
        var selectededAreEqualToCached = true;
        for (var key in cachedTuple[1]) {
          if (cachedTuple[1][key] === newlySelected[key]) continue;
          selectededAreEqualToCached = false;
          break;
        }
        if (selectededAreEqualToCached) return cachedTuple[1];
      }
      cachedTuple = [currentValue, newlySelected];
      return cachedTuple[1];
    };
  }, [store, selector]);
  var state = (0, _shim.useSyncExternalStore)(wrappedSubscription, wrappedSnapshot);
  return state;
}
//# sourceMappingURL=useStateStore.js.map