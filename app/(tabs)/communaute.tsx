import { useRouter } from 'expo-router';
import { ChevronDown, ChevronUp, MessageCircle, Trash2 } from 'lucide-react-native';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CommunityCreateCard } from '../../components/Community/CommunityCreateCard';
import { CommunityIntroCard } from '../../components/Community/CommunityIntroCard';
import { PageHeader } from '../../components/headers/PageHeader';
import { GARDIAN_CLAIR, PAGE_SCENE_BACKDROP } from '../../constants/theme';
import { useCommunityPosts } from '../../hooks/community/useCommunityPosts';
import { useCreatePost } from '../../hooks/community/useCreatePost';
import { useUserToken } from '../../hooks/useUserToken';
import {
  formatCommunityDateTime,
  getCommunityAuthorRole,
  getCommunityDisplayName,
  getForumPreview,
  getForumTopicTitle,
} from '../../utils/community';

export default function CommunauteScreen() {
  const router = useRouter();
  const userToken = useUserToken();

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

  return (
    <View style={styles.safeArea}>
      <ImageBackground
        source={require('../../assets/images/lyceeBgBlur.png')}
        style={styles.screenBackground}
        imageStyle={styles.screenBackgroundImage}
        resizeMode="cover"
      >
        <PageHeader
          title="Communauté"
          subtitle="Espace d'échange entre élèves, dans le respect et la bienveillance."
        />

        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.forumPanel}>
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

                return (
                  <View
                    key={post.id}
                    style={[
                      styles.threadRow,
                      index === sortedPosts.length - 1 && styles.threadRowLast,
                    ]}
                  >
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

                    <View style={styles.threadBody}>
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

                      <View style={styles.threadFooter}>
                        <TouchableOpacity
                          style={styles.repliesButton}
                          onPress={() => router.push(`/community/${post.id}` as any)}
                          accessibilityRole="button"
                          accessibilityLabel="Voir les réponses"
                        >
                          <MessageCircle color="#023e8a" size={15} />
                          <Text style={styles.repliesText}>
                            {commentCount} {commentCount > 1 ? 'réponses' : 'réponse'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {post.image_url ? (
                      <Image
                        source={{ uri: post.image_url }}
                        style={styles.threadThumb}
                        resizeMode="cover"
                      />
                    ) : null}
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PAGE_SCENE_BACKDROP,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 32,
  },
  forumPanel: {
    backgroundColor: GARDIAN_CLAIR,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(2, 62, 138, 0.12)',
    overflow: 'hidden',
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(2, 62, 138, 0.12)',
  },
  threadRowLast: {
    borderBottomWidth: 0,
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
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
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
  threadThumb: {
    width: 56,
    height: 56,
    borderRadius: 6,
    backgroundColor: '#d1e4e3',
    marginTop: 2,
  },
  screenBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: PAGE_SCENE_BACKDROP,
  },
  screenBackgroundImage: {
    opacity: 1,
  },
});
