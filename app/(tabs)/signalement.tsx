import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Switch, 
  Text, TextInput, View, Image, TouchableOpacity, Modal } from 'react-native';
import { GradientButton } from '../../components/buttons/GradientButton';
import CustomSelect from '../../components/signalement/CustomSelect';
import SignalementSuccess from '../../components/signalement/SignalementSuccess';
import { useUserToken } from '../../hooks/useUserToken';
import { useSignalementForm } from '../../hooks/useSignalementForm';
import { SELECT_FIELDS } from '../../constants/signalementFields';
import { ScreenHeader } from '../../components/headers/ScreenHeader';


export default function SignalementScreen() {
  const router = useRouter();
  
  // On récupère tout ce dont on a besoin depuis le hook
  const {
    isAnonyme, setIsAnonyme,
    nom, setNom,
    desc, setDesc,
    typeHarcelement, setTypeHarcelement,
    urgence, setUrgence,
    dateApproximative, setDateApproximative,
    lieu, setLieu,
    frequence, setFrequence,
    nbVictimes, setNbVictimes,
    image, setImage, // <-- NOUVEAU
    pickImage,
    loading,
    isSent,
    setIsSent,
    handleSend
  } = useSignalementForm();

  const userToken = useUserToken();
  const isWeb = Platform.OS === 'web';

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showWarningModal, setShowWarningModal] = useState(false);

  const toggleMenu = (menuName: string) => {
    setActiveMenu(prev => (prev === menuName ? null : menuName));
  };

  // 3. Helpers pour le mapping dynamique
  const getValueById = (id: string) => {
    const values: Record<string, string> = { 
        types: typeHarcelement, urgence, dateApproximative, lieu, frequence, nbVictimes 
    };
    // Petite correction pour correspondre aux noms des variables du hook
    if (id === 'date') return dateApproximative;
    return values[id];
  };

  const setterById = (id: string, val: string) => {
    const setters: Record<string, (v: string) => void> = {
      types: setTypeHarcelement,
      urgence: setUrgence,
      date: setDateApproximative,
      lieu: setLieu,
      frequence: setFrequence,
      nbVictimes: setNbVictimes
    };
    setters[id](val);
  };

  if (isSent) {
    return <SignalementSuccess onBackHome={() => router.replace('/(tabs)')} />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <ScreenHeader 
      title="Fiche de Signalement" 
      onBack={() => router.replace('/(tabs)')} 
      />

      <View style={styles.switchContainer}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Rester anonyme ?</Text>
          <Text style={styles.subLabel}>Ton identité sera masquée</Text>
        </View>
        <Switch
          value={isAnonyme}
          onValueChange={setIsAnonyme}
          trackColor={{ false: "#cbd5e1", true: "#76c893" }}
          thumbColor={isAnonyme ? "#ffffff" : "#f4f3f4"}
        />
      </View>

      {!isAnonyme && (
        <View style={styles.section}>
          <Text style={styles.label}>Ton identité :</Text>
          <TextInput
            style={styles.inputSmall}
            placeholder="Nom, Prénom et Classe"
            placeholderTextColor="#94a3b8"
            value={nom}
            onChangeText={setNom}
          />
        </View>
      )}

      {/* Rendu dynamique des sélecteurs par paires */}
      {[0, 2, 4].map((startIndex) => (
        <View style={styles.row} key={`row-${startIndex}`}>
          {SELECT_FIELDS.slice(startIndex, startIndex + 2).map((field) => (
            <View style={styles.column} key={field.id}>
              <CustomSelect
                label={field.label}
                value={getValueById(field.id)}
                options={field.options}
                visible={activeMenu === field.id}
                onToggle={() => toggleMenu(field.id)}
                onSelect={(val) => setterById(field.id, val)}
                placeholder={field.placeholder}
              />
            </View>
          ))}
        </View>
      ))}

      <View style={styles.section}>
        <Text style={styles.label}>Description des faits :</Text>
        <TextInput
          style={styles.inputLarge}
          multiline
          placeholder="Raconte-nous ce qu'il se passe..."
          placeholderTextColor="#94a3b8"
          value={desc}
          onChangeText={setDesc}
        />
      </View>

      {/* NOUVEAU BLOC : PIÈCE JOINTE */}
      <View style={styles.section}>
        <Text style={styles.label}>Pièce jointe (Optionnel) :</Text>
        
        {image ? (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: image }} style={styles.imagePreview} />
            <TouchableOpacity style={styles.removeImageButton} onPress={() => setImage(null)}>
              <Text style={styles.removeImageText}>Supprimer la photo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.uploadButton} onPress={pickImage} activeOpacity={0.7}>
            <Text style={styles.uploadButtonText}>📸 Ajouter une photo / preuve</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.warningBox}>
        <Text style={styles.warningText}>
          Afin de garantir la protection de tous, rappelle-toi que le signalement de faits volontairement inexacts est sanctionné par la loi (Art. 226-10 du Code pénal).
        </Text>
      </View>

      <GradientButton
        title={loading ? "Transmission..." : "Envoyer le signalement"}
        onPress={() => setShowWarningModal(true)} // 🟢 Ouvre la modale au lieu de lancer directement l'envoi
        colors={["#48a4f4", "#10ac56"]}
        height={60}
        style={{ marginTop: 10, opacity: loading ? 0.6 : 1 }}
      />

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          {isAnonyme
            ? "🛡️ Ce signalement est strictement anonyme. Aucune donnée personnelle n'est enregistrée."
            : "👤 Ce signalement est nominatif. Seuls les intervenants autorisés pourront consulter ton nom."}
        </Text>
      </View>

      {/* MODALE PERSONNALISÉE DE RAPPEL À LA LOI */}
      <Modal visible={showWarningModal} transparent animationType="fade" onRequestClose={() => setShowWarningModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalIcon}>⚖️</Text>
            <Text style={styles.modalTitle}>Rappel juridique important</Text>
            
            <Text style={styles.modalWarningText}>
              Afin de garantir la sécurité et la protection de tous les élèves, rappelle-toi que la création d&apos;un signalement contenant des faits <Text style={{ fontWeight: '700', color: '#dd5309' }}>volontairement inexacts ou mensongers</Text> est punie par la loi.
            </Text>
            
            <Text style={styles.modalLawText}>
              (Article 226-10 du Code pénal : la dénonciation calomnieuse est passible de sanctions pénales).
            </Text>

            <TouchableOpacity 
              style={styles.confirmBtn} 
              onPress={() => {
                setShowWarningModal(false); // Ferme la modale
                handleSend();               // Lance la procédure d'envoi vers Supabase
              }}
            >
              <Text style={styles.confirmBtnText}>Je confirme l&apos;exactitude des faits</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowWarningModal(false)} style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>Modifier mon signalement</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView> // Fin du ScrollView existant
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: 'transparent' },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
  },
  section: { marginBottom: 25 },
  label: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 8 },
  subLabel: { fontSize: 13, color: '#64748b', marginTop: 2 },
  inputSmall: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#1e293b',
  },
  inputLarge: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 15,
    padding: 15,
    height: 150,
    textAlignVertical: 'top',
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#1e293b',
  },
  btn: {
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#10ac56',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  infoBox: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#f1f5f9',
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#00b4d8',
  },
  infoText: { color: '#475569', fontSize: 13, lineHeight: 20, textAlign: 'center' },
  successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 35, backgroundColor: '#fff' },
  successIcon: { marginBottom: 20 },
  successTitle: { fontSize: 26, fontWeight: '800', color: '#023e8a', marginBottom: 15, textAlign: 'center' },
  successText: { fontSize: 16, color: '#64748b', textAlign: 'center', marginBottom: 40, lineHeight: 24 },
  btnSecondary: { paddingVertical: 10 },
  btnSecondaryText: { color: '#00b4d8', fontWeight: '700', fontSize: 16 },
  warningBox: {
    marginTop: 20,
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderLeftWidth: 5,
    borderLeftColor: '#cf7820ff',
  },
  warningText: {
    color: '#475569',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'left',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  column: {
    flex: 1,
    marginHorizontal: 5,
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  uploadButtonText: {
    color: '#023e8a',
    fontWeight: '600',
    fontSize: 15,
  },
  imagePreviewContainer: {
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  removeImageButton: {
    marginTop: 10,
    padding: 10,
  },
  removeImageText: {
    color: '#ef4444',
    fontWeight: '700',
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)", // Fond sombre transparent
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
    fontSize: 18,
    fontWeight: "800",
    color: "#023e8a",
    marginBottom: 15,
    textAlign: "center",
  },
  modalWarningText: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 12,
  },
  modalLawText: {
    fontSize: 12,
    color: "#94a3b8",
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 25,
  },
  confirmBtn: {
    width: "100%",
    backgroundColor: "#f39f17", // Vert pour marquer la validation positive
    padding: 16,
    borderRadius: 15,
    alignItems: "center",
    elevation: 2,
  },
  confirmBtnText: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
  },
  cancelBtn: {
    marginTop: 15,
    padding: 10,
  },
  cancelBtnText: {
    color: "#64748b",
    fontWeight: "600",
    fontSize: 14,
  },
});