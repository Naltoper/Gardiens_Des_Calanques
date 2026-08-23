import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

/**
 * On web, how many CSS pixels the on-screen keyboard covers at the bottom
 * of the layout viewport. Always 0 on native (iOS KeyboardAvoidingView /
 * Android `softwareKeyboardLayoutMode: resize` handle that).
 *
 * Also pins `window.scrollY` to 0 so the browser cannot slide the header
 * off-screen when focusing an input.
 */
export function useKeyboardBottomInset() {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return;
    }

    const visualViewport = window.visualViewport;
    if (!visualViewport) {
      return;
    }

    const update = () => {
      const next = Math.max(
        0,
        window.innerHeight - visualViewport.height - visualViewport.offsetTop
      );
      setInset(Math.round(next));
      window.scrollTo(0, 0);
    };

    update();
    visualViewport.addEventListener('resize', update);
    visualViewport.addEventListener('scroll', update);
    window.addEventListener('scroll', update, { passive: true });

    return () => {
      visualViewport.removeEventListener('resize', update);
      visualViewport.removeEventListener('scroll', update);
      window.removeEventListener('scroll', update);
    };
  }, []);

  return inset;
}
