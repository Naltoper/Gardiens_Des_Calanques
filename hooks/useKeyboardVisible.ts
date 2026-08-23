import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

import { useKeyboardBottomInset } from './useKeyboardBottomInset';

const WEB_KEYBOARD_THRESHOLD = 80;

/** True while the software keyboard is open (native events + web visualViewport). */
export function useKeyboardVisible() {
  const [nativeVisible, setNativeVisible] = useState(false);
  const webInset = useKeyboardBottomInset();

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setNativeVisible(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setNativeVisible(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  if (Platform.OS === 'web') {
    return webInset >= WEB_KEYBOARD_THRESHOLD;
  }

  return nativeVisible;
}
