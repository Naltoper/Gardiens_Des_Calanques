import { Shield, Info } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AnonymityInfoModal } from '../modals/AnonymityInfoModal';

const PALETTE = {
  primary: '#023E8A',
  primaryLight: '#0077B6',
  accentBg: '#E0F2FE',
  accentBorder: '#BAE6FD',
  surface: '#E2F4F3',
};

export function AnonymityBadge() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.badge}>
          <Shield size={14} color={PALETTE.primaryLight} strokeWidth={2.5} />
          <Text style={styles.badgeText}>Anonymat partiel</Text>
        </View>

        <TouchableOpacity
          style={styles.learnMoreButton}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.75}
          hitSlop={6}
        >
          <Info size={12} color={PALETTE.primary} strokeWidth={2.5} />
          <Text style={styles.learnMoreText}>En savoir plus</Text>
        </TouchableOpacity>
      </View>

      <AnonymityInfoModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PALETTE.surface,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: PALETTE.accentBorder,
    gap: 6,
  },
  badgeText: {
    fontSize: 14,
    color: PALETTE.primaryLight,
    fontWeight: '600',
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: PALETTE.accentBg,
    borderWidth: 1,
    borderColor: PALETTE.accentBorder,
  },
  learnMoreText: {
    fontSize: 12,
    color: PALETTE.primary,
    fontWeight: '600',
  },
});
