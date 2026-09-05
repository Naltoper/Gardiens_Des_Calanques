import { CheckCircle2 } from 'lucide-react-native';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { GARDIAN_CLAIR } from '../../constants/theme';

type CommunityPostSuccessModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function CommunityPostSuccessModal({
  visible,
  onClose,
}: CommunityPostSuccessModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <CheckCircle2 size={40} color="#16a34a" />
          </View>
          <Text style={styles.title}>Sujet publié</Text>
          <Text style={styles.text}>
            Ton message a bien été envoyé et apparaît maintenant dans le fil de la
            communauté.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={onClose}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Fermer"
          >
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: GARDIAN_CLAIR,
    borderRadius: 22,
    paddingHorizontal: 22,
    paddingVertical: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(2, 62, 138, 0.12)',
  },
  iconWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#023e8a',
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 18,
  },
  button: {
    width: '100%',
    backgroundColor: '#023e8a',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
});
