import { useCallback, useState } from 'react';

/**
 * Keeps anonymity ON until the user confirms the reveal warning modal.
 */
export function useRevealIdentity(isAnonyme: boolean, setIsAnonyme: (value: boolean) => void) {
  const [warningVisible, setWarningVisible] = useState(false);

  const onAnonymityChange = useCallback(
    (next: boolean) => {
      if (isAnonyme && next === false) {
        setWarningVisible(true);
        return;
      }
      setIsAnonyme(next);
    },
    [isAnonyme, setIsAnonyme]
  );

  const confirmReveal = useCallback(() => {
    setIsAnonyme(false);
    setWarningVisible(false);
  }, [setIsAnonyme]);

  const cancelReveal = useCallback(() => {
    setWarningVisible(false);
  }, []);

  return {
    warningVisible,
    onAnonymityChange,
    confirmReveal,
    cancelReveal,
  };
}
