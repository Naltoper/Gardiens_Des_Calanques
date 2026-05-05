import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export const useChatMessages = (reportId: string | undefined) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 1. Récupérer les messages existants
  const fetchMessages = useCallback(async () => {
    if (!reportId) return;
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('report_id', reportId)
      .order('created_at', { ascending: true });
    
    if (!error && data) setMessages(data);
  }, [reportId]);

  // 2. Envoyer un nouveau message
  const sendMessage = async (content: string, role: 'user' | 'admin') => {
    if (!content.trim() || !reportId) return false;
    
    setLoading(true);
    const { error } = await supabase
      .from('messages')
      .insert([{ 
        report_id: reportId, 
        content: content, 
        sender_role: role 
      }]);
    
    setLoading(false);
    return !error; // Retourne true si ça a marché
  };

  // 3. Écouter le temps réel
  useEffect(() => {
    if (!reportId) return;

    fetchMessages();

    const channel = supabase
      .channel(`chat-${reportId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `report_id=eq.${reportId}`,
        },
        (payload) => {
          setMessages((prev) => {
            if (prev.find(m => m.id === payload.new.id)) return prev;
            return [...prev, payload.new];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [reportId, fetchMessages]);

  return { messages, sendMessage, loading };
};