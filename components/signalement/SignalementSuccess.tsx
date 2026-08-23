import { ShieldCheck } from 'lucide-react-native';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { GARDIAN_CLAIR } from '../../constants/theme';

type SignalementSuccessProps = {
  visible: boolean;
  onGoSuivis: () => void;
  onClose: () => void;
};

export default function SignalementSuccess({
  visible,
  onGoSuivis,
  onClose,
}: SignalementSuccessProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <ShieldCheck size={56} color="#2a9d8f" />
          </View>

          <Text style={styles.title}>Signalement transmis</Text>
          <Text style={styles.text}>
            Ta parole a été recueillie avec succès. Les membres de la cellule vont
            analyser ton message et agir pour t&apos;aider.
          </Text>

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={onGoSuivis}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Voir mes suivis"
          >
            <Text style={styles.primaryBtnText}>Voir mes suivis</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={onClose}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Retour à l'accueil"
          >
            <Text style={styles.secondaryBtnText}>Retour à l&apos;accueil</Text>
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
    maxWidth: 400,
    backgroundColor: GARDIAN_CLAIR,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(2, 62, 138, 0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 12,
  },
  iconWrap: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#023e8a',
    textAlign: 'center',
    marginBottom: 10,
  },
  text: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  primaryBtn: {
    width: '100%',
    backgroundColor: '#023e8a',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryBtn: {
    width: '100%',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  secondaryBtnText: {
    color: '#0077b6',
    fontSize: 15,
    fontWeight: '700',
  },
});
