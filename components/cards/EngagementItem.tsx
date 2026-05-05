import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  icon: React.ReactNode;
  title: string;
  desc: string;
  colors: [string, string];
};

export default function EngagementItem({ icon, title, desc, colors }: Props) {
  return (
    <LinearGradient colors={colors} style={styles.container}>
      <View style={styles.iconContainer}>{icon}</View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc}>{desc}</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 18,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  iconContainer: {
    marginRight: 12,
  },

  textContainer: {
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },

  desc: {
    fontSize: 14,
    color: '#f1f5f9',
    lineHeight: 20,
  },
});
