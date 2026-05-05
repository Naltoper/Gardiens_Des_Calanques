import { View, Text, StyleSheet, Linking, ScrollView } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';
import { useRouter } from 'expo-router';
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

      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          Besoin d&apos;aide immédiatement ? Ces services sont gratuits, anonymes et disponibles partout en France.
        </Text>

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
  }
});