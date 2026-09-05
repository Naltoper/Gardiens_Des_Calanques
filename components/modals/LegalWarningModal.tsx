import { ShieldAlert, X } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '../../constants/theme';

interface LegalWarningModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LegalWarningModal = ({ visible, onClose, onConfirm }: LegalWarningModalProps) => {
  const [isChecked, setIsChecked] = React.useState(false);

  useEffect(() => {
    if (!visible) setIsChecked(false);
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose} hitSlop={12}>
            <X size={20} color={Colors.light.textMuted} />
          </TouchableOpacity>

          <View style={styles.iconCircle}>
            <ShieldAlert size={26} color={Colors.light.primary} strokeWidth={2.2} />
          </View>

          <Text style={styles.title}>Rappel juridique important</Text>

          <View style={styles.messageBox}>
            <Text style={styles.messageText}>
              Je confirme que les informations transmises sont sincères. Un signalement{' '}
              <Text style={styles.messageHighlight}>
                volontairement inexacts ou mensongers
              </Text>{' '}
              peut donner lieu à des sanctions.
            </Text>
          </View>

          <Text style={styles.lawText}>
            Article 226-10 du Code pénal : la dénonciation calomnieuse est passible de
            sanctions pénales.
          </Text>

          <TouchableOpacity
            style={styles.checkboxContainer}
            activeOpacity={0.8}
            onPress={() => setIsChecked(!isChecked)}
          >
            <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
              {isChecked && <Text style={styles.checkboxCheckmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>Je confirme l&apos;exactitude des faits</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.confirmBtn, !isChecked && styles.confirmBtnDisabled]}
            onPress={onConfirm}
            disabled={!isChecked}
            activeOpacity={0.85}
          >
            <Text style={styles.confirmBtnText}>Confirmer l&apos;envoi</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.cancelBtn} activeOpacity={0.75}>
            <Text style={styles.cancelBtnText}>Modifier mon signalement</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

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
    backgroundColor: Colors.light.surface,
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
    fontSize: 22,
    fontWeight: '800',
    color: Colors.light.primary,
    textAlign: 'center',
    marginBottom: 18,
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
  messageHighlight: {
    fontWeight: '800',
    color: Colors.light.status.warning,
  },
  lawText: {
    fontSize: 12,
    color: Colors.light.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
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
    backgroundColor: Colors.light.surface,
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
  },
  confirmBtn: {
    width: '100%',
    backgroundColor: Colors.light.primary,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  confirmBtnDisabled: {
    backgroundColor: '#94A3B8',
    shadowOpacity: 0,
    elevation: 0,
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  cancelBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  cancelBtnText: {
    color: Colors.light.primary,
    fontWeight: '600',
    fontSize: 15,
  },
});
