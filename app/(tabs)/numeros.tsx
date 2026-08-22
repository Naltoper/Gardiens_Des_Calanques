import { useRouter } from 'expo-router';
import { ImageBackground, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Info, ShieldCheck } from 'lucide-react-native';
import EngagementItem from '../../components/cards/EngagementItem';
import { EmergencyCard } from '../../components/EmergencyCard';
import { PageHeader } from '../../components/headers/PageHeader';
import { NUMEROS_UTILES } from '../../constants/emergencyNumbers';
import { Colors, GARDIAN_CLAIR } from '../../constants/theme';

export default function NumerosScreen() {
  const router = useRouter();
  const call = (num: string) => Linking.openURL(`tel:${num}`);

  return (
    <View style={styles.mainContainer}>
      <PageHeader
        title="Numéros Utiles"
        subtitle="Contacts d'urgence et d'écoute"
        onBack={() => router.back()}
      />

      <ImageBackground
        source={require('../../assets/images/lyceeBgBlur.png')}
        style={styles.screenBackground}
        imageStyle={styles.screenBackgroundImage}
        resizeMode="cover"
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <EngagementItem
            icon={<Info color="#023e8a" size={26} strokeWidth={2.5} />}
            title={"Besoin d'aide immédiatement ?"}
            desc="Ces services sont gratuits, anonymes et disponibles partout en France."
            colors={['#023e8a', '#0077b6']}
          />

          <View style={styles.spacer} />

          {NUMEROS_UTILES.map((item) => (
            <EmergencyCard key={item.id} item={item} onPress={call} />
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
    backgroundColor: Colors.light.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  spacer: {
    marginBottom: 25,
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    opacity: 0.7,
  },
  footerText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.light.icon,
    fontWeight: '600',
  },
  screenBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: GARDIAN_CLAIR,
  },
  screenBackgroundImage: {
    opacity: 0.7,
  },
});
