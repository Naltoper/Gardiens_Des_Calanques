import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { useChatActivity, type ChatActivity } from '../hooks/useChatActivity';
import { supabase } from '../lib/supabase';
import { uniqueRealtimeTopic } from '../utils/realtimeChannel';
import { getUserToken } from '../utils/storage';

type ChatActivityContextValue = {
  activity: Record<string, ChatActivity>;
  loaded: boolean;
  refresh: () => Promise<void>;
  reloadIds: () => Promise<void>;
  hasAnyUnread: boolean;
};

const ChatActivityContext = createContext<ChatActivityContextValue | null>(null);

export function ChatActivityProvider({ children }: { children: React.ReactNode }) {
  const [reportIds, setReportIds] = useState<string[]>([]);
  const { activity, refresh, loaded } = useChatActivity(reportIds);

  const reloadIds = useCallback(async () => {
    const token = await getUserToken();
    if (!token) {
      setReportIds([]);
      return;
    }
    const { data, error } = await supabase
      .from('reports')
      .select('id')
      .eq('user_token', token);
    if (error) {
      console.warn('[chat-activity] reports', error.message);
      return;
    }
    setReportIds((data ?? []).map((row) => row.id));
  }, []);

  useEffect(() => {
    void reloadIds();
  }, [reloadIds]);

  useEffect(() => {
    const channel = supabase
      .channel(uniqueRealtimeTopic('user-report-ids'))
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reports' },
        () => {
          void reloadIds();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [reloadIds]);

  const hasAnyUnread = useMemo(
    () => Object.values(activity).some((item) => item.unread),
    [activity],
  );

  const value = useMemo(
    () => ({ activity, loaded, refresh, reloadIds, hasAnyUnread }),
    [activity, loaded, refresh, reloadIds, hasAnyUnread],
  );

  return (
    <ChatActivityContext.Provider value={value}>
      {children}
    </ChatActivityContext.Provider>
  );
}

export function useChatActivityContext() {
  const context = useContext(ChatActivityContext);
  if (!context) {
    throw new Error('useChatActivityContext must be used within ChatActivityProvider');
  }
  return context;
}
