import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ChevronDown, ChevronUp, MessageCircle, Send, Trash2, Users } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { GradientButton } from '../../components/buttons/GradientButton';
import { ScreenHeader } from '../../components/headers/ScreenHeader';
import { useUserToken } from '../../hooks/useUserToken';
import { supabase } from '../../lib/supabase';

type CommunityPost = {
  id: string;
  created_at: string;
  content: string;
  is_anonyme: boolean;
  author_name: string | null;
  user_token: string;
};

type VoteRow = {
  post_id: string;
  vote_value: number;
};

export default function CommunauteScreen() {
  const router = useRouter();
  const userToken = useUserToken();

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [myVotes, setMyVotes] = useState<Record<string, number>>({});

  const [content, setContent] = useState('');
  const [isAnonyme, setIsAnonyme] = useState(true);
  const [authorName, setAuthorName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [userToken]);

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const fetchPosts = async () => {
    const { data: postsData, error: postsError } = await supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (postsError) {
      console.error('Erreur chargement posts:', postsError.message);
      return;
    }

    const safePosts = postsData || [];
    setPosts(safePosts);

    const postIds = safePosts.map((post) => post.id);

    if (postIds.length === 0) {
      setVotes({});
      setMyVotes({});
      return;
    }

    const { data: votesData, error: votesError } = await supabase
      .from('community_votes')
      .select('post_id, vote_value')
      .in('post_id', postIds);

    if (votesError) {
      console.error('Erreur chargement votes:', votesError.message);
      return;
    }

    const scores: Record<string, number> = {};

    (votesData as VoteRow[] | null)?.forEach((vote) => {
      scores[vote.post_id] = (scores[vote.post_id] || 0) + vote.vote_value;
    });

    setVotes(scores);

    if (userToken) {
      const { data: myVotesData, error: myVotesError } = await supabase
        .from('community_votes')
        .select('post_id, vote_value')
        .eq('user_token', userToken)
        .in('post_id', postIds);

      if (myVotesError) {
        console.error('Erreur chargement mes votes:', myVotesError.message);
        return;
      }

      const userVotes: Record<string, number> = {};

      (myVotesData as VoteRow[] | null)?.forEach((vote) => {
        userVotes[vote.post_id] = vote.vote_value;
      });

      setMyVotes(userVotes);
    }
  };

  const handleCreatePost = async () => {
    if (!userToken) {
      Alert.alert('Erreur', 'Token utilisateur introuvable. Réessayez dans quelques secondes.');
      return;
    }

    if (!content.trim()) {
      Alert.alert('Champ obligatoire', 'Écris un message avant de publier.');
      return;
    }

    if (!isAnonyme && !authorName.trim()) {
      Alert.alert('Nom obligatoire', 'Entre un nom public ou active le mode anonyme.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.from('community_posts').insert({
      content: content.trim(),
      is_anonyme: isAnonyme,
      author_name: isAnonyme ? null : authorName.trim(),
      user_token: userToken,
    });

    setLoading(false);

    if (error) {
      console.error('Erreur création post:', error.message);
      Alert.alert('Erreur', "Impossible de publier le post.");
      return;
    }

    setContent('');
    setAuthorName('');
    setIsAnonyme(true);
    fetchPosts();
  };

  const handleVote = async (postId: string, value: 1 | -1) => {
    if (!userToken) {
      Alert.alert('Erreur', 'Token utilisateur introuvable.');
      return;
    }

    const currentVote = myVotes[postId];

    if (currentVote === value) {
      const { error } = await supabase
        .from('community_votes')
        .delete()
        .eq('post_id', postId)
        .eq('user_token', userToken);

      if (error) {
        console.error('Erreur suppression vote:', error.message);
        return;
      }

      fetchPosts();
      return;
    }

    const { error } = await supabase
      .from('community_votes')
      .upsert(
        {
          post_id: postId,
          user_token: userToken,
          vote_value: value,
        },
        { onConflict: 'post_id,user_token' }
      );

    if (error) {
      console.error('Erreur vote:', error.message);
      return;
    }

    fetchPosts();
  };

  const confirmDeletePost = (postId: string) => {
    const deletePost = async () => {
      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', postId)
        .eq('user_token', userToken);

      if (error) {
        console.error('Erreur suppression post:', error.message);
        Alert.alert('Erreur', "Impossible de supprimer ce post.");
        return;
      }

      fetchPosts();
    };

    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Supprimer ce post ?');
      if (confirmed) deletePost();
    } else {
      Alert.alert(
        'Supprimer le post',
        'Tu veux vraiment supprimer ce post ?',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Supprimer', style: 'destructive', onPress: deletePost },
        ]
      );
    }
  };

  return (
    <View style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Communauté" onBack={() => router.back()} />

        <LinearGradient
          colors={['#48a4f4', '#10ac56']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.introCard}
        >
          <View style={styles.introIcon}>
            <Users color="#ffffff" size={32} />
          </View>
          <Text style={styles.introTitle}>Espace d’échange</Text>
          <Text style={styles.introText}>
            Publie un message, partage ton ressenti et échange avec les autres élèves.
          </Text>
        </LinearGradient>

        <View style={styles.createCard}>
          <Text style={styles.sectionTitle}>Nouveau post</Text>

          <TextInput
            style={styles.textArea}
            placeholder="Écris ton message..."
            placeholderTextColor="#94a3b8"
            multiline
            value={content}
            onChangeText={setContent}
          />

          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchTitle}>Publier anonymement</Text>
              <Text style={styles.switchSubtitle}>
                Ton nom ne sera pas affiché.
              </Text>
            </View>
            <Switch
              value={isAnonyme}
              onValueChange={setIsAnonyme}
              trackColor={{ false: '#cbd5e1', true: '#76c893' }}
              thumbColor={isAnonyme ? '#10ac56' : '#f4f4f5'}
            />
          </View>

          {!isAnonyme && (
            <TextInput
              style={styles.input}
              placeholder="Ton nom public"
              placeholderTextColor="#94a3b8"
              value={authorName}
              onChangeText={setAuthorName}
            />
          )}

          <GradientButton
            title={loading ? 'Publication...' : 'Publier'}
            icon={<Send color="white" size={20} />}
            colors={['#48a4f4', '#10ac56']}
            onPress={handleCreatePost}
            disabled={loading}
            height={64}
          />
        </View>

        <Text style={styles.postsTitle}>Publications récentes</Text>

        {posts.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Aucun post pour le moment.</Text>
          </View>
        ) : (
          posts.map((post) => {
            const score = votes[post.id] || 0;
            const isMine = userToken === post.user_token;
            const displayName = post.is_anonyme ? 'Anonyme' : post.author_name || 'Utilisateur';

            return (
              <View key={post.id} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <View>
                    <Text style={styles.author}>{displayName}</Text>
                    <Text style={styles.date}>{formatDateTime(post.created_at)}</Text>
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
                    <Text style={styles.commentText}>Commentaires</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
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
  introCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 22,
    alignItems: 'center',
    shadowColor: '#0077b6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  introIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  introTitle: {
    fontSize: 25,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  introText: {
    fontSize: 15,
    color: '#e0f2fe',
    textAlign: 'center',
    lineHeight: 22,
  },
  createCard: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 24,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#caf0f8',
    shadowColor: '#0077b6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#023e8a',
    marginBottom: 14,
  },
  textArea: {
    minHeight: 120,
    backgroundColor: '#f8fafc',
    borderRadius: 18,
    padding: 16,
    fontSize: 16,
    color: '#0f172a',
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#dbeafe',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 14,
    fontSize: 16,
    color: '#0f172a',
    borderWidth: 1,
    borderColor: '#dbeafe',
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  switchTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#023e8a',
  },
  switchSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 3,
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
});