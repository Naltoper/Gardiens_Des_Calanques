import { ShieldCheck } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type SignalementSuccessProps = {
  onBackHome: () => void;
};

export default function SignalementSuccess({ onBackHome }: SignalementSuccessProps) {
  return (
    <View style={styles.successContainer}>
      <View style={styles.successIcon}>
        <ShieldCheck size={80} color="#2a9d8f" />
      </View>

      <Text style={styles.successTitle}>Signalement transmis</Text>

      <Text style={styles.successText}>
        Ta parole a été recueillie avec succès. Les membres de la cellule vont analyser ton message et agir pour t&apos;aider.
      </Text>

      <TouchableOpacity style={styles.btnSecondary} onPress={onBackHome}>
        <Text style={styles.btnSecondaryText}>Retour à l&apos;écran d&apos;accueil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 35,
    backgroundColor: '#fff',
  },
  successIcon: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#023e8a',
    marginBottom: 15,
    textAlign: 'center',
  },
  successText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  btnSecondary: {
    paddingVertical: 10,
  },
  btnSecondaryText: {
    color: '#00b4d8',
    fontWeight: '700',
    fontSize: 16,
  },
});