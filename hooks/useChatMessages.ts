import { useState, useEffect, useCallback } from 'react';

import { supabase } from '../lib/supabase';
import { encodeChatContent } from '../utils/chatMessage';
import { notifyChatMessage } from '../utils/notifyChat';
import { uniqueRealtimeTopic } from '../utils/realtimeChannel';

export const useChatMessages = (reportId: string | undefined) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(Boolean(reportId));
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!reportId) {
      setMessages([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    try {
      const { data, error: queryError } = await supabase
        .from('messages')
        .select('*')
        .eq('report_id', reportId)
        .order('created_at', { ascending: true });

      if (queryError) {
        console.warn('[chat] messages', queryError.message);
        setError("Impossible de charger les messages pour le moment.");
        return;
      }

      setMessages(data ?? []);
      setError(null);
    } catch (caught) {
      console.warn('[chat] messages', caught);
      setError("Impossible de charger les messages pour le moment.");
    } finally {
      setLoading(false);
    }
  }, [reportId]);

  const sendMessage = async (
    content: string,
    role: 'user' | 'admin',
    imageUrl?: string | null
  ) => {
    const encoded = encodeChatContent(content, imageUrl);
    if (!encoded || !reportId) return false;

    setLoading(true);
    try {
      const { data, error: insertError } = await supabase
        .from('messages')
        .insert([{
          report_id: reportId,
          content: encoded,
          sender_role: role,
        }])
        .select()
        .maybeSingle();

      if (!insertError) {
        notifyChatMessage(data || { report_id: reportId, sender_role: role });
      }
      return !insertError;
    } catch (caught) {
      console.warn('[chat] send', caught);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!reportId) return;

    void fetchMessages();

    let channel: ReturnType<typeof supabase.channel> | null = null;
    try {
      channel = supabase
        .channel(uniqueRealtimeTopic(`chat-${reportId}`))
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `report_id=eq.${reportId}`,
          },
          (payload) => {
            const incoming = payload.new as {
              id?: string;
              report_id?: string;
              sender_role?: string | null;
              content?: string | null;
            } | undefined;
            if (!incoming?.id) return;
            notifyChatMessage(incoming);
            setMessages((prev) => {
              if (prev.find((message) => message.id === incoming.id)) return prev;
              return [...prev, incoming];
            });
          },
        )
        .subscribe();
    } catch (caught) {
      console.warn('[chat] realtime', caught);
    }

    return () => {
      if (channel) {
        void supabase.removeChannel(channel);
      }
    };
  }, [reportId, fetchMessages]);

  return { messages, sendMessage, loading, fetchMessages, error };
};
