import { useState, useEffect, useCallback } from 'react';

import { supabase } from '../lib/supabase';
import { encodeChatContent } from '../utils/chatMessage';
import { uniqueRealtimeTopic } from '../utils/realtimeChannel';
import { triggerChatPush } from '../utils/triggerChatPush';
import { uploadImageToSupabase, type UploadImageOptions } from '../utils/uploadImage';

export type ChatMessage = {
  id: string;
  report_id?: string;
  content: string;
  sender_role: string;
  created_at: string;
  pendingUpload?: boolean;
  uploadFailed?: boolean;
};

type PendingImagePayload = {
  uri: string;
} & UploadImageOptions;

export const useChatMessages = (reportId: string | undefined) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(Boolean(reportId));
  const [sending, setSending] = useState(false);
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

      setMessages((data as ChatMessage[]) ?? []);
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
    imageUrl?: string | null,
  ) => {
    const encoded = encodeChatContent(content, imageUrl);
    if (!encoded || !reportId) return false;

    setSending(true);
    try {
      const { data, error: insertError } = await supabase
        .from('messages')
        .insert([
          {
            report_id: reportId,
            content: encoded,
            sender_role: role,
          },
        ])
        .select()
        .maybeSingle();

      if (insertError) return false;

      if (data) {
        const inserted = data as ChatMessage;
        setMessages((prev) => {
          if (prev.some((message) => message.id === inserted.id)) return prev;
          return [...prev, inserted];
        });
        triggerChatPush(inserted);
      } else {
        triggerChatPush({ report_id: reportId, sender_role: role });
      }
      return true;
    } catch (caught) {
      console.warn('[chat] send', caught);
      return false;
    } finally {
      setSending(false);
    }
  };

  const sendMessageWithImage = async (
    content: string,
    role: 'user' | 'admin',
    image: PendingImagePayload,
  ) => {
    if (!reportId) return false;

    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const optimistic: ChatMessage = {
      id: tempId,
      report_id: reportId,
      content: encodeChatContent(content, image.uri),
      sender_role: role,
      created_at: new Date().toISOString(),
      pendingUpload: true,
    };

    setMessages((prev) => [...prev, optimistic]);

    try {
      const imageUrl = await uploadImageToSupabase(image.uri, 'report-photos', {
        mimeType: image.mimeType,
        fileName: image.fileName,
      });

      if (!imageUrl) {
        setMessages((prev) =>
          prev.map((message) =>
            message.id === tempId
              ? { ...message, pendingUpload: false, uploadFailed: true }
              : message,
          ),
        );
        return false;
      }

      const encoded = encodeChatContent(content, imageUrl);
      const { data, error: insertError } = await supabase
        .from('messages')
        .insert([
          {
            report_id: reportId,
            content: encoded,
            sender_role: role,
          },
        ])
        .select()
        .maybeSingle();

      if (insertError || !data) {
        setMessages((prev) =>
          prev.map((message) =>
            message.id === tempId
              ? { ...message, pendingUpload: false, uploadFailed: true }
              : message,
          ),
        );
        return false;
      }

      const inserted = data as ChatMessage;
      setMessages((prev) => {
        const withoutTemp = prev.filter((message) => message.id !== tempId);
        if (withoutTemp.some((message) => message.id === inserted.id)) {
          return withoutTemp;
        }
        return [...withoutTemp, inserted];
      });
      triggerChatPush(inserted);
      return true;
    } catch (caught) {
      console.warn('[chat] send image', caught);
      setMessages((prev) =>
        prev.map((message) =>
          message.id === tempId
            ? { ...message, pendingUpload: false, uploadFailed: true }
            : message,
        ),
      );
      return false;
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
            const incoming = payload.new as ChatMessage | undefined;
            if (!incoming?.id) return;
            triggerChatPush(incoming);
            setMessages((prev) => {
              if (prev.some((message) => message.id === incoming.id)) return prev;
              // Remplace un optimistic encore en cours si le contenu distant correspond
              const withoutMatchingTemp = prev.filter((message) => {
                if (!message.pendingUpload) return true;
                return message.content !== incoming.content;
              });
              return [...withoutMatchingTemp, incoming];
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

  return {
    messages,
    sendMessage,
    sendMessageWithImage,
    loading,
    sending,
    fetchMessages,
    error,
  };
};
