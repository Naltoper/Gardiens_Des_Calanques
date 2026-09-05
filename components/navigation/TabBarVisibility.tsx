import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type TabBarVisibilityContextValue = {
  hidden: boolean;
  setHidden: (hidden: boolean) => void;
};

const TabBarVisibilityContext = createContext<TabBarVisibilityContextValue>({
  hidden: false,
  setHidden: () => {},
});

export function TabBarVisibilityProvider({ children }: { children: React.ReactNode }) {
  const [hidden, setHiddenState] = useState(false);
  const setHidden = useCallback((value: boolean) => {
    setHiddenState(value);
  }, []);

  const value = useMemo(() => ({ hidden, setHidden }), [hidden, setHidden]);

  return (
    <TabBarVisibilityContext.Provider value={value}>
      {children}
    </TabBarVisibilityContext.Provider>
  );
}

export function useTabBarVisibility() {
  return useContext(TabBarVisibilityContext);
}

/** Hide the bottom tab bar while `hidden` is true, then restore it on cleanup. */
export function useTabBarHidden(hidden: boolean) {
  const { setHidden } = useTabBarVisibility();

  useEffect(() => {
    setHidden(hidden);
    return () => setHidden(false);
  }, [hidden, setHidden]);
}
