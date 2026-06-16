import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { ChevronLeft, FolderOpen } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import { ReportCard } from "../../components/cards/ReportCard";
import { ReportDetailModal } from "../../components/modals/ReportDetailModal";
import { useReports } from "../../hooks/useReports";
import { supabase } from "../../lib/supabase";
import { Report } from "../../types/report";
import { formatDateTime } from "../../utils/dateFormatter";

const HEADER_MAX_HEIGHT = Platform.OS === "ios" ? 140 : 120;
const HEADER_MIN_HEIGHT = Platform.OS === "ios" ? 100 : 80;
const SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function MesSignalementsScreen() {
  // =========================================================================
  // 1. TOUS LES HOOKS DOIVENT ÊTRE EN HAUT (AUCUN RETOUR AVANT)
  // =========================================================================
  const router = useRouter();
  const { reports, loading, refreshing, onRefresh } = useReports();
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const animatedHeaderStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, SCROLL_DISTANCE],
      [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      Extrapolation.CLAMP,
    );
    return { height };
  });

  const animatedTitleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, SCROLL_DISTANCE / 2],
      [1, 0],
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(
      scrollY.value,
      [0, SCROLL_DISTANCE / 2],
      [0, -10],
      Extrapolation.CLAMP,
    );
    return { opacity, transform: [{ translateY }] };
  });

  const animatedSmallTitleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [SCROLL_DISTANCE / 2, SCROLL_DISTANCE],
      [0, 1],
      Extrapolation.CLAMP,
    );
    return { opacity };
  });

  // =========================================================================
  // 2. LES FONCTIONS CLASSIQUES
  // =========================================================================
  const deleteReport = async (reportId: string) => {
    const { error } = await supabase
      .from("reports")
      .delete()
      .eq("id", reportId);

    if (error) {
      if (Platform.OS === "web") {
        alert("Impossible de supprimer ce signalement pour le moment.");
      } else {
        Alert.alert(
          "Erreur",
          "Impossible de supprimer ce signalement pour le moment.",
        );
      }
      return;
    }
    await onRefresh();
  };

  const confirmDeleteReport = (reportId: string) => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "Voulez-vous vraiment supprimer ce signalement ? Les messages liés seront aussi supprimés.",
      );
      if (confirmed) deleteReport(reportId);
      return;
    }
    Alert.alert(
      "Supprimer le signalement",
      "Voulez-vous vraiment supprimer ce signalement ? Les messages liés seront aussi supprimés.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => deleteReport(reportId),
        },
      ],
    );
  };

  const renderItem = ({ item }: { item: Report }) => (
    <ReportCard
      item={item}
      formatDateTime={formatDateTime}
      onDetails={() => {
        setSelectedReport(item);
        setModalVisible(true);
      }}
      onDelete={() => confirmDeleteReport(item.id)}
      onChat={() =>
        router.push({
          pathname: `../chat/${item.id}`,
          params: { role: "user" },
        })
      }
    />
  );

  // =========================================================================
  // 3. LE RETOUR ANTICIPÉ (DOIT SE TROUVER APRÈS TOUS LES HOOKS)
  // =========================================================================
  if (loading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#48a4f4" />
      </View>
    );
  }

  // =========================================================================
  // 4. LE RENDU PRINCIPAL
  // =========================================================================
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/lyceeBg.jpg")}
        style={styles.screenBackground}
        imageStyle={styles.screenBackgroundImage}
        resizeMode="cover"
      >
        <Animated.View style={[styles.headerContainer, animatedHeaderStyle]}>
          {Platform.OS !== "android" ? (
            <BlurView
              intensity={80}
              tint="light"
              style={StyleSheet.absoluteFill}
            />
          ) : (
            <View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: "rgba(255, 255, 255, 0.9)" },
              ]}
            />
          )}

          <View style={styles.headerContent}>
            <TouchableOpacity
              onPress={() => router.replace({ pathname: "/(tabs)" })}
              style={styles.backButton}
            >
              <ChevronLeft color="#023e8a" size={28} strokeWidth={2.5} />
            </TouchableOpacity>

            <Animated.View style={[styles.titleWrapper, animatedTitleStyle]}>
              <Text style={styles.title}>Mes signalements</Text>
            </Animated.View>

            <Animated.View
              style={[styles.smallTitleWrapper, animatedSmallTitleStyle]}
            >
              <Text style={styles.smallTitle}>Mes signalements</Text>
            </Animated.View>
          </View>
        </Animated.View>

        <Animated.FlatList
          data={reports}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          contentContainerStyle={[
            styles.listContent,
            reports.length === 0 && { flex: 1, justifyContent: "center" },
            { paddingTop: HEADER_MAX_HEIGHT + 20 },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#48a4f4"
              progressViewOffset={HEADER_MAX_HEIGHT}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyWrapper}>
              <View style={styles.emptyIconContainer}>
                <FolderOpen color="#94a3b8" size={38} strokeWidth={1.5} />
              </View>
              <Text style={styles.emptyText}>Aucun signalement envoyé</Text>
              <Text style={styles.emptySubText}>
                Tu n&apos;as pas encore transmis de fiche. Tes futurs signalements et
                tes espaces de discussion sécurisés s&apos;afficheront ici.
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
    backgroundColor: "#f8fafc",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  screenBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#f8fafc",
  },
  screenBackgroundImage: {
    opacity: 0.5,
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: "hidden",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(226, 232, 240, 0.6)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  headerContent: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 15,
  },
  backButton: {
    position: "absolute",
    left: 15,
    bottom: 12,
    padding: 8,
    zIndex: 20,
  },
  titleWrapper: {
    alignItems: "center",
    position: "absolute",
    bottom: 15,
    width: "100%",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#023e8a",
  },
  smallTitleWrapper: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    alignItems: "center",
  },
  smallTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#023e8a",
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  emptyWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  emptyIconContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  emptyText: {
    textAlign: "center",
    color: "#1e293b",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 8,
  },
  emptySubText: {
    textAlign: "center",
    color: "#64748b",
    fontSize: 14,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
});
