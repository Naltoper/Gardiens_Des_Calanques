import { useRouter } from 'expo-router';
import { ChevronLeft, FileText } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { HEADER_FG } from '../../constants/theme';
import { AppHeaderBar } from './AppHeaderBar';

interface ChatHeaderProps {
  reportId?: string | undefined;
  role: 'user' | 'admin' | string | string[] | undefined;
  onShowDetails?: () => void;
}

export const ChatHeader = ({ role, onShowDetails }: ChatHeaderProps) => {
  const router = useRouter();
  const isUserAuthor = role === 'user';

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
          style={styles.iconButton}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Retour"
        >
          <ChevronLeft color={HEADER_FG} size={26} strokeWidth={2.5} />
        </TouchableOpacity>
      }
      right={
        onShowDetails ? (
          <TouchableOpacity
            onPress={onShowDetails}
            style={styles.detailsButton}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Voir les détails du signalement"
          >
            <FileText size={16} color="#023E8A" />
          </TouchableOpacity>
        ) : (
          <View style={styles.sidePlaceholder} />
        )
      }
    />
  );
};

const styles = StyleSheet.create({
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsButton: {
    width: 44,
    height: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  sidePlaceholder: {
    width: 44,
    height: 44,
  },
});
