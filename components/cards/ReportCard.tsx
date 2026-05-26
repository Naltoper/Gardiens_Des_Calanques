import { Eye, FileText, MessageCircle, Trash2 } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Report } from '../../types/report';

interface ReportCardProps {
  item: Report;
  onChat: () => void;
  onDetails: () => void;
  onDelete: () => void;
  formatDateTime: (date: string) => string;
}

// Mapping des couleurs par statut
const STATUS_CONFIG: Record<string, { main: string; bg: string }> = {
  'Non traité': { main: '#00b4d8', bg: '#e0f2fe' },
  'En cours': { main: '#f59e0b', bg: '#fef3c7' },
  'Traité': { main: '#10ac56', bg: '#e6f4f1' },
  'Résolu': { main: '#10ac56', bg: '#e6f4f1' },
};

export const ReportCard = ({ item, onChat, onDetails, onDelete, formatDateTime }: ReportCardProps) => {
  const config = STATUS_CONFIG[item.status || ''] || STATUS_CONFIG['Non traité'];
  const statusColor = config.main;
  const bgColor = config.bg;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.card, { borderLeftColor: statusColor }]}
      onPress={onChat}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.date}>Posté le {formatDateTime(item.created_at)}</Text>

        {/* Nouveau bouton de détails avec l'icône de document ET le texte */}
        <TouchableOpacity
          onPress={(event) => {
            event.stopPropagation();
            onDetails();
          }}
          style={styles.documentIconButton} // On garde ce nom de style
        >
          <FileText size={16} color="#023e8a" style={{ marginRight: 6 }} />
          <Text style={styles.documentButtonText}>Détails</Text>
        </TouchableOpacity> 

        {/* Bouton supprimer sorti des actions de groupe et positionné de manière absolue */}
        <TouchableOpacity
          onPress={(event) => {
            event.stopPropagation();
            onDelete();
          }}
          style={styles.absoluteDeleteButton}
        >
          <Trash2 size={18} color="#ef4444" />
        </TouchableOpacity>

        <View style={[styles.badge, { backgroundColor: bgColor }]}>
          <View style={[styles.dot, { backgroundColor: statusColor }]} />
          <Text style={[styles.badgeText, { color: statusColor }]}>
            {item.status}
          </Text>
        </View>
      </View>

      <Text style={styles.content} numberOfLines={2}>
        {item.content}
      </Text>

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
    marginBottom: 12,
    gap: 8,
    paddingRight: 24, // Place pour la poubelle
  },
  date: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  iconButton: {
    padding: 5,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
    color: '#334155',
    marginBottom: 15,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerLink: {
    fontSize: 13,
    color: '#00b4d8',
    fontWeight: '700',
  },
  arrow: {
    fontSize: 18,
    color: '#00b4d8',
    fontWeight: 'bold',
  },
  // Positionnement de la poubelle tout en haut à droite du conteneur de la carte
  absoluteDeleteButton: {
    position: 'absolute',
    top: 0,
    right: -16, // Décalé vers le bord extérieur droit
    padding: 8,
  },
  // Look du nouveau bouton détails (fond gris léger, coins arrondis)
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  detailsIconButton: {
    backgroundColor: '#e0f2fe', // Un fond bleu très clair
    padding: 8,
    borderRadius: 12,
  },
  documentIconButton: {
    flexDirection: 'row', // Force l'icône et le texte à être côte à côte
    alignItems: 'center', // Centre verticalement l'icône et le texte
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  documentButtonText: {
    fontSize: 12,
    color: '#023e8a',
    fontWeight: '700',
  },
});