import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { FolderOpen } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ImageBackground,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ReportCard } from '../../components/cards/ReportCard';
import { PageHeader } from '../../components/headers/PageHeader';
import { GARDIAN_CLAIR, PAGE_SCENE_BACKDROP } from '../../constants/theme';
import { DeleteConfirmModal } from '../../components/modals/DeleteConfirmModal';
import { ReportDetailModal } from '../../components/modals/ReportDetailModal';
import {
  matchesStatusFilter,
  SuivisFilterBar,
  type SuivisStatusFilter,
} from '../../components/suivis/SuivisFilterBar';
import { useChatActivity } from '../../hooks/useChatActivity';
import { useReports } from '../../hooks/useReports';
import { supabase } from '../../lib/supabase';
import { Report } from '../../types/report';
import { formatDateTime } from '../../utils/dateFormatter';

export default function SuivisScreen() {
  const router = useRouter();
  const { reports, loading, refreshing, onRefresh, fetchReports } = useReports();
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<SuivisStatusFilter>('Tous');
  const [onlyWithChat, setOnlyWithChat] = useState(false);

  const reportIds = useMemo(() => reports.map((report) => report.id), [reports]);
  const { activity, refresh: refreshChatActivity, loaded: chatActivityLoaded } = useChatActivity(reportIds);

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      if (!matchesStatusFilter(report.status, statusFilter)) return false;
      if (onlyWithChat && chatActivityLoaded && !activity[report.id]?.hasMessages) {
        return false;
      }
      return true;
    });
  }, [reports, statusFilter, onlyWithChat, activity, chatActivityLoaded]);

  useFocusEffect(
    useCallback(() => {
      fetchReports();
      void refreshChatActivity();
    }, [fetchReports, refreshChatActivity]),
  );

  const deleteReport = async (reportId: string) => {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', reportId);

    if (error) {
      if (Platform.OS === 'web') {
        alert('Impossible de supprimer ce signalement pour le moment.');
      } else {
        Alert.alert(
          'Erreur',
          'Impossible de supprimer ce signalement pour le moment.',
        );
      }
      return;
    }
    await onRefresh();
  };

  const confirmDeleteReport = (reportId: string) => {
    setReportToDelete(reportId);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!reportToDelete) return;
    const id = reportToDelete;
    setDeleteModalVisible(false);
    setReportToDelete(null);
    await deleteReport(id);
  };

  const renderItem = ({ item, index }: { item: Report; index: number }) => (
    <ReportCard
      item={item}
      index={index}
      formatDateTime={formatDateTime}
      hasUnreadChat={activity[item.id]?.unread === true}
      onDetails={() => {
        setSelectedReport(item);
        setModalVisible(true);
      }}
      onDelete={() => confirmDeleteReport(item.id)}
      onChat={() =>
        router.push({
          pathname: `../chat/${item.id}`,
          params: { role: 'user' },
        })
      }
    />
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#48a4f4" />
      </View>
    );
  }

  const emptyBecauseFilter =
    reports.length > 0 && filteredReports.length === 0;

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/lyceeBgBlur.png')}
        style={styles.screenBackground}
        imageStyle={styles.screenBackgroundImage}
        resizeMode="cover"
      >
      <PageHeader
        title="Mes Suivis"
        subtitle="Signalements et discussions"
      />

        <SuivisFilterBar
          status={statusFilter}
          onStatusChange={setStatusFilter}
          onlyWithChat={onlyWithChat}
          onOnlyWithChatChange={setOnlyWithChat}
        />

        <FlatList
          data={filteredReports}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.listContent,
            filteredReports.length === 0 && styles.listContentEmpty,
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={async () => {
                await onRefresh();
                await refreshChatActivity();
              }}
              tintColor="#48a4f4"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyWrapper}>
              <View style={styles.emptyCard}>
                <View style={styles.emptyIconContainer}>
                  <FolderOpen color="#64748b" size={38} strokeWidth={1.5} />
                </View>
                <Text style={styles.emptyText}>
                  {emptyBecauseFilter
                    ? 'Aucun signalement pour ce filtre'
                    : 'Aucun signalement envoyé'}
                </Text>
                <Text style={styles.emptySubText}>
                  {emptyBecauseFilter
                    ? 'Essaie un autre statut ou désactive le filtre « Chat actif ».'
                    : "Tu n'as pas encore transmis de fiche. Tes futurs signalements et tes espaces de discussion sécurisés s'afficheront ici."}
                </Text>
              </View>
            </View>
          }
        />
      </ImageBackground>

      <ReportDetailModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        report={selectedReport}
      />

      <DeleteConfirmModal
        visible={deleteModalVisible}
        onClose={() => {
          setDeleteModalVisible(false);
          setReportToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        message="Voulez-vous vraiment supprimer ce signalement ?"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PAGE_SCENE_BACKDROP,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: PAGE_SCENE_BACKDROP,
  },
  screenBackgroundImage: {
    opacity: 1,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
  },
  listContentEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  emptyCard: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    backgroundColor: GARDIAN_CLAIR,
    borderRadius: 20,
    paddingHorizontal: 28,
    paddingVertical: 32,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  emptyIconContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyText: {
    textAlign: 'center',
    color: '#1e293b',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 8,
  },
  emptySubText: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 14,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
});
