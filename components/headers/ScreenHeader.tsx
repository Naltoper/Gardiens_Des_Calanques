import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';

interface ScreenHeaderProps {
  title: string;
  onBack: () => void;
}

export const ScreenHeader = ({ title, onBack }: ScreenHeaderProps) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity 
        onPress={onBack} 
        style={styles.backButton}
        activeOpacity={0.7}
      >
        <ChevronLeft color="#023e8a" size={32} strokeWidth={2.5} />
      </TouchableOpacity>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    marginLeft: -10, // Pour compenser le padding interne de l'icône et l'aligner à gauche
  },
  backButton: {
    padding: 10,
    marginRight: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#023e8a',
    flex: 1,
  },
});