import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Colors } from '../../constants/theme';

interface DeleteConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
}

export function DeleteConfirmModal({
  visible,
  onClose,
  onConfirm,
  message = 'Voulez-vous vraiment supprimer ce signalement ?',
}: DeleteConfirmModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.actions}>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.button,
                styles.cancelButton,
                pressed && styles.buttonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Annuler"
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              style={({ pressed }) => [
                styles.button,
                styles.confirmButton,
                pressed && styles.buttonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Confirmer la suppression"
            >
              <Text style={styles.confirmButtonText}>Confirmer</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 22,
    paddingVertical: 24,
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 22,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    minHeight: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  cancelButton: {
    backgroundColor: Colors.light.borderSubtle,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.textMuted,
  },
  confirmButton: {
    backgroundColor: Colors.light.status.error,
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
