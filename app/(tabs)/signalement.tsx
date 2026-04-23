import { View, Text, TextInput, StyleSheet, TouchableOpacity, Switch, ScrollView, Alert, Platform } from 'react-native';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import * as SecureStore from 'expo-secure-store';
import { LinearGradient } from 'expo-linear-gradient'; // Ajout pour le bouton
import { ShieldCheck, ChevronLeft, ChevronUp, ChevronDown } from 'lucide-react-native';
import { useRouter } from 'expo-router'; // Import du router pour l'action de retour

export default function SignalementScreen() {
  // -------------------------------------------------------------------------
  // 1. ÉTATS & NAVIGATION
  // -------------------------------------------------------------------------
  const router = useRouter();
  // 1. ÉTATS DE DONNÉES
  const [isAnonyme, setIsAnonyme] = useState(true);
  const [nom, setNom] = useState('');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  // Nouvelles données
  const [typeHarcelement, setTypeHarcelement] = useState('');
  const [urgence, setUrgence] = useState('');
  const [dateApproximative, setDateApproximative] = useState('');
  const [lieu, setLieu] = useState('');
  const [frequence, setFrequence] = useState('');
  const [nbVictimes, setNbVictimes] = useState('');

  // 2. ÉTATS DE VISIBILITÉ DES MENUS
  const [showTypes, setShowTypes] = useState(false);
  const [showUrgence, setShowUrgence] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [showLieu, setShowLieu] = useState(false);
  const [showFrequence, setShowFrequence] = useState(false);
  const [showNbVictimes, setShowNbVictimes] = useState(false);

  // Fonction utilitaire pour fermer les autres menus quand on en ouvre un
  const toggleMenu = (menu: string) => {
    setShowTypes(menu === 'types' ? !showTypes : false);
    setShowUrgence(menu === 'urgence' ? !showUrgence : false);
    setShowDate(menu === 'date' ? !showDate : false);
    setShowLieu(menu === 'lieu' ? !showLieu : false);
    setShowFrequence(menu === 'frequence' ? !showFrequence : false);
    setShowNbVictimes(menu === 'nbVictimes' ? !showNbVictimes : false);
  };

  // -------------------------------------------------------------------------
  // 2. LOGIQUE D'ENVOI DU SIGNALEMENT
  // -------------------------------------------------------------------------
  const handleSend = async () => {
    // Vérification de remplissage
    if (!desc.trim() || !typeHarcelement) {
      if (Platform.OS === 'web') {
        alert("Veuillez remplirVeuillez remplir le type de harcèlement et la description.");
      } else {
        Alert.alert("Erreur", "Veuillez remplirVeuillez remplir le type de harcèlement et la description.");
      }
      return;
    }

    const confirmationMessage = "Je confirme que les informations transmises sont sincères. Un signalement volontairement inexact peut donner lieu à des sanctions (Art. 226-10 du Code pénal).";

    // --- LOGIQUE DE CONFIRMATION (Adaptée Web et Mobile) ---
    const processUpload = async () => {
      setLoading(true);
      let userToken;
      const TOKEN_KEY = 'user_report_token';

      try {
        if (Platform.OS === 'web') {
          userToken = localStorage.getItem(TOKEN_KEY);
          if (!userToken) {
            userToken = "user_" + Math.random().toString(36).slice(2, 9); // TODO verif unicité
            localStorage.setItem(TOKEN_KEY, userToken);
          }
        } else {
          userToken = await SecureStore.getItemAsync(TOKEN_KEY);
          if (!userToken) {
            userToken = "user_" + Math.random().toString(36).slice(2, 9);
            await SecureStore.setItemAsync(TOKEN_KEY, userToken);
          }
        }
      } catch (e) {
        userToken = "temp_" + Math.random().toString(36).slice(2, 9);
      }

      const { error } = await supabase
  .from('reports')
  .insert([
    { 
      content: desc, 
      is_anonyme: isAnonyme, 
      author_name: isAnonyme ? "Anonyme" : nom,
      user_token: userToken,
      status: "Non traité",
      // Nouvelles colonnes ajoutées ici :
      type_harcelement: typeHarcelement,
      urgence: urgence,
      date_faits: dateApproximative,
      lieu: lieu,
      frequence: frequence,
      nb_victimes: nbVictimes
    },
  ]);

      setLoading(false);

      if (error) {
        Platform.OS === 'web' ? alert("Erreur: Impossible d'envoyer le signalement.") : Alert.alert("Erreur", "Impossible d'envoyer le signalement.");
      } else {
        setIsSent(true); 
        setDesc('');
        setNom('');
      }
    };

    // --- DÉCLENCHEMENT DE L'ALERTE SELON LA PLATEFORME ---
    if (Platform.OS === 'web') {
      // Sur Web, on utilise confirm() qui renvoie true ou false
      const hasConfirmed = window.confirm(confirmationMessage);
      if (hasConfirmed) {
        processUpload();
      }
    } else {
      // Sur Mobile, on utilise Alert.alert original
      Alert.alert(
        "Confirmation importante",
        confirmationMessage,
        [
          { text: "Modifier", style: "cancel" },
          { text: "Confirmer l'envoi", onPress: () => processUpload() }
        ]
      );
    }
  };

  // -------------------------------------------------------------------------
  // 3. VUE DE CONFIRMATION (Affichée après envoi réussi)
  // -------------------------------------------------------------------------
  if (isSent) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successIcon}>
          <ShieldCheck size={80} color="#2a9d8f" />
        </View>
        <Text style={styles.successTitle}>Signalement transmis</Text>
        <Text style={styles.successText}>
          Ta parole a été recueillie avec succès. Les membres de la cellule vont analyser ton message et agir pour t&apos;aider.
        </Text>
        <TouchableOpacity style={styles.btnSecondary} onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.btnSecondaryText}>Retour à l&apos;écran d&apos;acceuil</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Composant réutilisable pour les menus déroulants
  const CustomSelect = ({ label, value, options, visible, onToggle, onSelect, placeholder }: any) => (
    <View style={styles.section}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.customSelect} onPress={onToggle} activeOpacity={0.7}>
        <Text style={[styles.selectText, !value && { color: '#94a3b8' }]}>
          {value ? value : placeholder}
        </Text>
        {visible ? <ChevronUp size={20} color="#023e8a" /> : <ChevronDown size={20} color="#023e8a" />}
      </TouchableOpacity>
      {visible && (
        <View style={styles.optionsContainer}>
          {options.map((item: string) => (
            <TouchableOpacity 
              key={item} 
              style={styles.optionItem} 
              onPress={() => { onSelect(item); onToggle(); }}
            >
              <Text style={styles.optionText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
  // -------------------------------------------------------------------------
  // 4. FORMULAIRE DE SIGNALEMENT (Rendu principal)
  // -------------------------------------------------------------------------
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      {/* HEADER : Retour et Titre */}
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          onPress={() => router.replace('/(tabs)')} 
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ChevronLeft color="#023e8a" size={32} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.title}>Fiche de Signalement</Text>
      </View>

      {/* OPTION ANONYMAT : Switch de confidentialité */}
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

      {/* IDENTITÉ : Affiché uniquement si non anonyme */}
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

      {/* --- LES MENUS DÉROULANTS DEUX PAR DEUX --- */}

      <View style={styles.row}>
        <View style={styles.column}>
          <CustomSelect 
            label="Type de harcèlement :"
            value={typeHarcelement}
            options={["Cyber-harcèlement", "Physique", "Moral", "Exclusion", "Autre"]}
            visible={showTypes}
            onToggle={() => toggleMenu('types')}
            onSelect={setTypeHarcelement}
            placeholder="Sélectionner..."
          />
        </View>
        <View style={styles.column}>
          <CustomSelect 
            label="Niveau d'urgence :"
            value={urgence}
            options={["Faible", "Moyen", "Élevé"]}
            visible={showUrgence}
            onToggle={() => toggleMenu('urgence')}
            onSelect={setUrgence}
            placeholder="Évaluer..."
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.column}>
          <CustomSelect 
            label="Date :"
            value={dateApproximative}
            options={["Aujourd'hui", "Une semaine", "Un mois", "Plus d'un mois"]}
            visible={showDate}
            onToggle={() => toggleMenu('date')}
            onSelect={setDateApproximative}
            placeholder="Quand ?"
          />
        </View>
        <View style={styles.column}>
          <CustomSelect 
            label="Lieu des faits:"
            value={lieu}
            options={["Classe", "Récré", "Web", "Trajet", "Autre"]}
            visible={showLieu}
            onToggle={() => toggleMenu('lieu')}
            onSelect={setLieu}
            placeholder="Où ?"
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.column}>
          <CustomSelect 
            label="Fréquence :"
            value={frequence}
            options={["Une seule fois", "De temps en temps", "Tous les jours"]}
            visible={showFrequence}
            onToggle={() => toggleMenu('frequence')}
            onSelect={setFrequence}
            placeholder="Souvent ?"
          />
        </View>
        <View style={styles.column}>
          <CustomSelect 
            label="Nombre de victimes :"
            value={nbVictimes}
            options={["Moi", "2-3", "Groupe"]}
            visible={showNbVictimes}
            onToggle={() => toggleMenu('nbVictimes')}
            onSelect={setNbVictimes}
            placeholder="Combien ?"
          />
        </View>
      </View>

      {/* Description des faits */}
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

      {/* MENTION LÉGALE : Avertissement pénal */}
      <View style={styles.warningBox}>
        <Text style={styles.warningText}>
          Afin de garantir la protection de tous, rappelle-toi que le signalement de faits volontairement inexacts est sanctionné par la loi (Art. 226-10 du Code pénal).
        </Text>
      </View>

      {/* ACTION : Bouton d'envoi avec dégradé */}
      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={handleSend}
        disabled={loading}
      >
        <LinearGradient 
          colors={["#48a4f4", "#10ac56"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.btn, { opacity: loading ? 0.6 : 1 }]}
        >
          <Text style={styles.btnText}>{loading ? "Transmission..." : "Envoyer le signalement"}</Text>
        </LinearGradient>
      </TouchableOpacity>
      
      {/* RAPPEL CONFIDENTIALITÉ */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          {isAnonyme 
            ? "🛡️ Ce signalement est strictement anonyme. Aucune donnée personnelle n'est enregistrée." 
            : "👤 Ce signalement est nominatif. Seuls les intervenants autorisés pourront consulter ton nom."}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: 'transparent' },
  title: { 
    fontSize: 28, 
    fontWeight: '800', 
    color: '#023e8a',
    flex: 1, // Permet au texte de prendre la place restante
  },
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
  
  customSelect: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectText: { fontSize: 15, color: '#1e293b' },
  
  optionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    // Petit effet d'ombre pour que le menu "flotte"
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  optionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  optionText: { fontSize: 15, color: '#475569' },

  inputSmall: { 
    borderWidth: 1, 
    borderColor: '#e2e8f0', 
    borderRadius: 15, 
    padding: 15, 
    fontSize: 16, 
    backgroundColor: '#fff',
    color: '#1e293b'
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
    color: '#1e293b'
  },
  
  btn: { 
    padding: 20, 
    borderRadius: 15, 
    alignItems: 'center',
    shadowColor: '#10ac56',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4
  },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  
  infoBox: { 
    marginTop: 30, 
    padding: 15, 
    backgroundColor: '#f1f5f9', 
    borderRadius: 15,
    borderLeftWidth: 4, 
    borderLeftColor: '#00b4d8' 
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
    backgroundColor: '#f8fafc', // Bleu-gris très léger et pro
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#cbd5e1', // Bordure douce
    borderLeftWidth: 5,
    borderLeftColor: '#cf7820ff', // Barre latérale pour souligner l'importance
  },
  warningText: {
    color: '#475569', // Gris ardoise (sérieux mais pas agressif)
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'left', // Alignement à gauche pour faire plus "officiel"
  },
  warningBold: {
    fontWeight: '700',
    color: '#1e293b', // Un peu plus foncé pour l'emphase
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    marginLeft: -10, // Pour compenser le padding de l'icône et coller au bord
  },
  backButton: {
    padding: 10, // Zone de clic plus large
    marginRight: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0, // On gère l'espacement dans la ligne
  },
  column: {
    flex: 1, // Chaque menu prend 50% de la largeur
    marginHorizontal: 5, // Petit espace entre les deux menus
  },
});