import { Trash2 } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import type { CommunityComment } from '../../types/community';
import {
  formatCommunityDateTime,
  getCommunityDisplayName,
} from '../../utils/community';

type CommunityCommentsListProps = {
  comments: CommunityComment[];
  userToken: string | null;
  onDelete: (commentId: string) => void;
};

export function CommunityCommentsList({
  comments,
  userToken,
  onDelete,
}: CommunityCommentsListProps) {
  if (comments.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Aucun commentaire pour le moment.</Text>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {comments.map((comment) => {
        const name = getCommunityDisplayName(comment.is_anonyme, comment.author_name);
        const isMine = userToken === comment.user_token;

        return (
          <View key={comment.id} style={styles.row}>
            <Text style={styles.body}>
              <Text style={styles.author}>{name} </Text>
              {comment.content}
            </Text>
            <View style={styles.metaRow}>
              <Text style={styles.date}>{formatCommunityDateTime(comment.created_at)}</Text>
              {isMine ? (
                <TouchableOpacity
                  onPress={() => onDelete(comment.id)}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="Supprimer le commentaire"
                >
                  <Trash2 color="#ef4444" size={14} />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingTop: 8,
    gap: 10,
  },
  empty: {
    paddingVertical: 10,
  },
  emptyText: {
    fontSize: 13,
    color: '#64748b',
  },
  row: {
    paddingLeft: 4,
  },
  body: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
  author: {
    fontWeight: '800',
    color: '#0f172a',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  date: {
    fontSize: 11,
    color: '#94a3b8',
  },
});
