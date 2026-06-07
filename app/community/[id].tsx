import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, MessageCircle, Send, Trash2, UserRound } from 'lucide-react-native';
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
    ImageBackground
} from 'react-native';
import { GradientButton } from '../../components/buttons/GradientButton';
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

type CommunityComment = {
  id: string;
  created_at: string;
  post_id: string;
  content: string;
  is_anonyme: boolean;
  author_name: string | null;
  user_token: string;
};

export default function CommunityPostDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const userToken = useUserToken();

  const [post, setPost] = useState<CommunityPost | null>(null);
  const [comments, setComments] = useState<CommunityComment[]>([]);

  const [content, setContent] = useState('');
  const [isAnonyme, setIsAnonyme] = useState(true);
  const [authorName, setAuthorName] = useState('');
  const [loading, setLoading] = useState(false);

  const postId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    if (postId) {
      fetchPost();
      fetchComments();
    }
  }, [postId]);

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from('community_posts')
      .select('*')
      .eq('id', postId)
      .single();

    if (error) {
      console.error('Erreur chargement post:', error.message);
      Alert.alert('Erreur', 'Impossible de charger ce post.');
      return;
    }

    setPost(data);
  };

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('community_comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Erreur chargement commentaires:', error.message);
      return;
    }

    setComments(data || []);
  };

  const handleCreateComment = async () => {
    if (!userToken) {
      Alert.alert('Erreur', 'Token utilisateur introuvable. Réessayez dans quelques secondes.');
      return;
    }

    if (!content.trim()) {
      Alert.alert('Champ obligatoire', 'Écris un commentaire avant de publier.');
      return;
    }

    if (!isAnonyme && !authorName.trim()) {
      Alert.alert('Nom obligatoire', 'Entre un nom public ou active le mode anonyme.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.from('community_comments').insert({
      post_id: postId,
      content: content.trim(),
      is_anonyme: isAnonyme,
      author_name: isAnonyme ? null : authorName.trim(),
      user_token: userToken,
    });

    setLoading(false);

    if (error) {
      console.error('Erreur création commentaire:', error.message);
      Alert.alert('Erreur', 'Impossible de publier le commentaire.');
      return;
    }

    setContent('');
    setAuthorName('');
    setIsAnonyme(true);
    fetchComments();
  };

  const confirmDeleteComment = (commentId: string) => {
    const deleteComment = async () => {
      const { error } = await supabase
        .from('community_comments')
        .delete()
        .eq('id', commentId)
        .eq('user_token', userToken);

      if (error) {
        console.error('Erreur suppression commentaire:', error.message);
        Alert.alert('Erreur', 'Impossible de supprimer ce commentaire.');
        return;
      }

      fetchComments();
    };

    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Supprimer ce commentaire ?');
      if (confirmed) deleteComment();
    } else {
      Alert.alert(
        'Supprimer le commentaire',
        'Tu veux vraiment supprimer ce commentaire ?',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Supprimer', style: 'destructive', onPress: deleteComment },
        ]
      );
    }
  };

  if (!post) {
    return (
      <View style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </View>
    );
  }

  const displayName = post.is_anonyme ? 'Anonyme' : post.author_name || 'Utilisateur';

  return (
    <View style={styles.safeArea}>
      <ImageBackground
        source={require('../../assets/images/lyceeBgBlur.png')} // Reprise de l'image de fond marine
        style={styles.screenBackground}
        imageStyle={styles.screenBackgroundImage}
        resizeMode="cover"
      >
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/(tabs)/communaute')}>
          <ChevronLeft color="#023e8a" size={24} />
          <Text style={styles.backText}>Retour</Text>
        </TouchableOpacity>

        <LinearGradient
          colors={['#48a4f4', '#10ac56']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerCard}
        >
          <View style={styles.headerIcon}>
            <MessageCircle color="#ffffff" size={32} />
          </View>
          <Text style={styles.headerTitle}>Discussion</Text>
          <Text style={styles.headerSubtitle}>Lis le post et participe avec respect.</Text>
        </LinearGradient>

        <View style={styles.postCard}>
          <View style={styles.postHeader}>
            <View style={styles.authorIcon}>
              <UserRound color="#10ac56" size={22} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.author}>{displayName}</Text>
              <Text style={styles.date}>{formatDateTime(post.created_at)}</Text>
            </View>
          </View>

          <Text style={styles.postContent}>{post.content}</Text>
        </View>

        <View style={styles.createCard}>
          <Text style={styles.sectionTitle}>Ajouter un commentaire</Text>

          <TextInput
            style={styles.textArea}
            placeholder="Écris ton commentaire..."
            placeholderTextColor="#94a3b8"
            multiline
            value={content}
            onChangeText={setContent}
          />

          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchTitle}>Commenter anonymement</Text>
              <Text style={styles.switchSubtitle}>Ton nom ne sera pas affiché.</Text>
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
            title={loading ? 'Publication...' : 'Publier le commentaire'}
            icon={<Send color="white" size={20} />}
            colors={['#48a4f4', '#10ac56']}
            onPress={handleCreateComment}
            disabled={loading}
            height={64}
          />
        </View>

        <Text style={styles.commentsTitle}>
          Commentaires ({comments.length})
        </Text>

        {comments.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Aucun commentaire pour le moment.</Text>
          </View>
        ) : (
          comments.map((comment) => {
            const commentName = comment.is_anonyme
              ? 'Anonyme'
              : comment.author_name || 'Utilisateur';

            const isMine = userToken === comment.user_token;

            return (
              <View key={comment.id} style={styles.commentCard}>
                <View style={styles.commentHeader}>
                  <View>
                    <Text style={styles.commentAuthor}>{commentName}</Text>
                    <Text style={styles.commentDate}>
                      {formatDateTime(comment.created_at)}
                    </Text>
                  </View>

                  {isMine && (
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => confirmDeleteComment(comment.id)}
                    >
                      <Trash2 color="#ef4444" size={18} />
                    </TouchableOpacity>
                  )}
                </View>

                <Text style={styles.commentContent}>{comment.content}</Text>
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    color: '#023e8a',
    fontSize: 17,
    fontWeight: '700',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#caf0f8',
  },
  backText: {
    color: '#023e8a',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 4,
  },
  headerCard: {
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
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#e0f2fe',
    textAlign: 'center',
    lineHeight: 22,
  },
  postCard: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 24,
    padding: 18,
    marginBottom: 22,
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
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  authorIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  author: {
    fontSize: 17,
    fontWeight: '800',
    color: '#023e8a',
  },
  date: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 3,
  },
  postContent: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 24,
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
    minHeight: 110,
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
  commentsTitle: {
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
  commentCard: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#caf0f8',
    shadowColor: '#0077b6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 10,
  },
  commentAuthor: {
    fontSize: 15,
    fontWeight: '800',
    color: '#023e8a',
  },
  commentDate: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 3,
  },
  commentContent: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 22,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 14,
    backgroundColor: '#fee2e2',
    alignSelf: 'flex-start',
  },
  screenBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  screenBackgroundImage: {
    opacity: 0.5, // Opacité ultra-légère (5%) pour préserver le contraste de tes cartes de discussion blanches
  },
});