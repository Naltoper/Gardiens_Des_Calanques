import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { StreamChat } from 'stream-chat';
import { 
  Chat, 
  Channel, 
  MessageList, 
  MessageInput, 
  OverlayProvider 
} from 'stream-chat-expo'; // On utilise la version EXPO

// Initialisation du client (hors du composant pour éviter les re-renders)
const chatClient = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY!);

export function StreamChatContainer({ userId, userName }: { userId: string, userName: string }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const setupChat = async () => {
      try {
        // Logique de récupération du token (ton endpoint API)
        const res = await fetch("TON_URL_API/api/token", { /* ... */ });
        const { token } = await res.json();

        await chatClient.connectUser({ id: userId, name: userName }, token);
        setIsReady(true);
      } catch (e) {
        console.error(e);
      }
    };

    setupChat();
    return () => { chatClient.disconnectUser(); };
  }, [userId]);

  const channel = useMemo(() => {
    const c = chatClient.channel('messaging', 'gardien_chat', {
        name: 'Support Les Gardiens',
    } as any); // Cast temporaire
    c.watch();
    return c;
  }, [isReady]);

  if (!isReady) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <OverlayProvider>
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <View style={{ flex: 1 }}>
            <MessageList />
            <MessageInput />
          </View>
        </Channel>
      </Chat>
    </OverlayProvider>
  );
}