import { View, Text, StyleSheet, Linking, ScrollView, ImageBackground } from 'react-native';
import { ShieldCheck, Info } from 'lucide-react-native'; // <-- Ajout de Info ici
import { useRouter } from 'expo-router';
import EngagementItem from '../../components/cards/EngagementItem'; // <-- Ajout de l'import d'EngagementItem
import { EMERGENCY_NUMBERS } from '../../constants/emergencyNumbers';
import { CustomHeader } from '../../components/CustomHeader';
import { EmergencyCard } from '../../components/EmergencyCard';
import { Colors } from '../../constants/theme';

export default function NumerosScreen() {
  const router = useRouter();
  const call = (num: string) => Linking.openURL(`tel:${num}`);

  return (
    <View style={styles.mainContainer}>
      <CustomHeader 
        title="Numéros Utiles" 
        onBack={() => router.replace('/(tabs)')} 
      />

      <ImageBackground
        source={require('../../assets/images/lyceeBgBlur.png')} // Réutilisation de ton image de fond commune
        style={styles.screenBackground}
        imageStyle={styles.screenBackgroundImage}
        resizeMode="cover"
      >

      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* ENCAPSULATION DU TEXTE DANS L'ENGAGEMENT ITEM FORMAT CLAIR */}
        <EngagementItem 
          icon={<Info color="#023e8a" size={26} strokeWidth={2.5} />}
          title={"Besoin d'aide immédiatement ?"}
          desc={"Ces services sont gratuits, anonymes et disponibles partout en France."}
          colors={["#023e8a", "#0077b6"]} // Fond clair pour détacher le texte de l'image floutée
        />

        {/* Espace de séparation entre la carte d'info et les numéros */}
        <View style={{ marginBottom: 25 }} />

        {EMERGENCY_NUMBERS.map((item) => (
          <EmergencyCard 
            key={item.id} 
            item={item} 
            onPress={call} 
          />
        ))}

        <View style={styles.footerInfo}>
          <ShieldCheck size={18} color={Colors.light.icon} />
          <Text style={styles.footerText}>Appels gratuits et confidentiels</Text>
        </View>
      </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.light.background, // Utilise '#fff' du thème
  },
  container: { 
    flex: 1, 
  },
  content: { 
    padding: 24,
    paddingTop: 10,
    paddingBottom: 40
  },
  subtitle: {
    fontSize: 15,
    color: Colors.light.icon, // On utilise le gris '#687076' défini dans le thème pour le texte secondaire
    lineHeight: 22,
    marginBottom: 25,
    textAlign: 'center'
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    opacity: 0.7
  },
  footerText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.light.icon, // Cohérence avec le subtitle
    fontWeight: '600'
  },
  screenBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  screenBackgroundImage: {
    opacity: 0.7, // Opacité légère à 5% pour garantir le contraste de tes cartes de numéros
  },
});