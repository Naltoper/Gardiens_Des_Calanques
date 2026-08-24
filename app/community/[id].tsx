import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThumbsUp } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { CommunityCommentsList } from '../../components/Community/CommunityCommentsList';
import { ReplyComposerBar } from '../../components/Community/ReplyComposerBar';
import { PageHeader } from '../../components/headers/PageHeader';
import { KeyboardAwareBody } from '../../components/layout/KeyboardAwareBody';
import { ImageLightboxModal } from '../../components/modals/ImageLightboxModal';
import { GARDIAN_CLAIR } from '../../constants/theme';
import { usePostComments } from '../../hooks/community/usePostComments';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';
import { useUserToken } from '../../hooks/useUserToken';
import { supabase } from '../../lib/supabase';
import type { CommunityPost } from '../../types/community';
import {
  formatCommunityDateTime,
  getCommunityAuthorRole,
  getCommunityDisplayName,
  getPostTitleAndBody,
} from '../../utils/community';
import { notify } from '../../utils/notify';

export default function CommunityPostDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const postId = Array.isArray(id) ? id[0] : id;
  const userToken = useUserToken();
  const commentsState = usePostComments(postId ?? null, userToken);

  const [post, setPost] = useState<CommunityPost | null>(null);
  const [score, setScore] = useState(0);
  const [liked, setLiked] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lightboxUri, setLightboxUri] = useState<string | null>(null);

  const fetchPost = useCallback(async () => {
    if (!postId) return;

    const { data, error } = await supabase
      .from('community_posts')
      .select('*')
      .eq('id', postId)
      .single();

    if (error) {
      console.error('Erreur chargement post:', error.message);
      notify('Erreur', 'Impossible de charger ce sujet.');
      return;
    }

    setPost(data as CommunityPost);

    const { data: votesData } = await supabase
      .from('community_votes')
      .select('vote_value, user_token')
      .eq('post_id', postId);

    const likes = (votesData || []).filter((vote) => vote.vote_value === 1);
    setScore(likes.length);
    setLiked(Boolean(userToken && likes.some((vote) => vote.user_token === userToken)));
  }, [postId, userToken]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchPost(), commentsState.fetchComments()]);
    setRefreshing(false);
  };

  const pullRefresh = usePullToRefresh({
    refreshing,
    onRefresh,
  });

  const handleLike = async () => {
    if (!postId || !userToken) {
      notify('Erreur', 'Token utilisateur introuvable.');
      return;
    }

    const wasLiked = liked;
    setLiked(!wasLiked);
    setScore((current) => Math.max(0, current + (wasLiked ? -1 : 1)));

    if (wasLiked) {
      const { error } = await supabase
        .from('community_votes')
        .delete()
        .eq('post_id', postId)
        .eq('user_token', userToken);
      if (error) {
        setLiked(true);
        setScore((current) => current + 1);
      }
      return;
    }

    const { error } = await supabase.from('community_votes').upsert(
      {
        post_id: postId,
        user_token: userToken,
        vote_value: 1,
      },
      { onConflict: 'post_id,user_token' }
    );

    if (error) {
      setLiked(false);
      setScore((current) => Math.max(0, current - 1));
    }
  };

  const handleSendReply = async () => {
    await commentsState.handleCreateComment();
  };

  const { title, body } = getPostTitleAndBody(post?.content || '');

  return (
    <View style={styles.safeArea}>
      <PageHeader
        title="Sujet"
        subtitle="Discussion de la communauté"
        onBack={() => router.back()}
      />

      <KeyboardAwareBody>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          {...pullRefresh}
        >
          {post ? (
            <View style={styles.postCard}>
              <View style={styles.postHeader}>
                <TouchableOpacity
                  style={styles.likeButton}
                  onPress={handleLike}
                  accessibilityRole="button"
                  accessibilityLabel={liked ? 'Retirer le like' : 'Liker'}
                >
                  <ThumbsUp
                    color={liked ? '#10ac56' : '#64748b'}
                    fill={liked ? '#10ac56' : 'transparent'}
                    size={18}
                  />
                  <Text style={styles.score}>{score}</Text>
                </TouchableOpacity>

                <View style={styles.postCopy}>
                  <Text style={styles.title}>{title}</Text>
                  <Text style={styles.meta}>
                    {getCommunityDisplayName(post.is_anonyme, post.author_name)} ·{' '}
                    {getCommunityAuthorRole(post.is_anonyme)} ·{' '}
                    {formatCommunityDateTime(post.created_at)}
                  </Text>
                </View>
              </View>

              {body ? <Text style={styles.body}>{body}</Text> : null}

              {post.image_url ? (
                <TouchableOpacity
                  onPress={() => setLightboxUri(post.image_url)}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                  accessibilityLabel="Voir l'image en grand"
                >
                  <Image
                    source={{ uri: post.image_url }}
                    style={styles.postImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          ) : (
            <Text style={styles.loadingText}>Chargement du sujet…</Text>
          )}

          <Text style={styles.commentsHeading}>
            {commentsState.comments.length}{' '}
            {commentsState.comments.length > 1 ? 'commentaires' : 'commentaire'}
          </Text>

          <CommunityCommentsList
            comments={commentsState.comments}
            userToken={userToken}
            onDelete={commentsState.confirmDeleteComment}
          />
        </ScrollView>

        <ReplyComposerBar
          content={commentsState.content}
          setContent={commentsState.setContent}
          isAnonyme={commentsState.isAnonyme}
          setIsAnonyme={commentsState.setIsAnonyme}
          authorName={commentsState.authorName}
          setAuthorName={commentsState.setAuthorName}
          loading={commentsState.loading}
          onSend={handleSendReply}
          showClose={false}
          autoFocus={false}
        />
      </KeyboardAwareBody>

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
  },
  container: {
    padding: 16,
    paddingBottom: 28,
  },
  postCard: {
    backgroundColor: GARDIAN_CLAIR,
    borderWidth: 1,
    borderColor: 'rgba(2, 62, 138, 0.12)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 18,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  likeButton: {
    alignItems: 'center',
    paddingTop: 2,
    gap: 4,
  },
  score: {
    fontSize: 13,
    fontWeight: '800',
    color: '#023e8a',
  },
  postCopy: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 24,
  },
  meta: {
    marginTop: 6,
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  body: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22,
    color: '#334155',
  },
  postImage: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginTop: 14,
    backgroundColor: '#d1e4e3',
  },
  commentsHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#023e8a',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 8,
  },
  loadingText: {
    color: '#64748b',
    textAlign: 'center',
    paddingVertical: 24,
  },
});
