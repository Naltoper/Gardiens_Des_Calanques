import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';

export const ReportDetailModal = ({ visible, onClose, report }: any) => {
  if (!report) return null;

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Détails du signalement</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#023e8a" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <DetailRow label="Type de harcèlement" value={report.type_harcelement} />
            <DetailRow 
                label="Niveau d'urgence" 
                value={report.urgence} 
                color={report.urgence?.includes('Élevé') ? '#e63946' : '#334155'} 
            />
            <DetailRow label="Lieu des faits" value={report.lieu} />
            <DetailRow label="Date / Période" value={report.date_faits} />
            <DetailRow label="Fréquence" value={report.frequence} />
            <DetailRow label="Victimes" value={report.nb_victimes} />

            <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.detailLabel}>Description complète :</Text>
              <Text style={styles.fullDescription}>{report.content}</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

// Petit composant interne pour éviter de répéter les View des lignes
const DetailRow = ({ label, value, color = '#334155' }: any) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label} :</Text>
    <Text style={[styles.detailValue, { color }]}>{value || "Non précisé"}</Text>
  </View>
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end', // Le modal arrive du bas
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#023e8a',
  },
  detailRow: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  detailLabel: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '600',
  },
  fullDescription: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
    marginTop: 5,
    fontStyle: 'italic'
  },
});