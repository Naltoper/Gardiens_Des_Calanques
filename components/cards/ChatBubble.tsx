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
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
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