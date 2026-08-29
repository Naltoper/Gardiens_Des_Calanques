import { Bell } from 'lucide-react-native';
import { useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { usePushNotifications } from '../../hooks/usePushNotifications';

export function PushPermissionBanner() {
  const { supported, busy, subscribed, error, enable } = usePushNotifications();
  const [dismissed, setDismissed] = useState(false);

  if (Platform.OS !== 'web' || !supported || subscribed || dismissed) return null;

  const hasError = Boolean(error);

  return (
    <View style={styles.banner}>
      <View style={styles.iconWrap}>
        <Bell color="#FFFFFF" size={18} strokeWidth={2.4} />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.title}>
          {hasError ? 'Notifications non activées' : 'Notifications de chat'}
        </Text>
        <Text style={styles.subtitle}>
          {hasError
            ? error
            : "Reçois une alerte même si l'application est fermée, dès qu'un intervenant te répond."}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          void enable();
        }}
        style={styles.enableBtn}
        activeOpacity={0.85}
        disabled={busy}
        accessibilityRole="button"
        accessibilityLabel="Activer les notifications"
      >
        <Text style={styles.enableText}>{busy ? '…' : hasError ? 'Réessayer' : 'Activer'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setDismissed(true)}
        style={styles.dismissBtn}
        accessibilityRole="button"
        accessibilityLabel="Plus tard"
      >
        <Text style={styles.dismissText}>Plus tard</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#0B4F8A',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    marginBottom: 16,
    gap: 10,
    flexWrap: 'wrap',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
    minWidth: 160,
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  subtitle: {
    color: '#CAF0F8',
    fontSize: 11,
    marginTop: 2,
    lineHeight: 16,
  },
  enableBtn: {
    backgroundColor: '#76C893',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  enableText: {
    color: '#023E8A',
    fontWeight: '800',
    fontSize: 13,
  },
  dismissBtn: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  dismissText: {
    color: 'rgba(255,255,255,0.72)',
    fontWeight: '700',
    fontSize: 12,
  },
});
