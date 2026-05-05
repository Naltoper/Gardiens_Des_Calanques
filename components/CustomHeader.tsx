// components/CustomHeader.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';

interface CustomHeaderProps {
  title: string;
  onBack: () => void;
}

export const CustomHeader = ({ title, onBack }: CustomHeaderProps) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity 
        onPress={onBack} 
        style={styles.backButton}
        activeOpacity={0.7}
      >
        <ChevronLeft color="#023e8a" size={30} strokeWidth={2.5} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: Platform.OS === 'ios' ? 55 : 35,
    padding: 10,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#023e8a',
    textAlign: 'center',
  },
});