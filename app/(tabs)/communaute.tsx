import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { MessageCircle, PenLine, Plus, ThumbsUp, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { CommunityCommentsList } from '../../components/Community/CommunityCommentsList';
import { CommunityCreateModal } from '../../components/Community/CommunityCreateModal';
import { CommunityIntroCard } from '../../components/Community/CommunityIntroCard';
import { CommunityPostSuccessModal } from '../../components/Community/CommunityPostSuccessModal';
import { ReplyComposerBar } from '../../components/Community/ReplyComposerBar';
import { PageHeader } from '../../components/headers/PageHeader';
import { KeyboardAwareBody } from '../../components/layout/KeyboardAwareBody';
import { ImageLightboxModal } from '../../components/modals/ImageLightboxModal';
import { useTabBarHidden } from '../../components/navigation/TabBarVisibility';
import { GARDIAN_CLAIR } from '../../constants/theme';
import { useCommunityPosts } from '../../hooks/community/useCommunityPosts';
import { useCreatePost } from '../../hooks/community/useCreatePost';
import { usePostComments } from '../../hooks/community/usePostComments';
import { useKeyboardVisible } from '../../hooks/useKeyboardVisible';
import { useUserToken } from '../../hooks/useUserToken';
import {
  formatCommunityDateTime,
  getCommunityAuthorRole,
  getCommunityDisplayName,
  getPostTitleAndBody,
} from '../../utils/community';

export default function CommunauteScreen() {
  const userToken = useUserToken();
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [replyingPostId, setReplyingPostId] = useState<string | null>(null);
  const [createVisible, setCreateVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [lightboxUri, setLightboxUri] = useState<string | null>(null);

  const {
    posts,
    sortedPosts,
    votes,
    myVotes,
    commentCounts,
    fetchPosts,
    handleLike,
    confirmDeletePost,
  } = useCommunityPosts(userToken);

  const { resetForm: _resetCreateForm, ...createPostProps } = useCreatePost(
    userToken,
    fetchPosts
  );
  void _resetCreateForm;
  const activeCommentPostId = replyingPostId ?? expandedPostId;
  const commentsState = usePostComments(activeCommentPostId, userToken);
  const tabBarHeight = useBottomTabBarHeight();
  const keyboardVisible = useKeyboardVisible();
  const hideTabBar = createVisible || !!replyingPostId || keyboardVisible;

  useTabBarHidden(hideTabBar);

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
      fetchPosts({ resort: false });
    }
  };

  const handlePublished = () => {
    setCreateVisible(false);
    setSuccessVisible(true);
  };

  return (
    <View style={styles.safeArea}>
      <PageHeader
        title="Communauté"
        subtitle="Espace d'échange entre élèves, dans le respect et la bienveillance."
      />

      <KeyboardAwareBody keyboardVerticalOffset={hideTabBar ? 0 : tabBarHeight}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <CommunityIntroCard />

          <View style={styles.createWrap}>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => setCreateVisible(true)}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Créer un sujet"
            >
              <View style={styles.createIcon}>
                <Plus color="#ffffff" size={18} strokeWidth={2.6} />
              </View>
              <Text style={styles.createButtonText}>Créer un sujet</Text>
              <PenLine color="#023e8a" size={18} />
            </TouchableOpacity>
          </View>

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
              const liked = myVotes[post.id] === 1;
              const { title, body } = getPostTitleAndBody(post.content);

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
                        onPress={() => handleLike(post.id)}
                        accessibilityRole="button"
                        accessibilityLabel={liked ? 'Retirer le like' : 'Liker'}
                      >
                        <ThumbsUp
                          color={liked ? '#10ac56' : '#64748b'}
                          fill={liked ? '#10ac56' : 'transparent'}
                          size={18}
                        />
                      </TouchableOpacity>
                      <Text style={styles.score}>{score}</Text>
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
                          {title}
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

                      {body ? (
                        <Text style={styles.threadPreview} numberOfLines={3}>
                          {body}
                        </Text>
                      ) : null}
                    </TouchableOpacity>

                    {post.image_url ? (
                      <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => setLightboxUri(post.image_url)}
                        accessibilityRole="button"
                        accessibilityLabel="Voir l'image en grand"
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
                      fetchPosts({ resort: false });
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
      </KeyboardAwareBody>

      <CommunityCreateModal
        visible={createVisible}
        onClose={() => setCreateVisible(false)}
        onPublished={handlePublished}
        {...createPostProps}
      />

      <CommunityPostSuccessModal
        visible={successVisible}
        onClose={() => setSuccessVisible(false)}
      />

      <ImageLightboxModal
        visible={!!lightboxUri}
        uri={lightboxUri}
        onClose={() => setLightboxUri(null)}
      />
    </View>
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
  createWrap: {
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F0F9FF',
    borderWidth: 1.5,
    borderColor: '#7DD3FC',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    shadowColor: '#023e8a',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  createIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#023e8a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: '#023e8a',
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
    width: 36,
    alignItems: 'center',
    paddingTop: 2,
    gap: 2,
  },
  voteButton: {
    padding: 4,
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
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 21,
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
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
    marginTop: 6,
    fontWeight: '500',
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
