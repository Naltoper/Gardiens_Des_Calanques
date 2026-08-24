import { useCallback, useEffect, useMemo, useState } from 'react';

import { supabase } from '../lib/supabase';
import {
  getLastReadMap,
  isIncomingUnread,
  subscribeChatRead,
} from '../utils/chatReadState';

export type ChatActivity = {
  hasMessages: boolean;
  unread: boolean;
};

type MessageRow = {
  report_id: string;
  created_at: string;
  sender_role: string | null;
};

function buildActivity(
  reportIds: string[],
  rows: MessageRow[],
  lastRead: Record<string, string>,
) {
  const next: Record<string, ChatActivity> = {};
  for (const id of reportIds) {
    next[id] = { hasMessages: false, unread: false };
  }

  const lastIncoming: Record<string, string> = {};
  for (const row of rows) {
    const entry = next[row.report_id] ?? { hasMessages: false, unread: false };
    entry.hasMessages = true;
    if (row.sender_role !== 'user') {
      const previous = lastIncoming[row.report_id];
      if (!previous || new Date(row.created_at) > new Date(previous)) {
        lastIncoming[row.report_id] = row.created_at;
      }
    }
    next[row.report_id] = entry;
  }

  for (const id of Object.keys(lastIncoming)) {
    const entry = next[id];
    if (!entry) continue;
    entry.unread = isIncomingUnread(lastIncoming[id], lastRead[id]);
  }

  return next;
}

export function useChatActivity(reportIds: string[]) {
  const [activity, setActivity] = useState<Record<string, ChatActivity>>({});
  const [loaded, setLoaded] = useState(false);
  const idsKey = useMemo(
    () => [...reportIds].sort().join('|'),
    [reportIds],
  );

  const refresh = useCallback(async () => {
    const ids = idsKey ? idsKey.split('|').filter(Boolean) : [];
    if (ids.length === 0) {
      setActivity({});
      setLoaded(true);
      return;
    }

    const [lastRead, result] = await Promise.all([
      getLastReadMap(),
      supabase
        .from('messages')
        .select('report_id, created_at, sender_role')
        .in('report_id', ids),
    ]);

    if (result.error) {
      console.warn('[chat-activity]', result.error.message);
      setLoaded(true);
      return;
    }

    setActivity(buildActivity(ids, (result.data ?? []) as MessageRow[], lastRead));
    setLoaded(true);
  }, [idsKey]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => subscribeChatRead(() => {
    void refresh();
  }), [refresh]);

  useEffect(() => {
    const ids = idsKey ? idsKey.split('|').filter(Boolean) : [];
    if (ids.length === 0) return;

    const idSet = new Set(ids);
    const channel = supabase
      .channel(`suivis-chat-activity-${idsKey.slice(0, 24)}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const row = payload.new as MessageRow;
          if (!idSet.has(row.report_id)) return;
          void refresh();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [idsKey, refresh]);

  return { activity, refresh, loaded };
}
