import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MessageCircle, Info } from 'lucide-react-native';
import { Report } from '../../types/report';


interface ReportCardProps {
  item: Report;
  onChat: () => void;
  onDetails: () => void;
  formatDateTime: (date: string) => string;
}

export const ReportCard = ({ item, onChat, onDetails, formatDateTime }: ReportCardProps) => {
  const isProcessed = item.status !== 'Non traité';
  const statusColor = isProcessed ? '#10ac56' : '#00b4d8';

  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      style={[styles.card, { borderLeftColor: statusColor }]}
      onPress={onChat}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.date}>Posté le {formatDateTime(item.created_at)}</Text>
        
        <TouchableOpacity onPress={onDetails} style={{ padding: 5 }}>
          <Info size={20} color="#94a3b8" />
        </TouchableOpacity>

        <View style={[styles.badge, { backgroundColor: isProcessed ? '#e6f4f1' : '#e0f2fe' }]}>
          <View style={[styles.dot, { backgroundColor: statusColor }]} />
          <Text style={[styles.badgeText, { color: statusColor }]}>{item.status}</Text>
        </View>
      </View>

      <Text style={styles.content} numberOfLines={2}>{item.content}</Text>

      <View style={styles.cardFooter}>
        <View style={styles.footerLeft}>
          <MessageCircle size={16} color="#48a4f4" style={{ marginRight: 8 }} />
          <Text style={styles.footerLink}>Discuter avec un intervenant</Text>
        </View>
        <Text style={styles.arrow}>→</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 20, 
    marginBottom: 16, 
    borderLeftWidth: 6,
    elevation: 3,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05, 
    shadowRadius: 10, 
  },
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 12 
  },
  date: { 
    color: '#94a3b8', 
    fontSize: 12, 
    fontWeight: '600' 
  },
  badge: { 
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12, 
    paddingVertical: 5, 
    borderRadius: 20 
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6
  },
  badgeText: { 
    fontSize: 10, 
    fontWeight: '800',
    textTransform: 'uppercase'
  },
  content: { 
    fontSize: 15, 
    lineHeight: 22,
    color: '#334155', 
    marginBottom: 15,
    fontWeight: '500'
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9'
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  footerLink: { 
    fontSize: 13, 
    color: '#00b4d8', 
    fontWeight: '700' 
  },
  arrow: {
    fontSize: 18,
    color: '#00b4d8',
    fontWeight: 'bold'
  },
});