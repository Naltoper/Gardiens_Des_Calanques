import { Bell } from 'lucide-react-native';
import { useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useWebPush } from '../../hooks/useWebPush';

export function PushPermissionBanner() {
  const { supported, busy, registered, syncError, lastStore, enable } = useWebPush();
  const [dismissed, setDismissed] = useState(false);

  if (Platform.OS !== 'web' || !supported || registered || dismissed) return null;

  const hasError = Boolean(syncError);

  return (
    <View style={[styles.banner, hasError && styles.bannerError]}>
      <View style={styles.row}>
        <View style={[styles.iconWrap, hasError && styles.iconWrapError]}>
          <Bell color="#FFFFFF" size={18} strokeWidth={2.4} />
        </View>
        <View style={styles.textWrap}>
          <Text style={[styles.title, hasError && styles.titleError]}>
            {hasError ? 'Échec de l’enregistrement des notifications' : 'Notifications de chat'}
          </Text>
          {hasError ? (
            <Text style={styles.errorDetail} selectable>
              {syncError}
            </Text>
          ) : (
            <Text style={styles.subtitle}>
              Reçois une alerte même si l'application est fermée, dès qu'un intervenant te répond.
              {lastStore ? ` (${lastStore})` : ''}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => {
            void enable();
          }}
          style={[styles.enableBtn, hasError && styles.retryBtn]}
          activeOpacity={0.85}
          disabled={busy}
          accessibilityRole="button"
          accessibilityLabel={hasError ? 'Réessayer' : 'Activer les notifications'}
        >
          <Text style={[styles.enableText, hasError && styles.retryText]}>
            {busy ? 'Envoi en cours…' : hasError ? 'Réessayer' : 'Activer'}
          </Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#0B4F8A',
    padding: 14,
    borderRadius: 15,
    marginBottom: 16,
    gap: 10,
  },
  bannerError: {
    backgroundColor: '#2A0A0A',
    borderWidth: 1,
    borderColor: '#E53935',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
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
  iconWrapError: {
    backgroundColor: 'rgba(229,57,53,0.25)',
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
  titleError: {
    color: '#FF6B6B',
  },
  subtitle: {
    color: '#CAF0F8',
    fontSize: 11,
    marginTop: 2,
    lineHeight: 16,
  },
  errorDetail: {
    color: '#FF6B6B',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    lineHeight: 17,
  },
  enableBtn: {
    backgroundColor: '#76C893',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  retryBtn: {
    backgroundColor: '#E53935',
  },
  enableText: {
    color: '#023E8A',
    fontWeight: '800',
    fontSize: 13,
  },
  retryText: {
    color: '#FFFFFF',
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
