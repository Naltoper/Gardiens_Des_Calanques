import { useRouter } from 'expo-router';
import { LyceeBackground } from '../../components/backgrounds/LyceeBackground';
import { CellulePanel } from '../../components/cellule/CellulePanel';
import { PageHeader } from '../../components/headers/PageHeader';

export default function CelluleScreen() {
  const router = useRouter();

  return (
    <LyceeBackground>
      <PageHeader
        title="La Cellule"
        subtitle="L'équipe d'écoute des Gardiens des Calanques"
        onBack={() => router.back()}
      />

      <CellulePanel />
    </LyceeBackground>
  );
}
