import { Shield, X } from 'lucide-react-native';
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AnonymityInfoModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AnonymityInfoModal = ({ visible, onClose }: AnonymityInfoModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose} hitSlop={12}>
            <X size={20} color="#64748b" />
          </TouchableOpacity>

          <View style={styles.iconCircle}>
            <Shield size={28} color="#0077b6" strokeWidth={2.5} />
          </View>

          <Text style={styles.title}>Anonymat partiel</Text>
          <Text style={styles.subtitle}>Comment vos données sont protégées</Text>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <View style={styles.bulletRow}>
                <View style={styles.bulletDot} />
                <Text style={styles.paragraph}>
                  Votre signalement peut être transmis de manière{' '}
                  <Text style={styles.highlight}>anonyme</Text>. Votre identité n&apos;est
                  pas communiquée aux autres élèves.
                </Text>
              </View>
            </View>

            <View style={[styles.section, styles.warningSection]}>
              <View style={styles.bulletRow}>
                <View style={[styles.bulletDot, styles.warningDot]} />
                <Text style={styles.paragraph}>
                  Toutefois, l&apos;anonymat peut être levé par la{' '}
                  <Text style={styles.highlight}>CPE</Text> ou la{' '}
                  <Text style={styles.highlight}>direction</Text> uniquement en cas de{' '}
                  <Text style={styles.highlight}>force majeure</Text> ou de{' '}
                  <Text style={styles.highlight}>danger grave ou imminent</Text>.
                </Text>
              </View>
            </View>

            <Text style={styles.footerNote}>
              Cette mesure vise à protéger la communauté scolaire tout en garantissant
              un traitement responsable des situations les plus urgentes.
            </Text>
          </ScrollView>

          <TouchableOpacity style={styles.confirmButton} onPress={onClose} activeOpacity={0.85}>
            <Text style={styles.confirmButtonText}>J&apos;ai compris</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    paddingTop: 20,
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
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#023e8a',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
  },
  body: {
    maxHeight: 260,
    marginBottom: 20,
  },
  section: {
    marginBottom: 16,
  },
  warningSection: {
    backgroundColor: '#fff7ed',
    borderRadius: 14,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bulletDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0077b6',
    marginTop: 6,
    flexShrink: 0,
  },
  warningDot: {
    backgroundColor: '#f59e0b',
  },
  paragraph: {
    flex: 1,
    fontSize: 15,
    lineHeight: 23,
    color: '#334155',
  },
  highlight: {
    fontWeight: '700',
    color: '#023e8a',
  },
  footerNote: {
    fontSize: 13,
    lineHeight: 20,
    color: '#94a3b8',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
  },
  confirmButton: {
    backgroundColor: '#023e8a',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
