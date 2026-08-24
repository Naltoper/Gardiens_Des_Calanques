import { useRouter } from "expo-router";
import {
  ChevronRight,
  Info,
  LogOut,
  Phone,
  Shield,
  ShieldAlert,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AnonymityBadge } from "../../components/banners/AnonymityBadge";
import { InstallBanner } from "../../components/banners/InstallBanner";
import { LyceeBackground } from "../../components/backgrounds/LyceeBackground";
import { PageHeader } from "../../components/headers/PageHeader";
import { Colors, GARDIAN_CLAIR } from "../../constants/theme";
import { useAuth } from "../../contexts/AuthContext";

const C = {
  primary: Colors.light.primary,
  surface: GARDIAN_CLAIR,
  border: "#E2E8F0",
  text: "#0F172A",
  textMuted: "#64748B",
  textOnPrimary: "#FFFFFF",
};

type ShortcutItem = {
  title: string;
  subtitle: string;
  route: "/(tabs)/signaler" | "/(tabs)/cellule" | "/(tabs)/numeros";
  icon: React.ReactNode;
  primary?: boolean;
};

function ShortcutTile({
  item,
  onPress,
}: {
  item: ShortcutItem;
  onPress: () => void;
}) {
  if (item.primary) {
    return (
      <TouchableOpacity
        style={styles.primaryTile}
        onPress={onPress}
        activeOpacity={0.88}
      >
        <View style={styles.primaryIconWrap}>{item.icon}</View>
        <View style={styles.primaryTextWrap}>
          <Text style={styles.primaryTitle}>{item.title}</Text>
          <Text style={styles.primarySubtitle}>{item.subtitle}</Text>
        </View>
        <ChevronRight size={22} color="rgba(255,255,255,0.7)" strokeWidth={2.5} />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.secondaryTile}
      onPress={onPress}
      activeOpacity={0.82}
    >
      <View style={styles.secondaryIconWrap}>{item.icon}</View>
      <Text style={styles.secondaryTitle} numberOfLines={2}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setRefreshing(false);
  };

  const shortcuts: ShortcutItem[] = [
    {
      title: "Fiche de Signalement",
      subtitle: "Signaler une situation en toute confidentialité",
      route: "/(tabs)/signaler",
      icon: <ShieldAlert color={C.textOnPrimary} size={28} strokeWidth={2.5} />,
      primary: true,
    },
    {
      title: "La Cellule",
      subtitle: "",
      route: "/(tabs)/cellule",
      icon: <Info color={C.primary} size={22} strokeWidth={2.5} />,
    },
    {
      title: "Numéros Utiles",
      subtitle: "",
      route: "/(tabs)/numeros",
      icon: <Phone color={C.primary} size={22} strokeWidth={2.5} />,
    },
  ];

  const [primaryShortcut, ...secondaryShortcuts] = shortcuts;

  return (
    <View style={styles.screenRoot}>
    <LyceeBackground>
      <PageHeader
        title="Accueil"
        subtitle="Les Gardiens des Calanques"
      />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#48a4f4"
          />
        }
      >
        <InstallBanner
          title="Application élève"
          subtitle="Installez l'app pour recevoir les notifications en direct."
          url="https://github.com/Naltoper/GardiensApp_v0/releases/download/v1.0.0/GDC.apk"
        />

        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/images/logo.jpg")}
              style={styles.logo}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.headerTitle}>Les Gardiens des Calanques</Text>
        </View>

        <View style={styles.engagementCard}>
          <View style={styles.engagementIconWrap}>
            <Shield color={C.primary} size={22} strokeWidth={2.5} />
          </View>
          <View style={styles.engagementTextWrap}>
            <Text style={styles.engagementTitle}>Votre anonymat est notre priorité</Text>
            <Text style={styles.engagementDesc}>
              Un espace sécurisé et bienveillant pour briser le silence et lutter
              contre le harcèlement scolaire.
            </Text>
          </View>
        </View>

        <View style={styles.actionsCard}>
          <Text style={styles.actionsHeading}>Raccourcis</Text>

          <ShortcutTile
            item={primaryShortcut}
            onPress={() => router.push(primaryShortcut.route)}
          />

          <View style={styles.secondaryGrid}>
            <View style={styles.secondaryRow}>
              {secondaryShortcuts.map((item) => (
                <ShortcutTile
                  key={item.route}
                  item={item}
                  onPress={() => router.push(item.route)}
                />
              ))}
            </View>
          </View>
        </View>

        <View style={styles.footerBadges}>
          <AnonymityBadge />
        </View>
        <Text style={styles.footerSubtitle}>Lycée des Calanques • Marseille</Text>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={async () => {
            if (loggingOut) return;
            setLoggingOut(true);
            try {
              await logout();
            } finally {
              setLoggingOut(false);
            }
          }}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Se déconnecter"
        >
          <LogOut color="#FFFFFF" size={20} strokeWidth={2.5} />
          <Text style={styles.logoutButtonText}>
            {loggingOut ? "Déconnexion…" : "Se déconnecter"}
          </Text>
        </TouchableOpacity>
        {user ? (
          <Text style={styles.loggedInAs}>Connecté en tant que {user.displayName}</Text>
        ) : null}
      </ScrollView>
    </LyceeBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: GARDIAN_CLAIR,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 16,
    paddingBottom: 48,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 8,
  },
  logoContainer: {
    width: 170,
    height: 200,
    borderRadius: 60,
    backgroundColor: C.surface,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#48a4f4",
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
    justifyContent: "center",
    alignItems: "center",
    padding: 3,
  },
  logo: {
    width: "100%",
    height: "100%",
    borderRadius: 55,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "800",
    color: C.primary,
    textAlign: "center",
    letterSpacing: 0.3,
    lineHeight: 40,
  },
  engagementCard: {
    flexDirection: "row",
    backgroundColor: GARDIAN_CLAIR,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: C.border,
    gap: 14,
    alignItems: "flex-start",
    width: "100%",
  },
  engagementIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  engagementTextWrap: {
    flex: 1,
  },
  engagementTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: C.text,
    marginBottom: 4,
  },
  engagementDesc: {
    fontSize: 13,
    color: C.textMuted,
    lineHeight: 19,
  },
  actionsCard: {
    backgroundColor: GARDIAN_CLAIR,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  actionsHeading: {
    fontSize: 13,
    fontWeight: "600",
    color: C.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 14,
  },
  primaryTile: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.primary,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    gap: 14,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  primaryIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  primaryTextWrap: {
    flex: 1,
  },
  primaryTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: C.textOnPrimary,
    marginBottom: 3,
  },
  primarySubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    lineHeight: 18,
  },
  secondaryGrid: {
    gap: 10,
  },
  secondaryRow: {
    flexDirection: "row",
    gap: 10,
  },
  secondaryTile: {
    flex: 1,
    backgroundColor: C.surface,
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    minHeight: 108,
    justifyContent: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  secondaryIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  secondaryTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: C.text,
    textAlign: "center",
    lineHeight: 18,
  },
  footerBadges: {
    marginTop: 28,
    alignItems: "center",
    width: "100%",
  },
  footerSubtitle: {
    marginTop: 12,
    fontSize: 11,
    color: "#1a1a1a",
    textTransform: "uppercase",
    letterSpacing: 2,
    fontWeight: "600",
    textAlign: "center",
  },
  logoutButton: {
    marginTop: 28,
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#B91C1C",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#991B1B",
    shadowColor: "#7F1D1D",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  loggedInAs: {
    marginTop: 10,
    fontSize: 12,
    color: C.textMuted,
    textAlign: "center",
    fontWeight: "600",
  },
});
