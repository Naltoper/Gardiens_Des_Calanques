import { ChevronDown, ChevronUp, MessageCircle, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { CommunityCommentsList } from '../../components/Community/CommunityCommentsList';
import { CommunityCreateCard } from '../../components/Community/CommunityCreateCard';
import { CommunityIntroCard } from '../../components/Community/CommunityIntroCard';
import { ReplyComposerBar } from '../../components/Community/ReplyComposerBar';
import { PageHeader } from '../../components/headers/PageHeader';
import { GARDIAN_CLAIR } from '../../constants/theme';
import { useCommunityPosts } from '../../hooks/community/useCommunityPosts';
import { useCreatePost } from '../../hooks/community/useCreatePost';
import { usePostComments } from '../../hooks/community/usePostComments';
import { useUserToken } from '../../hooks/useUserToken';
import {
  formatCommunityDateTime,
  getCommunityAuthorRole,
  getCommunityDisplayName,
  getForumPreview,
  getForumTopicTitle,
} from '../../utils/community';

export default function CommunauteScreen() {
  const userToken = useUserToken();
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [replyingPostId, setReplyingPostId] = useState<string | null>(null);

  const {
    posts,
    sortedPosts,
    votes,
    myVotes,
    commentCounts,
    fetchPosts,
    handleVote,
    confirmDeletePost,
  } = useCommunityPosts(userToken);

  const createPostProps = useCreatePost(userToken, fetchPosts);
  const activeCommentPostId = replyingPostId ?? expandedPostId;
  const commentsState = usePostComments(activeCommentPostId, userToken);

  const toggleComments = (postId: string) => {
    setExpandedPostId((current) => (current === postId ? null : postId));
  };

  const openReply = (postId: string) => {
    setExpandedPostId(postId);
    setReplyingPostId(postId);
  };

  const handleSendReply = async () => {
    const sent = await commentsState.handleCreateComment();
    if (sent) {
      fetchPosts();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.safeArea}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
    >
      <PageHeader
        title="Communauté"
        subtitle="Espace d'échange entre élèves, dans le respect et la bienveillance."
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <CommunityIntroCard />
        <CommunityCreateCard {...createPostProps} />

        <View style={styles.listHeader}>
          <Text style={styles.listHeaderTitle}>Sujets récents</Text>
          <Text style={styles.listHeaderMeta}>
            {posts.length} {posts.length > 1 ? 'sujets' : 'sujet'}
          </Text>
        </View>

        {posts.length === 0 ? (
          <View style={styles.emptyRow}>
            <Text style={styles.emptyText}>Aucun sujet pour le moment.</Text>
          </View>
        ) : (
          sortedPosts.map((post, index) => {
            const score = votes[post.id] || 0;
            const commentCount = commentCounts[post.id] || 0;
            const isMine = userToken === post.user_token;
            const displayName = getCommunityDisplayName(post.is_anonyme, post.author_name);
            const role = getCommunityAuthorRole(post.is_anonyme);
            const isExpanded = expandedPostId === post.id;

            return (
              <View
                key={post.id}
                style={[
                  styles.threadRow,
                  index === sortedPosts.length - 1 && styles.threadRowLast,
                ]}
              >
                <View style={styles.threadMain}>
                  <View style={styles.voteColumn}>
                    <TouchableOpacity
                      style={styles.voteButton}
                      onPress={() => handleVote(post.id, 1)}
                      accessibilityRole="button"
                      accessibilityLabel="Voter pour"
                    >
                      <ChevronUp
                        color={myVotes[post.id] === 1 ? '#10ac56' : '#64748b'}
                        size={20}
                      />
                    </TouchableOpacity>
                    <Text style={styles.score}>{score}</Text>
                    <TouchableOpacity
                      style={styles.voteButton}
                      onPress={() => handleVote(post.id, -1)}
                      accessibilityRole="button"
                      accessibilityLabel="Voter contre"
                    >
                      <ChevronDown
                        color={myVotes[post.id] === -1 ? '#10ac56' : '#64748b'}
                        size={20}
                      />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={styles.threadBody}
                    activeOpacity={0.85}
                    onPress={() => toggleComments(post.id)}
                    accessibilityRole="button"
                    accessibilityLabel="Voir les commentaires"
                  >
                    <View style={styles.threadTitleRow}>
                      <Text style={styles.threadTitle} numberOfLines={2}>
                        {getForumTopicTitle(post.content)}
                      </Text>
                      {isMine && (
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => confirmDeletePost(post.id)}
                          accessibilityRole="button"
                          accessibilityLabel="Supprimer le sujet"
                        >
                          <Trash2 color="#ef4444" size={16} />
                        </TouchableOpacity>
                      )}
                    </View>

                    <Text style={styles.threadMeta} numberOfLines={1}>
                      {displayName} · {role} · {formatCommunityDateTime(post.created_at)}
                    </Text>

                    <Text style={styles.threadPreview} numberOfLines={2}>
                      {getForumPreview(post.content)}
                    </Text>
                  </TouchableOpacity>

                  {post.image_url ? (
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => toggleComments(post.id)}
                    >
                      <Image
                        source={{ uri: post.image_url }}
                        style={styles.threadThumb}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>

                <View style={styles.threadFooter}>
                  <TouchableOpacity
                    style={styles.repliesButton}
                    onPress={() => toggleComments(post.id)}
                    accessibilityRole="button"
                    accessibilityLabel="Voir les commentaires"
                  >
                    <MessageCircle color="#023e8a" size={15} />
                    <Text style={styles.repliesText}>
                      {commentCount} {commentCount > 1 ? 'commentaires' : 'commentaire'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.replyAction}
                    onPress={() => openReply(post.id)}
                    accessibilityRole="button"
                    accessibilityLabel="Répondre"
                  >
                    <Text style={styles.replyActionText}>Répondre</Text>
                  </TouchableOpacity>
                </View>

                {isExpanded ? (
                  <CommunityCommentsList
                    comments={
                      activeCommentPostId === post.id ? commentsState.comments : []
                    }
                    userToken={userToken}
                    onDelete={(commentId) => {
                      commentsState.confirmDeleteComment(commentId);
                      fetchPosts();
                    }}
                  />
                ) : null}
              </View>
            );
          })
        )}
      </ScrollView>

      {replyingPostId ? (
        <ReplyComposerBar
          content={commentsState.content}
          setContent={commentsState.setContent}
          isAnonyme={commentsState.isAnonyme}
          setIsAnonyme={commentsState.setIsAnonyme}
          authorName={commentsState.authorName}
          setAuthorName={commentsState.setAuthorName}
          loading={commentsState.loading}
          onSend={handleSendReply}
          onClose={() => setReplyingPostId(null)}
        />
      ) : null}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: GARDIAN_CLAIR,
  },
  scroll: {
    flex: 1,
    backgroundColor: GARDIAN_CLAIR,
  },
  container: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(2, 62, 138, 0.12)',
  },
  listHeaderTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#023e8a',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  listHeaderMeta: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  emptyRow: {
    paddingVertical: 28,
    paddingHorizontal: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 14,
  },
  threadRow: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(2, 62, 138, 0.12)',
    backgroundColor: GARDIAN_CLAIR,
  },
  threadRowLast: {
    borderBottomWidth: 0,
  },
  threadMain: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  voteColumn: {
    width: 32,
    alignItems: 'center',
    paddingTop: 2,
  },
  voteButton: {
    padding: 2,
  },
  score: {
    minWidth: 22,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '800',
    color: '#023e8a',
  },
  threadBody: {
    flex: 1,
    minWidth: 0,
  },
  threadTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  threadTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 20,
  },
  deleteButton: {
    padding: 4,
  },
  threadMeta: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    fontWeight: '500',
  },
  threadPreview: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 19,
    marginTop: 6,
  },
  threadFooter: {
    marginTop: 10,
    marginLeft: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  repliesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  repliesText: {
    color: '#023e8a',
    fontSize: 12,
    fontWeight: '700',
  },
  replyAction: {
    paddingVertical: 2,
  },
  replyActionText: {
    color: '#0077b6',
    fontSize: 12,
    fontWeight: '800',
  },
  threadThumb: {
    width: 56,
    height: 56,
    borderRadius: 6,
    backgroundColor: '#d1e4e3',
    marginTop: 2,
  },
});
