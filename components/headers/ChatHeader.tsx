import { ChevronLeft, FileText } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { GARDIAN_CLAIR, HEADER_FG } from '../../constants/theme';
import { AppHeaderBar } from './AppHeaderBar';

interface ChatHeaderProps {
  reportId?: string | undefined;
  role: 'user' | 'admin' | string | string[] | undefined;
  onShowDetails?: () => void;
}

export const ChatHeader = ({ role, onShowDetails }: ChatHeaderProps) => {
  const router = useRouter();
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
    <AppHeaderBar
      title={isUserAuthor ? 'Échange avec un intervenant' : 'Échange avec un élève'}
      subtitle="Discussion sécurisée et confidentielle"
      left={
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Retour"
        >
          <ChevronLeft color={HEADER_FG} size={30} strokeWidth={2.5} />
        </TouchableOpacity>
      }
      right={<View style={styles.sidePlaceholder} />}
      secondary={
        onShowDetails ? (
          <Animated.View
            style={{
              opacity: detailsAnim,
              transform: [
                {
                  translateY: detailsAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [8, 0],
                  }),
                },
              ],
            }}
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
        ) : null
      }
    />
  );
};

const styles = StyleSheet.create({
  backButton: {
    padding: 5,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sidePlaceholder: {
    width: 40,
    height: 40,
  },
  documentIconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: GARDIAN_CLAIR,
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
