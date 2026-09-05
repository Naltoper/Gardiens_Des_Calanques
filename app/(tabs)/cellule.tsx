import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { LyceeBackground } from '../../components/backgrounds/LyceeBackground';
import { CellulePanel } from '../../components/cellule/CellulePanel';
import { PageHeader } from '../../components/headers/PageHeader';
import { GARDIAN_CLAIR } from '../../constants/theme';

export default function CelluleScreen() {
  const router = useRouter();

  return (
    <View style={styles.screenRoot}>
    <LyceeBackground>
      <PageHeader
        title="La Cellule"
        subtitle="L'équipe d'écoute des Gardiens des Calanques"
        onBack={() => router.back()}
      />

      <CellulePanel />
    </LyceeBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: GARDIAN_CLAIR,
  },
});
