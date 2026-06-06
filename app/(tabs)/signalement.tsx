import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Switch, 
  Text, TextInput, View, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { GradientButton } from '../../components/buttons/GradientButton';
import CustomSelect from '../../components/signalement/CustomSelect';
import SignalementSuccess from '../../components/signalement/SignalementSuccess';
import { useUserToken } from '../../hooks/useUserToken';
import { useSignalementForm } from '../../hooks/useSignalementForm';
import { SELECT_FIELDS } from '../../constants/signalementFields';
import { ScreenHeader } from '../../components/headers/ScreenHeader';
import { LegalWarningModal } from '../../components/modals/LegalWarningModal';


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
    <View style={styles.mainContainer}>
      <ImageBackground
        source={require('../../assets/images/lyceeBg.jpg')} // Ton image de fond marine commune
        style={styles.screenBackground}
        imageStyle={styles.screenBackgroundImage}
        resizeMode="cover"
      >
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
      {[0, 2, 4].map((startIndex) => {
        // 1. On vérifie si l'un des menus de CETTE ligne est actif
        const isRowActive = SELECT_FIELDS.slice(startIndex, startIndex + 2).some(
          (field) => activeMenu === field.id
        );

        return (
          <View 
            style={[
              styles.row, 
              // 🟢 Si la ligne est active, on lui donne un zIndex immense (ex: 100) pour passer devant les lignes du dessous
              isRowActive ? { zIndex: 100, elevation: 100 } : { zIndex: 1, elevation: 1 }
            ]} 
            key={`row-${startIndex}`}
          >
            {SELECT_FIELDS.slice(startIndex, startIndex + 2).map((field) => {
              // 2. On vérifie si ce sélecteur précis est celui qui est ouvert
              const isMenuOpen = activeMenu === field.id;

              return (
                <View 
                  style={[
                    styles.column,
                    // 🟢 Si ce menu est ouvert, sa colonne passe aussi devant sa colonne voisine
                    isMenuOpen ? { zIndex: 200, elevation: 200 } : { zIndex: 1, elevation: 1 }
                  ]} 
                  key={field.id}
                >
                  <CustomSelect
                    label={field.label}
                    value={getValueById(field.id)}
                    options={field.options}
                    visible={isMenuOpen}
                    onToggle={() => toggleMenu(field.id)}
                    onSelect={(val) => setterById(field.id, val)}
                    placeholder={field.placeholder}
                  />
                </View>
              );
            })}
          </View>
        );
      })}

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
      <LegalWarningModal 
        visible={showWarningModal}
        onClose={() => setShowWarningModal(false)}
        onConfirm={() => {
          setShowWarningModal(false);
          handleSend();
        }}
      />
    </ScrollView>
      </ImageBackground>
    </View> // Fin du ScrollView existant
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
  mainContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  screenBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  screenBackgroundImage: {
    opacity: 0.1, 
  },
});