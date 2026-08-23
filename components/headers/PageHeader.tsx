import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';

import { HEADER_FG } from '../../constants/theme';
import { AppHeaderBar } from './AppHeaderBar';

export type PageHeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  /** Conservé pour compatibilité */
  translucent?: boolean;
  style?: ViewStyle;
};

export function PageHeader({
  title,
  subtitle,
  onBack,
  style,
}: PageHeaderProps) {
  return (
    <AppHeaderBar
      style={style}
      title={title}
      subtitle={subtitle}
      left={
        onBack ? (
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Retour"
          >
            <ChevronLeft color={HEADER_FG} size={26} strokeWidth={2.5} />
          </TouchableOpacity>
        ) : (
          <View style={styles.sidePlaceholder} />
        )
      }
      right={<View style={styles.sidePlaceholder} />}
    />
  );
}

const styles = StyleSheet.create({
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sidePlaceholder: {
    width: 40,
    height: 40,
  },
});
