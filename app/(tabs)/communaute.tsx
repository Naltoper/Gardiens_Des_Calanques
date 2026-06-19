import { useRouter } from 'expo-router';
import { ChevronDown, ChevronUp, MessageCircle, Trash2 } from 'lucide-react-native';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { CommunityIntroCard } from '../../components/Community/CommunityIntroCard';
import { CommunityCreateCard } from '../../components/Community/CommunityCreateCard'; 
import { ScreenHeader } from '../../components/headers/ScreenHeader';
import { useCommunityPosts } from '../../hooks/community/useCommunityPosts';
import { useUserToken } from '../../hooks/useUserToken';
import {
  formatCommunityDateTime,
  getCommunityDisplayName
} from '../../utils/community';
import { useCreatePost } from '../../hooks/community/useCreatePost';

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
        source={require('../../assets/images/lyceeBgBlur.png')} // Reprise de l'image de fond marine
        style={styles.screenBackground}
        imageStyle={styles.screenBackgroundImage}
        resizeMode="cover"
      >
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Communauté" onBack={() => router.replace('/(tabs)')} />

        <CommunityIntroCard />

        {/* RENDU MODULAIRE SÉPARÉ (SOLID) */}
          <CommunityCreateCard {...createPostProps} />

        <Text style={styles.postsTitle}>Publications récentes</Text>

        {posts.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Aucun post pour le moment.</Text>
          </View>
        ) : (
          sortedPosts.map((post) => {
            const score = votes[post.id] || 0;
            const commentCount = commentCounts[post.id] || 0;
            const isMine = userToken === post.user_token;
            const displayName = getCommunityDisplayName(post.is_anonyme, post.author_name);
            
            return (
              <View key={post.id} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <View>
                    <Text style={styles.author}>{displayName}</Text>
                    <Text style={styles.date}>{formatCommunityDateTime(post.created_at)}</Text>
                  </View>

                  {isMine && (
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => confirmDeletePost(post.id)}
                    >
                      <Trash2 color="#ef4444" size={20} />
                    </TouchableOpacity>
                  )}
                </View>

                <Text style={styles.postContent}>{post.content}</Text>
                {post.image_url && (
                  <Image
                    source={{ uri: post.image_url }}
                    style={styles.postImage}
                    resizeMode="cover"
                    onError={(error) => {
                      console.error('Erreur affichage image:', error.nativeEvent);
                }}
              />
            )}

                <View style={styles.actionsRow}>
                  <View style={styles.voteBox}>
                    <TouchableOpacity
                      style={[
                        styles.voteButton,
                        myVotes[post.id] === 1 && styles.activeVoteButton,
                      ]}
                      onPress={() => handleVote(post.id, 1)}
                    >
                      <ChevronUp
                        color={myVotes[post.id] === 1 ? '#10ac56' : '#64748b'}
                        size={22}
                      />
                    </TouchableOpacity>

                    <Text style={styles.score}>{score}</Text>

                    <TouchableOpacity
                      style={[
                        styles.voteButton,
                        myVotes[post.id] === -1 && styles.activeVoteButton,
                      ]}
                      onPress={() => handleVote(post.id, -1)}
                    >
                      <ChevronDown
                        color={myVotes[post.id] === -1 ? '#10ac56' : '#64748b'}
                        size={22}
                      />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={styles.commentButton}
                    onPress={() => router.push(`/community/${post.id}` as any)}
                  >
                    <MessageCircle color="#023e8a" size={20} />
                    <Text style={styles.commentText}>{commentCount} {commentCount > 1 ? 'commentaires' : 'commentaire'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flexGrow: 1,
    padding: 24,
  },
  postsTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#023e8a',
    marginBottom: 14,
  },
  emptyCard: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: '#caf0f8',
  },
  emptyText: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 15,
  },
  postCard: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#caf0f8',
    shadowColor: '#0077b6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  author: {
    fontSize: 16,
    fontWeight: '800',
    color: '#023e8a',
  },
  date: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 3,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 14,
    backgroundColor: '#fee2e2',
  },
  postContent: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 23,
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  voteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#dbeafe',
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  voteButton: {
    padding: 6,
    borderRadius: 12,
  },
  activeVoteButton: {
    backgroundColor: '#dcfce7',
  },
  score: {
    minWidth: 28,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
    color: '#023e8a',
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 16,
  },
  commentText: {
    color: '#023e8a',
    fontSize: 14,
    fontWeight: '700',
  },
  screenBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  screenBackgroundImage: {
    opacity: 0.5, // Opacité ultra-légère (5%) pour préserver le contraste de tes cartes de discussion blanches
  },
  postImage: {
    width: '100%',
    height: 210,
    borderRadius: 18,
    backgroundColor: '#e2e8f0',
    marginBottom: 16,
    resizeMode: 'cover',
  },
});