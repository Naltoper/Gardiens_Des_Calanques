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
      <Text style={styles.heading}>Trier</Text>
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
            size={14}
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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: 'transparent',
  },
  heading: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingRight: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: GARDIAN_CLAIR,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    minHeight: 36,
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
    fontSize: 13,
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
