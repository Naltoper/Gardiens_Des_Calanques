import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { decodeChatContent } from '../../utils/chatMessage';

interface ChatBubbleProps {
  item: {
    content: string;
    created_at: string;
    sender_role: string;
  };
  isMyMessage: boolean;
  /** Index pour un léger décalage à l'ouverture de la page */
  index?: number;
  onImagePress?: (uri: string) => void;
}

export const ChatBubble = ({
  item,
  isMyMessage,
  index = 0,
  onImagePress,
}: ChatBubbleProps) => {
  const appearAnim = useRef(new Animated.Value(0)).current;
  const { text, imageUrl } = decodeChatContent(item.content);

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
          imageUrl ? styles.imageBubble : null,
        ]}
      >
        {imageUrl ? (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => onImagePress?.(imageUrl)}
            accessibilityRole="button"
            accessibilityLabel="Voir l'image en grand"
          >
            <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
          </TouchableOpacity>
        ) : null}
        {text ? (
          <Text
            style={[
              styles.msgText,
              isMyMessage ? styles.myText : styles.theirText,
              imageUrl ? styles.imageCaption : null,
            ]}
          >
            {text}
          </Text>
        ) : null}
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
  imageBubble: {
    paddingHorizontal: 6,
    paddingTop: 6,
  },
  myBubble: {
    backgroundColor: '#023e8a',
    borderBottomRightRadius: 4,
  },
  theirBubble: {
    backgroundColor: '#E2F4F3',
    borderBottomLeftRadius: 4,
  },
  image: {
    width: 210,
    height: 160,
    borderRadius: 14,
    backgroundColor: '#cbd5e1',
  },
  msgText: {
    fontSize: 15,
    lineHeight: 20,
  },
  imageCaption: {
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 4,
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
