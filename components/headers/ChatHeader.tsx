import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, FileText } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import {
  HEADER_FG,
  HEADER_FG_MUTED,
  HEADER_GRADIENT_COLORS,
  HEADER_GRADIENT_END,
  HEADER_GRADIENT_START,
} from '../../constants/theme';

interface ChatHeaderProps {
  reportId?: string | undefined;
  role: 'user' | 'admin' | string | string[] | undefined;
  onShowDetails?: () => void;
}

export const ChatHeader = ({ role, onShowDetails }: ChatHeaderProps) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top, Platform.OS === 'android' ? 12 : 0);
  const isUserAuthor = role === 'user';
  const detailsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!onShowDetails) return;
    Animated.spring(detailsAnim, {
      toValue: 1,
      friction: 7,
      tension: 60,
      useNativeDriver: true,
    }).start();
  }, [onShowDetails, detailsAnim]);

  const handleBack = () => {
    router.replace('/(tabs)/suivis');
  };

  return (
    <LinearGradient
      colors={[...HEADER_GRADIENT_COLORS]}
      start={HEADER_GRADIENT_START}
      end={HEADER_GRADIENT_END}
      style={[styles.headerGradient, { paddingTop: topPadding + 12 }]}
    >
      <View style={styles.headerTopContent}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Retour"
        >
          <ChevronLeft color={HEADER_FG} size={30} strokeWidth={2.5} />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={2}>
            {isUserAuthor ? 'Échange avec un intervenant' : 'Échange avec un élève'}
          </Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            Discussion sécurisée et confidentielle
          </Text>
        </View>

        <View style={styles.topRightPlaceholder} />
      </View>

      {onShowDetails ? (
        <Animated.View
          style={[
            styles.headerBottomContent,
            {
              opacity: detailsAnim,
              transform: [
                {
                  translateY: detailsAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [8, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity
            onPress={onShowDetails}
            style={styles.documentIconButton}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Voir les détails du signalement"
          >
            <FileText size={15} color="#023e8a" style={{ marginRight: 6 }} />
            <Text style={styles.documentButtonText}>Détails du signalement</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : null}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  headerGradient: {
    paddingBottom: 16,
    width: '100%',
    zIndex: 10,
    elevation: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.35)',
  },
  headerTopContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  backButton: {
    padding: 5,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  headerTitle: {
    color: HEADER_FG,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  headerSubtitle: {
    color: HEADER_FG_MUTED,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 3,
  },
  topRightPlaceholder: {
    width: 40,
  },
  headerBottomContent: {
    alignItems: 'center',
    marginTop: 14,
  },
  documentIconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    minHeight: 40,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  documentButtonText: {
    color: '#023e8a',
    fontSize: 13,
    fontWeight: '700',
  },
});
