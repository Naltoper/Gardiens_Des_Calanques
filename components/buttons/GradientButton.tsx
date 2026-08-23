import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  DimensionValue,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

interface GradientButtonProps {
  disabled?: boolean;
  title: string;
  icon?: React.ReactNode;
  onPress: () => void;
  colors: [string, string, ...string[]];
  width?: DimensionValue;
  height?: DimensionValue;
  fontSize?: number;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const GradientButton = ({
  title,
  icon,
  onPress,
  colors,
  width = '100%',
  height = 110,
  fontSize = 17,
  compact = false,
  style,
  disabled = false,
}: GradientButtonProps) => {
  const resolvedHeight = compact ? height ?? 42 : height;
  const resolvedFontSize = compact ? 14 : fontSize;
  const isRow = compact || (!!icon && !!title);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.82}
      style={[{ width, height: resolvedHeight, opacity: disabled ? 0.55 : 1 }, style]}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.gradient,
          compact && styles.gradientCompact,
          isRow && styles.gradientRow,
        ]}
      >
        {icon ? (
          <View
            style={[
              styles.iconContainer,
              !title && styles.iconContainerSolo,
              isRow && styles.iconContainerRow,
            ]}
          >
            {icon}
          </View>
        ) : null}
        {title ? (
          <Text style={[styles.buttonText, { fontSize: resolvedFontSize }]}>{title}</Text>
        ) : null}
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    shadowColor: '#023e8a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 6,
  },
  gradientCompact: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 0,
    elevation: 3,
    shadowOpacity: 0.14,
    shadowRadius: 4,
  },
  gradientRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    marginBottom: 10,
  },
  iconContainerSolo: {
    marginBottom: 0,
  },
  iconContainerRow: {
    marginBottom: 0,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
