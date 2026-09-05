import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

function measureViewportCover() {
  const visualViewport = window.visualViewport;
  if (!visualViewport) return 0;
  return Math.max(
    0,
    window.innerHeight - visualViewport.height - visualViewport.offsetTop
  );
}

/**
 * On web, how many CSS pixels the on-screen keyboard covers at the bottom
 * of the layout viewport. Always 0 on native (iOS KeyboardAvoidingView /
 * Android `softwareKeyboardLayoutMode: resize` handle that).
 *
 * Subtracts the initial browser-chrome overlap (URL bar) so we only pad
 * for the keyboard. Also pins `window.scrollY` to 0 so the header cannot
 * slide off-screen when focusing an input.
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

    let baseline = measureViewportCover();

    const update = () => {
      const raw = measureViewportCover();
      if (raw < baseline) {
        baseline = raw;
      }
      setInset(Math.round(Math.max(0, raw - baseline)));
      window.scrollTo(0, 0);
    };

    const resetBaseline = () => {
      baseline = measureViewportCover();
      setInset(0);
      window.scrollTo(0, 0);
    };

    update();
    visualViewport.addEventListener('resize', update);
    visualViewport.addEventListener('scroll', update);
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('orientationchange', resetBaseline);

    return () => {
      visualViewport.removeEventListener('resize', update);
      visualViewport.removeEventListener('scroll', update);
      window.removeEventListener('scroll', update);
      window.removeEventListener('orientationchange', resetBaseline);
    };
  }, []);

  return inset;
}
