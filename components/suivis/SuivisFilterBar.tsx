import { MessageCircle } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Colors, GARDIAN_CLAIR } from '../../constants/theme';

export const SUIVIS_STATUS_FILTERS = [
  'Tous',
  'Non traité',
  'En cours',
  'Résolu',
] as const;

export type SuivisStatusFilter = (typeof SUIVIS_STATUS_FILTERS)[number];

type SuivisFilterBarProps = {
  status: SuivisStatusFilter;
  onStatusChange: (status: SuivisStatusFilter) => void;
  onlyWithChat: boolean;
  onOnlyWithChatChange: (value: boolean) => void;
};

export function SuivisFilterBar({
  status,
  onStatusChange,
  onlyWithChat,
  onOnlyWithChatChange,
}: SuivisFilterBarProps) {
  return (
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {SUIVIS_STATUS_FILTERS.map((item) => {
          const selected = status === item;
          return (
            <Pressable
              key={item}
              onPress={() => onStatusChange(item)}
              style={[styles.chip, selected && styles.chipSelected]}
              accessibilityRole="button"
              accessibilityState={{ selected }}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {item}
              </Text>
            </Pressable>
          );
        })}

        <Pressable
          onPress={() => onOnlyWithChatChange(!onlyWithChat)}
          style={[styles.chip, onlyWithChat && styles.chipChatSelected]}
          accessibilityRole="button"
          accessibilityState={{ selected: onlyWithChat }}
        >
          <MessageCircle
            size={13}
            color={onlyWithChat ? '#FFFFFF' : Colors.light.primary}
            strokeWidth={2.4}
          />
          <Text
            style={[
              styles.chipText,
              onlyWithChat ? styles.chipTextSelected : styles.chipChatText,
            ]}
          >
            Chat actif
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

export function matchesStatusFilter(reportStatus: string | null | undefined, filter: SuivisStatusFilter) {
  if (filter === 'Tous') return true;
  const value = reportStatus || 'Non traité';
  if (filter === 'Résolu') return value === 'Résolu' || value === 'Traité';
  return value === filter;
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
    backgroundColor: GARDIAN_CLAIR,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(148, 163, 184, 0.35)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingRight: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#EEF4F4',
    borderWidth: 1,
    borderColor: '#D8E2E8',
    minHeight: 32,
  },
  chipSelected: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  chipChatSelected: {
    backgroundColor: '#0077B6',
    borderColor: '#0077B6',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.text,
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  chipChatText: {
    color: Colors.light.primary,
  },
});
