import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

interface ChatBubbleProps {
  item: {
    content: string;
    created_at: string;
    sender_role: string;
  };
  isMyMessage: boolean;
  /** Index pour un léger décalage à l'ouverture de la page */
  index?: number;
}

export const ChatBubble = ({ item, isMyMessage, index = 0 }: ChatBubbleProps) => {
  const appearAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = Math.min(index, 12) * 45;
    const timer = setTimeout(() => {
      Animated.spring(appearAnim, {
        toValue: 1,
        friction: 7,
        tension: 60,
        useNativeDriver: true,
      }).start();
    }, delay);
    return () => clearTimeout(timer);
  }, [appearAnim, index]);

  return (
    <Animated.View
      style={[
        styles.msgContainer,
        isMyMessage ? styles.myMsgContainer : styles.theirMsgContainer,
        {
          opacity: appearAnim,
          transform: [
            {
              translateY: appearAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [8, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View
        style={[
          styles.msgBubble,
          isMyMessage ? styles.myBubble : styles.theirBubble,
        ]}
      >
        <Text
          style={[styles.msgText, isMyMessage ? styles.myText : styles.theirText]}
        >
          {item.content}
        </Text>
      </View>
      <Text style={styles.timeText}>
        {new Date(item.created_at).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </Animated.View>
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
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 3,
  },
  myBubble: {
    backgroundColor: '#023e8a',
    borderBottomRightRadius: 4,
  },
  theirBubble: {
    backgroundColor: '#D5EDEC',
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
