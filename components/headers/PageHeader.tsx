import { LinearGradient } from 'expo-linear-gradient';
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

import {
  HEADER_BACKDROP,
  HEADER_FG,
  HEADER_FG_MUTED,
  HEADER_GRADIENT_COLORS,
  HEADER_GRADIENT_END,
  HEADER_GRADIENT_START,
} from '../../constants/theme';

export type PageHeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  /** Conservé pour compatibilité — le header utilise désormais le dégradé Chat */
  translucent?: boolean;
  style?: ViewStyle;
};

export function PageHeader({
  title,
  subtitle,
  onBack,
  style,
}: PageHeaderProps) {
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top, Platform.OS === 'android' ? 12 : 0);

  return (
    <View style={[styles.headerWrap, style]}>
      <LinearGradient
        colors={[...HEADER_GRADIENT_COLORS]}
        start={HEADER_GRADIENT_START}
        end={HEADER_GRADIENT_END}
        style={[styles.headerGradient, { paddingTop: topPadding + 12 }]}
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
              <ChevronLeft color={HEADER_FG} size={30} strokeWidth={2.5} />
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
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrap: {
    width: '100%',
    backgroundColor: HEADER_BACKDROP,
    zIndex: 10,
  },
  headerGradient: {
    paddingHorizontal: 10,
    paddingBottom: 16,
    width: '100%',
    elevation: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.35)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
  },
  backButton: {
    padding: 5,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backPlaceholder: {
    width: 40,
    height: 40,
  },
  titleBlock: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  title: {
    color: HEADER_FG,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: HEADER_FG_MUTED,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 3,
  },
});
