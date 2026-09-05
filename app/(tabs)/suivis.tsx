import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Filter, FolderOpen } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { ReportCard } from '../../components/cards/ReportCard';
import { PageHeader } from '../../components/headers/PageHeader';
import { Colors, GARDIAN_CLAIR, HEADER_FG, PAGE_SCENE_BACKDROP } from '../../constants/theme';
import { DeleteConfirmModal } from '../../components/modals/DeleteConfirmModal';
import { ReportDetailModal } from '../../components/modals/ReportDetailModal';
import {
  matchesStatusFilter,
  SuivisFilterBar,
  type SuivisDateSort,
  type SuivisStatusFilter,
} from '../../components/suivis/SuivisFilterBar';
import { useChatActivityContext } from '../../contexts/ChatActivityContext';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';
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
  const [dateSort, setDateSort] = useState<SuivisDateSort>('recent');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const {
    activity,
    refresh: refreshChatActivity,
    loaded: chatActivityLoaded,
    reloadIds,
  } = useChatActivityContext();
  const filtersActive =
    statusFilter !== 'Tous' || onlyWithChat || dateSort !== 'recent';

  const filteredReports = useMemo(() => {
    const toTimestamp = (value: string | null | undefined) => {
      const time = value ? new Date(value).getTime() : Number.NaN;
      return Number.isFinite(time) ? time : 0;
    };

    const visible = reports.filter((report) => {
      if (!matchesStatusFilter(report.status, statusFilter)) return false;
      if (onlyWithChat && chatActivityLoaded && !activity[report.id]?.hasMessages) {
        return false;
      }
      return true;
    });

    // Copie propre + tri global par date (évite mutation et listes partiellement figées)
    return [...visible].sort((a, b) => {
      const timeA = toTimestamp(a.created_at);
      const timeB = toTimestamp(b.created_at);
      return dateSort === 'oldest' ? timeA - timeB : timeB - timeA;
    });
  }, [reports, statusFilter, onlyWithChat, dateSort, activity, chatActivityLoaded]);

  const unreadCount = useMemo(
    () => filteredReports.filter((report) => activity[report.id]?.unread).length,
    [filteredReports, activity],
  );

  useFocusEffect(
    useCallback(() => {
      fetchReports();
      void reloadIds();
      void refreshChatActivity();
    }, [fetchReports, reloadIds, refreshChatActivity]),
  );

  const handleRefresh = useCallback(async () => {
    await onRefresh();
    await reloadIds();
    await refreshChatActivity();
  }, [onRefresh, reloadIds, refreshChatActivity]);

  const pullRefresh = usePullToRefresh({
    refreshing,
    onRefresh: handleRefresh,
  });

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
      key={item.id}
      item={item}
      index={index}
      formatDateTime={formatDateTime}
      hasUnreadChat={activity[item.id]?.unread === true}
      onDetails={() => {
        setSelectedReport(item);
        setModalVisible(true);
      }}
      onDelete={() => confirmDeleteReport(item.id)}
      onChat={() => {
        const id = String(item.id ?? '').trim();
        if (!id) return;
        router.push({
          pathname: '/chat/[id]',
          params: { id, role: 'user' },
        });
      }}
    />
  );

  if (loading && !refreshing && reports.length === 0) {
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
        right={
          <TouchableOpacity
            onPress={() => setFiltersOpen((open) => !open)}
            style={[styles.filterButton, filtersOpen && styles.filterButtonActive]}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel={filtersOpen ? 'Masquer les filtres' : 'Afficher les filtres'}
            testID="suivis-filter-toggle"
            nativeID="suivis-filter-toggle"
          >
            <Filter
              color={filtersOpen || filtersActive ? Colors.light.primary : HEADER_FG}
              size={20}
              strokeWidth={2.3}
            />
            {filtersActive ? <View style={styles.filterDot} /> : null}
          </TouchableOpacity>
        }
      />

        {filtersOpen ? (
          <SuivisFilterBar
            status={statusFilter}
            onStatusChange={setStatusFilter}
            onlyWithChat={onlyWithChat}
            onOnlyWithChatChange={setOnlyWithChat}
            dateSort={dateSort}
            onDateSortChange={setDateSort}
          />
        ) : null}

        <FlatList
          data={filteredReports}
          keyExtractor={(item) => String(item.id)}
          extraData={{ dateSort, statusFilter, onlyWithChat, activity }}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.listContent,
            filteredReports.length === 0 && styles.listContentEmpty,
          ]}
          {...pullRefresh}
          ListHeaderComponent={
            unreadCount > 0 ? (
              <View style={styles.unreadSection}>
                <Text style={styles.unreadSectionTitle}>Messages non lus</Text>
                <Text style={styles.unreadSectionSubtitle}>
                  {unreadCount === 1
                    ? '1 discussion a un message non lu (badge rouge).'
                    : `${unreadCount} discussions ont un message non lu (badge rouge).`}
                </Text>
              </View>
            ) : null
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
                    ? 'Essaie un autre statut, une autre date, ou désactive le filtre « Chat actif ».'
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
    backgroundColor: PAGE_SCENE_BACKDROP,
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
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.42)',
  },
  filterButtonActive: {
    backgroundColor: 'rgba(2, 62, 138, 0.12)',
  },
  filterDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.light.primary,
  },
  unreadSection: {
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  unreadSectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.light.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  unreadSectionSubtitle: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
});
