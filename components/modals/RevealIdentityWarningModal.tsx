import { ShieldAlert, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Colors, GARDIAN_CLAIR } from '../../constants/theme';
import { AnonymityInfoModal } from './AnonymityInfoModal';

type RevealIdentityWarningModalProps = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function RevealIdentityWarningModal({
  visible,
  onCancel,
  onConfirm,
}: RevealIdentityWarningModalProps) {
  const [confirmed, setConfirmed] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);

  useEffect(() => {
    if (!visible) {
      setConfirmed(false);
      setInfoVisible(false);
    }
  }, [visible]);

  return (
    <>
      <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
        <View style={styles.overlay}>
          <View style={styles.card}>
            <TouchableOpacity style={styles.closeButton} onPress={onCancel} hitSlop={12}>
              <X size={20} color={Colors.light.textMuted} />
            </TouchableOpacity>

            <View style={styles.iconCircle}>
              <ShieldAlert size={26} color={Colors.light.primary} strokeWidth={2.2} />
            </View>

            <Text style={styles.title}>Retirer l&apos;anonymat ?</Text>

            <View style={styles.messageBox}>
              <Text style={styles.messageText}>
                Ton identité d&apos;élève sera désormais{' '}
                <Text style={styles.highlight}>visible par les gestionnaires</Text> de
                l&apos;établissement (cellule, vie scolaire, direction).
              </Text>
            </View>

            <Text style={styles.lawText}>
              L&apos;usurpation d&apos;identité est interdite. En indiquant un nom, tu
              confirmes qu&apos;il s&apos;agit bien du tien, conformément aux conditions
              d&apos;utilisation.
            </Text>

            <TouchableOpacity
              style={styles.learnMore}
              onPress={() => setInfoVisible(true)}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel="En savoir plus sur l'anonymat"
            >
              <Text style={styles.learnMoreText}>En savoir plus</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkboxContainer}
              activeOpacity={0.8}
              onPress={() => setConfirmed((current) => !current)}
            >
              <View style={[styles.checkbox, confirmed && styles.checkboxChecked]}>
                {confirmed ? <Text style={styles.checkboxCheckmark}>✓</Text> : null}
              </View>
              <Text style={styles.checkboxLabel}>
                Je comprends que mon identité sera visible par les gestionnaires et
                j&apos;accepte les conditions d&apos;utilisation.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.confirmBtn, !confirmed && styles.confirmBtnDisabled]}
              onPress={onConfirm}
              disabled={!confirmed}
              activeOpacity={0.85}
            >
              <Text style={styles.confirmBtnText}>Confirmer et retirer l&apos;anonymat</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onCancel} style={styles.cancelBtn} activeOpacity={0.75}>
              <Text style={styles.cancelBtnText}>Rester anonyme</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <AnonymityInfoModal visible={infoVisible} onClose={() => setInfoVisible(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: GARDIAN_CLAIR,
    borderRadius: 24,
    padding: 24,
    paddingTop: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 4,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 21,
    fontWeight: '800',
    color: Colors.light.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  messageBox: {
    backgroundColor: '#FFF7ED',
    borderRadius: 14,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.status.warning,
    marginBottom: 12,
  },
  messageText: {
    fontSize: 15,
    color: Colors.light.text,
    lineHeight: 22,
    fontWeight: '500',
  },
  highlight: {
    fontWeight: '800',
    color: Colors.light.status.warningText,
  },
  lawText: {
    fontSize: 13,
    color: Colors.light.textMuted,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 10,
  },
  learnMore: {
    alignSelf: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 14,
  },
  learnMoreText: {
    color: Colors.light.primary,
    fontSize: 13,
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 18,
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2.5,
    borderColor: '#475569',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 1,
    backgroundColor: GARDIAN_CLAIR,
  },
  checkboxChecked: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  checkboxCheckmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
  },
  checkboxLabel: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: '600',
    flex: 1,
    lineHeight: 20,
  },
  confirmBtn: {
    width: '100%',
    backgroundColor: Colors.light.primary,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
  },
  confirmBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'center',
  },
  cancelBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: GARDIAN_CLAIR,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  cancelBtnText: {
    color: Colors.light.primary,
    fontWeight: '600',
    fontSize: 15,
  },
});
