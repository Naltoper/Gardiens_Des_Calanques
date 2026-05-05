import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Lock, ShieldCheck } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface ChatHeaderProps {
  reportId: string | undefined;
  role: string | string[] | undefined;
}

export const ChatHeader = ({ reportId, role }: ChatHeaderProps) => {
  const router = useRouter();
  const isUserAuthor = role === 'user';

  const handleBack = () => {router.replace('/(tabs)/mes-signalements')};

  return (
    <LinearGradient
      colors={["#023e8aff", "#0077b6ff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.headerGradient}
    >
      <View style={styles.headerContent}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ChevronLeft color="white" size={30} strokeWidth={2.5} />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {isUserAuthor ? "Échange avec un intervenant" : "Échange avec un élève"}
          </Text>
          <View style={styles.idBadge}>
            <Lock size={10} color="#caf0f8" style={{ marginRight: 4 }} />
            <Text style={styles.idText}>
                ID: {reportId?.toString().toUpperCase().slice(0, 8)}
            </Text>
          </View>
        </View>

        <View style={styles.shieldIcon}>
          <ShieldCheck color="#76c893" size={24} />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: 30, // Ajuste selon la StatusBar
    paddingBottom: 15,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  backButton: {
    padding: 5,
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
  },
  idBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  idText: {
    color: '#caf0f8',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  shieldIcon: {
    paddingHorizontal: 10,
  },
});