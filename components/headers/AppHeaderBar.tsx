import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  GARDIAN_CLAIR,
  HEADER_FG,
  HEADER_FG_MUTED,
  HEADER_GRADIENT_COLORS,
  HEADER_GRADIENT_END,
  HEADER_GRADIENT_START,
} from '../../constants/theme';

/** Hauteur de contenu hors safe-area — calée sur le Chat (titre + bouton détails). */
export const HEADER_PADDING_TOP_EXTRA = 12;
export const HEADER_PADDING_BOTTOM = 16;
export const HEADER_ROW_MIN_HEIGHT = 44;
export const HEADER_SECONDARY_SLOT_HEIGHT = 54;

type AppHeaderBarProps = {
  left: React.ReactNode;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  secondary?: React.ReactNode;
  style?: ViewStyle;
};

export function AppHeaderBar({
  left,
  title,
  subtitle,
  right,
  secondary,
  style,
}: AppHeaderBarProps) {
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top, Platform.OS === 'android' ? 12 : 0);

  return (
    <View style={[styles.wrap, style]}>
      <LinearGradient
        colors={[...HEADER_GRADIENT_COLORS]}
        start={HEADER_GRADIENT_START}
        end={HEADER_GRADIENT_END}
        style={[styles.gradient, { paddingTop: topPadding + HEADER_PADDING_TOP_EXTRA }]}
      >
        <View style={styles.row}>
          <View style={styles.side}>{left}</View>
          <View style={styles.titleBlock}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            {subtitle ? (
              <Text style={styles.subtitle} numberOfLines={1}>
                {subtitle}
              </Text>
            ) : (
              <View style={styles.subtitleSpacer} />
            )}
          </View>
          <View style={styles.side}>{right}</View>
        </View>
        <View style={styles.secondarySlot}>{secondary}</View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    backgroundColor: GARDIAN_CLAIR,
    zIndex: 10,
  },
  gradient: {
    paddingHorizontal: 10,
    paddingBottom: HEADER_PADDING_BOTTOM,
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
    minHeight: HEADER_ROW_MIN_HEIGHT,
  },
  side: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 6,
    minHeight: HEADER_ROW_MIN_HEIGHT,
    justifyContent: 'center',
  },
  title: {
    color: HEADER_FG,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: HEADER_FG_MUTED,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 3,
  },
  subtitleSpacer: {
    height: 19,
  },
  secondarySlot: {
    height: HEADER_SECONDARY_SLOT_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
