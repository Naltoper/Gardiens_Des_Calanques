import { FileText, MessageCircle, Shield, Trash2, User } from 'lucide-react-native';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { APP_COLORS, Colors } from '../../constants/theme';
import { Report } from '../../types/report';
import { GradientButton } from '../buttons/GradientButton';

export const STATUS_COLORS: Record<
  string,
  { bg: string; dot: string; text: string }
> = {
  'En cours': {
    bg: Colors.light.status.warningBg,
    dot: Colors.light.status.warning,
    text: Colors.light.status.warningText,
  },
  Traité: {
    bg: Colors.light.status.successBg,
    dot: Colors.light.status.success,
    text: Colors.light.status.successText,
  },
  Résolu: {
    bg: Colors.light.status.successBg,
    dot: Colors.light.status.success,
    text: Colors.light.status.successText,
  },
  'Non traité': {
    bg: '#E0F2FE',
    dot: APP_COLORS.primary,
    text: APP_COLORS.blue,
  },
};

interface ReportCardProps {
  item: Report;
  index?: number;
  onChat: () => void;
  onDetails: () => void;
  onDelete: () => void;
  formatDateTime: (date: string) => string;
  hasUnreadChat?: boolean;
}

export const ReportCard = ({
  item,
  index: _index = 0,
  onChat,
  onDetails,
  onDelete,
  formatDateTime,
  hasUnreadChat = false,
}: ReportCardProps) => {
  const colors = STATUS_COLORS[item.status || ''] || STATUS_COLORS['Non traité'];
  const statusColor = colors.dot;
  const reportDate = formatDateTime(item.created_at);

  const { width } = useWindowDimensions();
  const isCompact = width < 400;

  return (
    <Animated.View
      entering={FadeInDown.duration(220).springify().damping(22).mass(0.7)}
      style={[
        styles.card,
        isCompact && styles.cardCompact,
        { borderLeftColor: statusColor },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.authorBlock}>
          <View
            style={[
              styles.avatar,
              item.is_anonyme ? styles.avatarAnonymous : styles.avatarNamed,
            ]}
          >
            {item.is_anonyme ? (
              <Shield size={18} color={Colors.light.textMuted} />
            ) : (
              <User size={18} color={Colors.light.primary} />
            )}
          </View>
          <Text
            style={[
              styles.authorName,
              {
                color: item.is_anonyme
                  ? Colors.light.textMuted
                  : Colors.light.primary,
              },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.is_anonyme ? 'Anonyme' : item.author_name}
          </Text>
        </View>

        <Pressable
          onPress={(event) => {
            event.stopPropagation();
            onDetails();
          }}
          style={({ pressed }) => [
            styles.detailsButton,
            pressed && styles.detailsButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Voir les détails"
        >
          <FileText size={16} color={Colors.light.primary} />
          <Text style={styles.detailsButtonText}>Détails</Text>
        </Pressable>

        <Pressable
          onPress={(event) => {
            event.stopPropagation();
            onDelete();
          }}
          style={({ pressed }) => [
            styles.deleteButton,
            pressed && styles.deleteButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Supprimer le signalement"
        >
          <Trash2 size={18} color={Colors.light.status.error} />
        </Pressable>
      </View>

      <View style={styles.contentPanel}>
        <Text
          style={[styles.reportText, isCompact && styles.reportTextCompact]}
          numberOfLines={5}
        >
          {item.content}
        </Text>
      </View>

      <View style={[styles.actionsRow, isCompact && styles.actionsRowCompact]}>
        <View style={styles.actionsSide}>
          <View style={styles.statusLabel}>
            <View style={[styles.statusDot, { backgroundColor: colors.dot }]} />
            <Text
              style={[styles.statusText, { color: colors.text }]}
              numberOfLines={1}
            >
              {item.status}
            </Text>
          </View>
        </View>

        <View style={styles.dateWrap}>
          {reportDate ? (
            <Text style={styles.reportDate} numberOfLines={2}>
              {reportDate}
            </Text>
          ) : null}
        </View>

        <View style={[styles.actionsSide, styles.actionsSideRight]}>
          <View style={styles.chatButtonWrap}>
            <GradientButton
              icon={<MessageCircle size={28} color="white" />}
              colors={[APP_COLORS.gradient.start, APP_COLORS.gradient.start]}
              onPress={onChat}
              width={isCompact ? 56 : 60}
              height={isCompact ? 56 : 60}
              style={styles.chatButton}
              title=""
              accessibilityLabel="Ouvrir le chat"
            />
            {hasUnreadChat ? (
              <View
                style={styles.unreadBadge}
                accessibilityLabel="Nouveau message non lu"
              />
            ) : null}
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.surface,
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    gap: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  cardCompact: {
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  authorBlock: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minWidth: 0,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarNamed: {
    backgroundColor: '#E8F4FD',
  },
  avatarAnonymous: {
    backgroundColor: Colors.light.borderSubtle,
  },
  authorName: {
    flex: 1,
    minWidth: 0,
    fontSize: 16,
    fontWeight: '700',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    minHeight: 44,
  },
  detailsButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  detailsButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.light.primary,
  },
  deleteButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.status.errorBg,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  deleteButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  contentPanel: {
    backgroundColor: Colors.light.background,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#94A3B8',
  },
  reportText: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.light.text,
    fontWeight: '500',
  },
  reportTextCompact: {
    fontSize: 14,
    lineHeight: 21,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 60,
    gap: 8,
  },
  actionsRowCompact: {
    minHeight: 56,
  },
  actionsSide: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  actionsSideRight: {
    justifyContent: 'flex-end',
  },
  statusLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 0,
    paddingVertical: 4,
    backgroundColor: 'transparent',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    flexShrink: 1,
    fontSize: 11,
    fontWeight: '700',
  },
  dateWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    maxWidth: 110,
  },
  reportDate: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.light.textMuted,
    letterSpacing: 0.2,
    textAlign: 'center',
    lineHeight: 15,
  },
  chatButtonWrap: {
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: 'rgba(2, 62, 138, 0.28)',
    backgroundColor: APP_COLORS.gradient.start,
    shadowColor: '#023e8a',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
    overflow: 'visible',
  },
  chatButton: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  unreadBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.light.status.error,
    borderWidth: 2,
    borderColor: Colors.light.surface,
    zIndex: 20,
  },
});
