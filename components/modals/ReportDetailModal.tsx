import React from 'react';
import { Modal, View, Text, StyleSheet, 
  TouchableOpacity, ScrollView, Image } from 'react-native';
import { X } from 'lucide-react-native';
import * as WebBrowser from 'expo-web-browser';

export const ReportDetailModal = ({ visible, onClose, report }: any) => {
  if (!report) return null;

  return (
    <Modal 
      animationType="fade" // 🟢 On passe en fondu pour une transition douce sans coupure visuelle
      transparent={true} 
      visible={visible} 
      onRequestClose={onClose}
    >
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
            {/* Affichage de la pièce jointe si elle existe */}
            {report?.image_url ? (
              <View style={styles.imageSection}>
                <Text style={styles.imageLabel}>📸 Pièce jointe (Clique pour agrandir/télécharger) :</Text>
                
                {/* 2. ON ENTOUR L'IMAGE PAR UN BOUTON */}
                <TouchableOpacity 
                  activeOpacity={0.8}
                  onPress={async () => {
                    // Ouvre l'image directement dans un navigateur plein écran sécurisé
                    await WebBrowser.openBrowserAsync(report.image_url);
                  }}
                >
                  <Image 
                    source={{ uri: report.image_url }} 
                    style={styles.attachedImage} 
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.imageSection}>
                <Text style={styles.noImageText}>🚫 Aucune pièce jointe associée</Text>
              </View>
            )}
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // 🟢 Fond assombri légèrement plus dense pour isoler le contenu
    justifyContent: 'center', // 🟢 Centre la modale verticalement
    alignItems: 'center',     // 🟢 Centre la modale horizontalement
    padding: 20,              // 🟢 Donne de l'espace autour de la carte pour qu'elle ne touche pas les bords de l'écran
  },
  modalView: {
    width: '100%',            // Prend toute la largeur disponible dans le padding
    backgroundColor: 'white',
    borderRadius: 24,         // 🟢 Arrondit joliment les 4 coins de la carte flottante
    padding: 24,
    maxHeight: '85%',         // Évite que la modale ne dépasse sur les écrans de smartphones plus petits
    
    // 🟢 Ombre premium pour donner l'impression que la carte flotte au-dessus de l'écran
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
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
  imageSection: {
    marginTop: 20,
    marginBottom: 10,
  },
  imageLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  attachedImage: {
    width: '100%',
    height: 220,
    borderRadius: 15,
    backgroundColor: '#cbd5e1', // Un fond gris en attendant le chargement de l'image
  },
  noImageText: {
    fontSize: 13,
    color: '#94a3b8',
    fontStyle: 'italic',
    marginTop: 10,
  },
});