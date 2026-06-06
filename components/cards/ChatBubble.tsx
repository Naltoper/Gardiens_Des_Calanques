import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ChatBubbleProps {
  item: {
    content: string;
    created_at: string;
    sender_role: string;
  };
  isMyMessage: boolean;
}

export const ChatBubble = ({ item, isMyMessage }: ChatBubbleProps) => {
  return (
    <View style={[
      styles.msgContainer, 
      isMyMessage ? styles.myMsgContainer : styles.theirMsgContainer
    ]}>
      <View style={[
        styles.msgBubble, 
        isMyMessage ? styles.myBubble : styles.theirBubble
      ]}>
        <Text style={[
          styles.msgText, 
          isMyMessage ? styles.myText : styles.theirText
        ]}>
          {item.content}
        </Text>
      </View>
      <Text style={styles.timeText}>
        {new Date(item.created_at).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  msgContainer: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  myMsgContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  theirMsgContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  msgBubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    
    // --- NOUVEL EFFET D'OMBRE POUR LES BULLES DE CHAT ---
    elevation: 2, // Légèrement augmenté pour se détacher proprement du fond sur Android
    shadowColor: '#000000', // Couleur de l'ombre sur iOS
    shadowOffset: { width: 2, height: 3 }, // Déplace l'ombre légèrement vers le bas de la bulle
    shadowOpacity: 0.16, // Une opacité douce pour que l'ombre reste naturelle, surtout sous la bulle blanche
    shadowRadius: 3, // Floutage de l'ombre pour éviter un effet de ligne noire rigide
  },
  myBubble: {
    backgroundColor: '#023e8a',
    borderBottomRightRadius: 4,
  },
  theirBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  msgText: {
    fontSize: 15,
    lineHeight: 20,
  },
  myText: {
    color: '#fff',
  },
  theirText: {
    color: '#1e293b',
  },
  timeText: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 4,
    marginHorizontal: 4,
  },
});