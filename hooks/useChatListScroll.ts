import { useCallback, useEffect, useRef, type RefObject } from 'react';
import {
  Keyboard,
  Platform,
  type FlatList,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

const NEAR_END_PX = 80;
const ANIMATED_DELAYS_MS = [0, 90, 240];
const INSTANT_DELAYS_MS = [0, 60];

type Options = {
  messageCount: number;
  keyboardVisible: boolean;
  reportId: string;
};

/**
 * Scrolls the chat list to the latest message on open, send, and keyboard
 * show. Uses a few one-shot timeouts (not onContentSizeChange) so layout
 * can settle without the previous white-screen scroll loop.
 */
export function useChatListScroll(
  flatListRef: RefObject<FlatList | null>,
  { messageCount, keyboardVisible, reportId }: Options,
) {
  const stickToEndRef = useRef(true);
  const programmaticRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const initialDoneRef = useRef(false);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const runScroll = useCallback(
    (animated: boolean) => {
      try {
        flatListRef.current?.scrollToEnd({ animated });
      } catch {
        // FlatList may be unmounted between keyboard frames.
      }
    },
    [flatListRef],
  );

  const scrollToLatest = useCallback(
    (opts?: { animated?: boolean; force?: boolean }) => {
      const animated = opts?.animated ?? true;
      const force = opts?.force ?? true;
      if (!force && !stickToEndRef.current) return;

      stickToEndRef.current = true;
      programmaticRef.current = true;
      clearTimers();

      const delays = animated ? ANIMATED_DELAYS_MS : INSTANT_DELAYS_MS;
      delays.forEach((delay, index) => {
        const id = setTimeout(() => {
          requestAnimationFrame(() => runScroll(animated && delay > 0));
          if (index === delays.length - 1) {
            programmaticRef.current = false;
          }
        }, delay);
        timersRef.current.push(id);
      });
    },
    [clearTimers, runScroll],
  );

  useEffect(() => () => clearTimers(), [clearTimers]);

  useEffect(() => {
    initialDoneRef.current = false;
    stickToEndRef.current = true;
  }, [reportId]);

  useEffect(() => {
    if (messageCount === 0) return;
    if (!initialDoneRef.current) {
      initialDoneRef.current = true;
      scrollToLatest({ animated: false, force: true });
      return;
    }
    scrollToLatest({ animated: true, force: false });
  }, [reportId, messageCount, scrollToLatest]);

  useEffect(() => {
    if (!keyboardVisible) return;
    scrollToLatest({ animated: true, force: true });
  }, [keyboardVisible, scrollToLatest]);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const show = Keyboard.addListener(showEvent, () => {
      scrollToLatest({ animated: true, force: true });
    });
    return () => show.remove();
  }, [scrollToLatest]);

  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (programmaticRef.current) return;
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const distanceFromEnd =
      contentSize.height - (contentOffset.y + layoutMeasurement.height);
    stickToEndRef.current = distanceFromEnd < NEAR_END_PX;
  }, []);

  return {
    onScroll,
    onComposerFocus: () => scrollToLatest({ animated: true, force: true }),
    onMessageSent: () => scrollToLatest({ animated: true, force: true }),
  };
}
