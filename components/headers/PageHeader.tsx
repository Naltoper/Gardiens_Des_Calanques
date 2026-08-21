import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '../../constants/theme';

export type PageHeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  /** Fond semi-transparent pour les écrans avec image de fond */
  translucent?: boolean;
  style?: ViewStyle;
};

export function PageHeader({
  title,
  subtitle,
  onBack,
  translucent = true,
  style,
}: PageHeaderProps) {
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top, Platform.OS === 'android' ? 12 : 0);

  return (
    <View
      style={[
        styles.container,
        translucent ? styles.containerTranslucent : styles.containerSolid,
        { paddingTop: topPadding + 8 },
        style,
      ]}
    >
      <View style={styles.row}>
        {onBack ? (
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Retour"
          >
            <ChevronLeft color={Colors.light.primary} size={26} strokeWidth={2.5} />
          </TouchableOpacity>
        ) : (
          <View style={styles.backPlaceholder} />
        )}

        <View style={styles.titleBlock}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={2}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        <View style={styles.backPlaceholder} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  containerTranslucent: {
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
  },
  containerSolid: {
    backgroundColor: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(241, 245, 249, 0.9)',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  backPlaceholder: {
    width: 40,
    height: 40,
  },
  titleBlock: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.light.primary,
    textAlign: 'center',
    letterSpacing: 0.2,
    lineHeight: 26,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.light.textMuted,
    textAlign: 'center',
    marginTop: 3,
    lineHeight: 18,
    fontWeight: '500',
  },
});
