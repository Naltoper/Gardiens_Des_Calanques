import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { GradientButton } from '../../components/buttons/GradientButton';
import CustomSelect from '../../components/signalement/CustomSelect';
import SignalementSuccess from '../../components/signalement/SignalementSuccess';
import { useUserToken } from '../../hooks/useUserToken';
import { supabase } from '../../lib/supabase';


export default function SignalementScreen() {
  const router = useRouter();
  const userToken = useUserToken();
  const isWeb = Platform.OS === 'web';

  const [isAnonyme, setIsAnonyme] = useState(true);
  const [nom, setNom] = useState('');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const [typeHarcelement, setTypeHarcelement] = useState('');
  const [urgence, setUrgence] = useState('');
  const [dateApproximative, setDateApproximative] = useState('');
  const [lieu, setLieu] = useState('');
  const [frequence, setFrequence] = useState('');
  const [nbVictimes, setNbVictimes] = useState('');

  const [showTypes, setShowTypes] = useState(false);
  const [showUrgence, setShowUrgence] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [showLieu, setShowLieu] = useState(false);
  const [showFrequence, setShowFrequence] = useState(false);
  const [showNbVictimes, setShowNbVictimes] = useState(false);

  const toggleMenu = (menu: string) => {
    setShowTypes(menu === 'types' ? !showTypes : false);
    setShowUrgence(menu === 'urgence' ? !showUrgence : false);
    setShowDate(menu === 'date' ? !showDate : false);
    setShowLieu(menu === 'lieu' ? !showLieu : false);
    setShowFrequence(menu === 'frequence' ? !showFrequence : false);
    setShowNbVictimes(menu === 'nbVictimes' ? !showNbVictimes : false);
  };

  const resetForm = () => {
    setIsAnonyme(true);
    setNom('');
    setDesc('');
    setTypeHarcelement('');
    setUrgence('');
    setDateApproximative('');
    setLieu('');
    setFrequence('');
    setNbVictimes('');
    setShowTypes(false);
    setShowUrgence(false);
    setShowDate(false);
    setShowLieu(false);
    setShowFrequence(false);
    setShowNbVictimes(false);
  };

  const handleSend = async () => {
    if (!desc.trim() || !typeHarcelement) {
      if (isWeb) {
        alert("Veuillez remplir le type de harcèlement et la description.");
      } else {
        Alert.alert("Erreur", "Veuillez remplir le type de harcèlement et la description.");
      }
      return;
    }

    if (!userToken) {
      if (isWeb) {
        alert("Erreur : identifiant utilisateur non disponible.");
      } else {
        Alert.alert("Erreur", "Identifiant utilisateur non disponible.");
      }
      return;
    }

    const confirmationMessage =
      "Je confirme que les informations transmises sont sincères. Un signalement volontairement inexact peut donner lieu à des sanctions (Art. 226-10 du Code pénal).";

    const processUpload = async () => {
      setLoading(true);

      const { error } = await supabase.from('reports').insert([
        {
          content: desc,
          is_anonyme: isAnonyme,
          author_name: isAnonyme ? "Anonyme" : nom,
          user_token: userToken,
          status: "Non traité",
          type_harcelement: typeHarcelement,
          urgence: urgence,
          date_faits: dateApproximative,
          lieu: lieu,
          frequence: frequence,
          nb_victimes: nbVictimes,
        },
      ]);

      setLoading(false);

      if (error) {
        if (isWeb) {
          alert("Erreur : impossible d'envoyer le signalement.");
        } else {
          Alert.alert("Erreur", "Impossible d'envoyer le signalement.");
        }
      } else {
        resetForm();
        setIsSent(true);
      }
    };

    if (isWeb) {
      const hasConfirmed = window.confirm(confirmationMessage);
      if (hasConfirmed) {
        processUpload();
      }
    } else {
      Alert.alert(
        "Confirmation importante",
        confirmationMessage,
        [
          { text: "Modifier", style: "cancel" },
          { text: "Confirmer l'envoi", onPress: () => processUpload() },
        ]
      );
    }
  };

  if (isSent) {
  return (
    <SignalementSuccess
      onBackHome={() => router.replace('/(tabs)')}
    />
  );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={styles.backButton} activeOpacity={0.7}>
          <ChevronLeft color="#023e8a" size={32} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.title}>Fiche de Signalement</Text>
      </View>

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
            label="Lieu des faits :"
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

      <View style={styles.warningBox}>
        <Text style={styles.warningText}>
          Afin de garantir la protection de tous, rappelle-toi que le signalement de faits volontairement inexacts est sanctionné par la loi (Art. 226-10 du Code pénal).
        </Text>
      </View>

      <GradientButton
        title={loading ? "Transmission..." : "Envoyer le signalement"}
        onPress={handleSend}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: 'transparent' },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#023e8a',
    flex: 1,
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    marginLeft: -10,
  },
  backButton: {
    padding: 10,
    marginRight: 5,
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
});