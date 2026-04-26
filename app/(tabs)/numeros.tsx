import { View, Text, StyleSheet, Linking, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Phone, ShieldCheck, ChevronLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router'; // Import du router
import { EMERGENCY_NUMBERS } from '../../constants/emergencyNumbers';

export default function NumerosScreen() {
  const router = useRouter(); // Initialisation du router
  const call = (num: string) => Linking.openURL(`tel:${num}`);

  // const emergencyNumbers = [
  //   {
  //     title: "Non au Harcèlement",
  //     number: "3020",
  //     description: "Écoute, conseil et orientation pour les victimes et témoins.",
  //     colors: ["#48a4f4", "#00b4d8"],
  //   },
  //   {
  //     title: "Cyber-Harcèlement",
  //     number: "3018",
  //     description: "Le numéro court national pour les violences numériques.",
  //     colors: ["#76c893", "#10ac56"],
  //   },
  //   {
  //     title: "Enfance en Danger",
  //     number: "119",
  //     description: "Numéro national dédié à la prévention et à la protection.",
  //     colors: ["#023e8a", "#48cae4"],
  //   }
  // ];

  return (
    <View style={styles.mainContainer}>
      {/* HEADER AVEC FLÈCHE RETOUR ET TITRE CENTRÉ */}
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          onPress={() => router.replace('/(tabs)')} 
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ChevronLeft color="#023e8a" size={30} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Numéros Utiles</Text>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          Besoin d&apos;aide immédiatement ? Ces services sont gratuits, anonymes et disponibles partout en France.
        </Text>

        {EMERGENCY_NUMBERS.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            activeOpacity={0.9} 
            onPress={() => call(item.number)}
            style={styles.cardContainer}
          >
            <LinearGradient
              colors={item.colors as [string, string, ...string[]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.card}
            >
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDesc}>{item.description}</Text>
                <View style={styles.numberBadge}>
                  <Phone size={16} color="white" fill="white" />
                  <Text style={styles.cardNumber}>{item.number}</Text>
                </View>
              </View>
              <View style={styles.iconCircle}>
                <Phone size={28} color={item.colors[0]} />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}

        <View style={styles.footerInfo}>
          <ShieldCheck size={18} color="#64748b" />
          <Text style={styles.footerText}>Appels gratuits et confidentiels</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40, // Gestion de la barre d'état
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: Platform.OS === 'ios' ? 55 : 35,
    padding: 10,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 22, // Un peu plus petit pour le centrage harmonieux
    fontWeight: '800',
    color: '#023e8a',
    textAlign: 'center',
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
    color: '#64748b',
    lineHeight: 22,
    marginBottom: 25,
    textAlign: 'center'
  },
  cardContainer: {
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  card: { 
    padding: 20, 
    borderRadius: 24, 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden'
  },
  cardInfo: {
    flex: 1,
    marginRight: 10
  },
  cardTitle: { 
    fontSize: 18, 
    fontWeight: '800', 
    color: '#fff',
    marginBottom: 4
  },
  cardDesc: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
    lineHeight: 18
  },
  numberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  cardNumber: { 
    fontSize: 20, 
    fontWeight: '900', 
    color: '#fff',
    marginLeft: 8
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2
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
    color: '#64748b',
    fontWeight: '600'
  }
});