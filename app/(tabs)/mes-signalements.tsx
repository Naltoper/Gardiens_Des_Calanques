import { View, Text, StyleSheet, FlatList, ActivityIndicator, 
  Platform, TouchableOpacity, RefreshControl} from 'react-native';
import { useState} from 'react';
import { ChevronLeft} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { ReportCard } from '../../components/cards/ReportCard';
import { ReportDetailModal } from '../../components/modals/ReportDetailModal';
import { useReports } from '../../hooks/useReports';
import { formatDateTime } from '../../utils/dateFormatter';

export default function MesSignalementsScreen() {

  // -------------------------------------------------------------------------
  // 1. ÉTATS & CONFIGURATION (Hooks)
  // -------------------------------------------------------------------------
  const router = useRouter();

  const { reports, loading, refreshing, onRefresh } = useReports();

  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // -------------------------------------------------------------------------
  // 2. RENDU DES COMPOSANTS (Items de la liste)
  // -------------------------------------------------------------------------
  const renderItem = ({ item }: { item: any }) => (
  <ReportCard 
    item={item}
    formatDateTime={formatDateTime}
    onDetails={() => { setSelectedReport(item); setModalVisible(true); }}
    onChat={() => router.push({
      pathname: `../chat/${item.id}`,
      params: { role: 'user' }
    })}
  />
  );

  // -------------------------------------------------------------------------
  // 3. AFFICHAGE DE L'ÉTAT DE CHARGEMENT
  // -------------------------------------------------------------------------
  if (loading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#48a4f4" />
      </View>
    );
  }

  // -------------------------------------------------------------------------
  // 4. RENDU PRINCIPAL (Layout)
  // -------------------------------------------------------------------------
  return (
    <View style={styles.container}>
      {/* HEADER CENTRÉ AVEC BOUTON RETOUR */}
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          onPress={() => router.replace('/(tabs)')} 
          style={styles.backButton}
        >
          <ChevronLeft color="#023e8a" size={28} strokeWidth={2.5} />
        </TouchableOpacity>
        
        <Text style={styles.title}>Mes signalements</Text>
        
        {/* View vide pour équilibrer le centrage du texte face au bouton retour */}
        <View style={styles.placeholder} />
      </View>
      
      {/* LISTE DES SIGNALEMENTS */}
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#48a4f4" />
        }
        // Affichage si aucun signalement trouvé
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Tu n&apos;as pas encore envoyé de signalement.</Text>
            <Text style={styles.emptySubText}>Tes futurs messages s&apos;afficheront ici en toute sécurité.</Text>
          </View>
        }
      />
      <ReportDetailModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        report={selectedReport} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8fafc' // Un fond très léger pour faire ressortir les cartes blanches
  },
  loaderContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 20, // Ajustement pour l'encoche iOS
    paddingBottom: 20,
    backgroundColor: 'transparent',
  },
  backButton: {
    padding: 8,
    width: 44, // Taille fixe pour aider au centrage
  },
  title: { 
    fontSize: 22, 
    fontWeight: '800', 
    color: '#023e8a',
    textAlign: 'center',
    flex: 1, // Prend tout l'espace central
  },
  placeholder: {
    width: 44, // Même largeur que le bouton retour pour un centrage mathématique parfait
  },
  listContent: { 
    paddingHorizontal: 24, 
    paddingBottom: 40 
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
    paddingHorizontal: 40
  },
  emptyText: { 
    textAlign: 'center', 
    color: '#64748b', 
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10
  },
  emptySubText: {
    textAlign: 'center', 
    color: '#94a3b8', 
    fontSize: 14,
    lineHeight: 20
  },
});