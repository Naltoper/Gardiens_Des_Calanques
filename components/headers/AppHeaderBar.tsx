import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

import {
  GARDIAN_CLAIR,
  HEADER_FG,
  HEADER_FG_MUTED,
  HEADER_GRADIENT_COLORS,
  HEADER_GRADIENT_END,
  HEADER_GRADIENT_START,
} from '../../constants/theme';

/** Hauteur identique sur toutes les pages (hors safe-area déjà gérée à la racine). */
export const HEADER_PADDING_VERTICAL = 11;
export const HEADER_ROW_MIN_HEIGHT = 44;

type AppHeaderBarProps = {
  left: React.ReactNode;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  style?: ViewStyle;
};

export function AppHeaderBar({
  left,
  title,
  subtitle,
  right,
  style,
}: AppHeaderBarProps) {
  return (
    <View style={[styles.wrap, style]}>
      <LinearGradient
        colors={[...HEADER_GRADIENT_COLORS]}
        start={HEADER_GRADIENT_START}
        end={HEADER_GRADIENT_END}
        style={styles.gradient}
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
    paddingVertical: HEADER_PADDING_VERTICAL,
    width: '100%',
    minHeight: HEADER_PADDING_VERTICAL * 2 + HEADER_ROW_MIN_HEIGHT,
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.28)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    justifyContent: 'center',
    paddingHorizontal: 6,
    minHeight: HEADER_ROW_MIN_HEIGHT,
  },
  title: {
    color: HEADER_FG,
    fontSize: 19,
    lineHeight: 23,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: HEADER_FG_MUTED,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 2,
  },
  subtitleSpacer: {
    height: 18,
  },
});
