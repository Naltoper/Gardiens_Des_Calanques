// components/EmergencyCard.tsx
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Phone } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { EmergencyNumber } from '../constants/emergencyNumbers';

interface EmergencyCardProps {
  item: EmergencyNumber;
  onPress: (number: string) => void;
}

export const EmergencyCard = ({ item, onPress }: EmergencyCardProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress(item.number)}
      style={styles.cardContainer}
    >
      <LinearGradient
        colors={item.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDesc}>{item.description}</Text>
          <View style={styles.numberBadge}>
            <Phone size={16} color="white" fill="white" />
            <Text style={styles.cardNumber}>{item.number}</Text>
          </View>
        </View>
        <View style={styles.iconCircle}>
          <Phone size={28} color={item.colors[0]} />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 16,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    // Ombre portée hors du clip web : wrapper externe sans fond opaque
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.12)',
      },
      default: {
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
    }),
  },
  card: {
    padding: 20,
    borderRadius: 24,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  cardInfo: {
    flex: 1,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
    lineHeight: 18,
  },
  numberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  cardNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: '#fff',
    marginLeft: 8,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E2F4F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
