// components/modals/LegalWarningModal.tsx
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface LegalWarningModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LegalWarningModal = ({ visible, onClose, onConfirm }: LegalWarningModalProps) => {

    // 🟢 Nouvel état pour la case à cocher
  const [isChecked, setIsChecked] = React.useState(false);

  return (
    <Modal 
      visible={visible} 
      transparent 
      animationType="fade" 
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalIcon}>⚖️</Text>
          <Text style={styles.modalTitle}>Rappel juridique important</Text>
          
          <Text style={styles.modalWarningText}>
            Je confirme que les informations transmises sont sincères. Un signalement <Text style={{ fontWeight: '700', color: '#dd5309' }}>volontairement inexacts ou mensongers</Text> peut donner lieu à des sanctions.
          </Text>
          
          <Text style={styles.modalLawText}>
            (Article 226-10 du Code pénal : la dénonciation calomnieuse est passible de sanctions pénales).
          </Text>

          {/* 🟢 BLOC CASE À COCHER */}
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

          

          <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
            <Text style={styles.cancelBtnText}>Modifier mon signalement</Text>
          </TouchableOpacity>

          {/* 🟡 BOUTON CONFIRMER L'ENVOI (Modifié) */}
          <TouchableOpacity 
            style={[styles.confirmBtn, !isChecked && styles.confirmBtnDisabled]} // Applique un style grisé si décoché
            onPress={onConfirm}
            disabled={!isChecked} // Bloque l'action du bouton tant que ce n'est pas coché
          >
            <Text style={styles.confirmBtnText}>Confirmer l&apos;envoi</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24
  },
  modalContent: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 24,
    padding: 25,
    alignItems: "center",
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  modalIcon: {
    fontSize: 36,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#141132",
    marginBottom: 22,
    textAlign: "center",
  },
  modalWarningText: {
    fontSize: 16,
    color: "#000000",
    lineHeight: 19,
    textAlign: "center",
    marginBottom: 22,
    fontWeight: "800", // 👈 Ajoute ou modifie cette ligne (600 ou 700)
  },
  modalLawText: {
    fontSize: 12,
    color: "#71777f",
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 25,
  },
  confirmBtn: {
    width: "100%",
    backgroundColor: "#022d69", // Vert d'origine pour validation ou #f39f17 selon ton choix
    padding: 16,
    borderRadius: 15,
    alignItems: "center",
    elevation: 2,
    marginTop: 15,
  },
  confirmBtnText: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
  },
  cancelBtn: {
    width: "100%",
    backgroundColor: "#184ff5", // Vert d'origine pour validation ou #f39f17 selon ton choix
    padding: 16,
    borderRadius: 15,
    alignItems: "center",
    elevation: 2,
    marginTop: 5,
  },
  cancelBtnText: {
    color: "rgb(255, 255, 255)",
    fontWeight: "600",
    fontSize: 17,
  },
  // Styles pour la case à cocher
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#71777f',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#022d69',
    borderColor: '#022d69',
  },
  checkboxCheckmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
  },
  checkboxLabel: {
    fontSize: 15,
    color: '#000000',
    fontWeight: '700',
    flex: 1,
  },
  // Style pour griser le bouton s'il est désactivé
  confirmBtnDisabled: {
    backgroundColor: '#94a3b8',
    opacity: 0.5,
    elevation: 0,
  },
});