import { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import { useKeyboardBottomInset } from '../../hooks/useKeyboardBottomInset';

type KeyboardAwareBodyProps = {
  children: ReactNode;
  /**
   * Distance between the bottom of this view and the bottom of the screen
   * (tab bar, etc.). Used as iOS `keyboardVerticalOffset` so the composer
   * sits just above the keyboard instead of behind the bottom bar.
   */
  keyboardVerticalOffset?: number;
  style?: ViewStyle;
};

/**
 * Wraps the scrollable content + composer. Keep the screen header OUTSIDE
 * this component so it stays pinned to the top when the keyboard opens.
 */
export function KeyboardAwareBody({
  children,
  keyboardVerticalOffset = 0,
  style,
}: KeyboardAwareBodyProps) {
  const webInset = useKeyboardBottomInset();

  return (
    <KeyboardAvoidingView
      style={[
        styles.body,
        style,
        Platform.OS === 'web' ? { paddingBottom: webInset } : null,
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : Platform.OS === 'android' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'web' ? 0 : keyboardVerticalOffset}
      enabled={Platform.OS !== 'web'}
    >
      {children}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
});
