import { useRouter } from 'expo-router';
import { ChevronLeft, FolderOpen } from 'lucide-react-native';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground
} from 'react-native';
import { ReportCard } from '../../components/cards/ReportCard';
import { ReportDetailModal } from '../../components/modals/ReportDetailModal';
import { useReports } from '../../hooks/useReports';
import { supabase } from '../../lib/supabase';
import { Report } from '../../types/report';
import { formatDateTime } from '../../utils/dateFormatter';

export default function MesSignalementsScreen() {

  // -------------------------------------------------------------------------
  // 1. ÉTATS & CONFIGURATION (Hooks)
  // -------------------------------------------------------------------------
  const router = useRouter();

  const { reports, loading, refreshing, onRefresh } = useReports();

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const deleteReport = async (reportId: string) => {
    console.log('Suppression demandée pour le signalement :', reportId);
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', reportId);

    if (error) {
      console.error('Erreur suppression signalement :', error.message);
      if (Platform.OS === 'web') {
        alert('Impossible de supprimer ce signalement pour le moment.');
      } else {
        Alert.alert(
          'Erreur',
          'Impossible de supprimer ce signalement pour le moment.'
        );
      }
      return;
    }

    console.log('Signalement supprimé avec succès');
    await onRefresh();
  };

  const confirmDeleteReport = (reportId: string) => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        'Voulez-vous vraiment supprimer ce signalement ? Les messages liés seront aussi supprimés.'
      );

      if (confirmed) {
        deleteReport(reportId);
      }

      return;
    }
    Alert.alert(
      'Supprimer le signalement',
      'Voulez-vous vraiment supprimer ce signalement ? Les messages liés seront aussi supprimés.',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => deleteReport(reportId),
        },
      ]
    );
  };
  

  // -------------------------------------------------------------------------
  // 2. RENDU DES COMPOSANTS (Items de la liste)
  // -------------------------------------------------------------------------
  const renderItem = ({ item }: { item: Report }) => (
  <ReportCard 
    item={item}
    formatDateTime={formatDateTime}
    onDetails={() => { setSelectedReport(item); setModalVisible(true); }}
    onDelete={() => confirmDeleteReport(item.id)}
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
        <View style={styles.placeholder} />
      </View>
      
      {/* IMAGE BACKGROUND INTÉGRÉE POUR TOUT L'ÉCRAN */}
      <ImageBackground
        source={require('../../assets/images/lyceeBg.jpg')}
        style={styles.screenBackground}
        imageStyle={styles.screenBackgroundImage}
        resizeMode="cover"
      >
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={[styles.listContent, reports.length === 0 && { flex: 1, justifyContent: 'center' }]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#48a4f4" />
          }
          // COMPOSANT VIDE PREMIUM ET CONFORTABLE VISUELLEMENT
          ListEmptyComponent={
            <View style={styles.emptyWrapper}>
              <View style={styles.emptyIconContainer}>
                <FolderOpen color="#94a3b8" size={38} strokeWidth={1.5} />
              </View>
              <Text style={styles.emptyText}>Aucun signalement envoyé</Text>
              <Text style={styles.emptySubText}>
                Tu n&apos;as pas encore transmis de fiche. Tes futurs signalements et tes espaces de discussion sécurisés s&apos;afficheront ici.
              </Text>
            </View>
          }
        />
      </ImageBackground>

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
    color: '#1e293b', 
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 8
  },
  emptySubText: {
    textAlign: 'center', 
    color: '#64748b', 
    fontSize: 14,
    lineHeight: 22,
    paddingHorizontal: 10
  },
  screenBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#f8fafc',
  },
  screenBackgroundImage: {
    opacity: 0.3,
  },
  emptyWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  emptyIconContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },  
});