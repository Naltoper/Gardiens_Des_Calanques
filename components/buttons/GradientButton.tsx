import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  DimensionValue,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';

// Définition des types pour TypeScript
interface GradientButtonProps {
  disabled?: boolean;
  title: string;
  icon?: React.ReactNode;
  onPress: () => void;
  colors: [string, string, ...string[]];
  width?: DimensionValue;
  height?: DimensionValue;
  style?: StyleProp<ViewStyle>;
}

export const GradientButton = ({
  title,
  icon,
  onPress,
  colors,
  width = '100%', // Valeur par défaut
  height = 110,   // Valeur par défaut correspondant à tes boutons actuels
  style,
  disabled = false,
}: GradientButtonProps) => {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={disabled}
      activeOpacity={0.85}
      style={[{ width, height }, style]}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text style={styles.buttonText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    // Ombre légère pour le relief
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});