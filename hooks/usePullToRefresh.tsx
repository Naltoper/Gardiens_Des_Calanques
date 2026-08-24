import { useRef } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  RefreshControl,
} from 'react-native';

const WEB_PULL_THRESHOLD = 72;

type Options = {
  refreshing: boolean;
  onRefresh: () => void | Promise<void>;
};

/**
 * Native: standard RefreshControl.
 * Web: also detects a downward pull at the top of the list, since RN Web
 * ignores RefreshControl rubber-banding on many mobile browsers.
 */
export function usePullToRefresh({ refreshing, onRefresh }: Options) {
  const scrollOffset = useRef(0);
  const startY = useRef(0);
  const armed = useRef(false);
  const triggered = useRef(false);

  const refreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={() => {
        void onRefresh();
      }}
      tintColor="#48a4f4"
      colors={['#48a4f4']}
    />
  );

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollOffset.current = event.nativeEvent.contentOffset.y;
  };

  if (Platform.OS !== 'web') {
    return {
      refreshControl,
      onScroll,
      scrollEventThrottle: 16,
      alwaysBounceVertical: true,
      overScrollMode: 'always' as const,
    };
  }

  return {
    refreshControl,
    onScroll,
    scrollEventThrottle: 16,
    alwaysBounceVertical: true,
    overScrollMode: 'always' as const,
    onTouchStart: (event: { nativeEvent: { pageY: number } }) => {
      if (refreshing || scrollOffset.current > 8) {
        armed.current = false;
        return;
      }
      startY.current = event.nativeEvent.pageY;
      armed.current = true;
      triggered.current = false;
    },
    onTouchMove: (event: { nativeEvent: { pageY: number } }) => {
      if (!armed.current || triggered.current || refreshing) return;
      const dy = event.nativeEvent.pageY - startY.current;
      if (dy > WEB_PULL_THRESHOLD && scrollOffset.current <= 8) {
        triggered.current = true;
        armed.current = false;
        void onRefresh();
      }
    },
    onTouchEnd: () => {
      armed.current = false;
    },
  };
}
