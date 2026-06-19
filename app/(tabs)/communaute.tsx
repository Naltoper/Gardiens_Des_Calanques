import { useRouter } from 'expo-router';
import { ChevronDown, ChevronUp, ImagePlus, MessageCircle, Send, Trash2, X } from 'lucide-react-native';
import { useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { GradientButton } from '../../components/buttons/GradientButton';
import { CommunityIntroCard } from '../../components/Community/CommunityIntroCard';
import { ScreenHeader } from '../../components/headers/ScreenHeader';
import { useCommunityImage } from '../../hooks/community/useCommunityImage';
import { useCommunityPosts } from '../../hooks/community/useCommunityPosts';
import { useUserToken } from '../../hooks/useUserToken';
import { supabase } from '../../lib/supabase';
import {
  COMMUNITY_GRADIENT_COLORS,
  formatCommunityDateTime,
  getCommunityDisplayName,
  getStartOfTodayIso
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
  const {
    selectedImage,
    pickImage,
    removeSelectedImage,
    uploadPostImage,
  } = useCommunityImage();

  
  const [content, setContent] = useState('');
  const [isAnonyme, setIsAnonyme] = useState(true);
  const [authorName, setAuthorName] = useState('');
  const [loading, setLoading] = useState(false);


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

    const { count: todayPostsCount, error: countError } = await supabase
      .from('community_posts')
      .select('*', { count: 'exact', head: true })
      .eq('user_token', userToken)
      .gte('created_at', getStartOfTodayIso());

    if (countError) {
      console.error('Erreur vérification limite posts:', countError.message);
      Alert.alert('Erreur', 'Impossible de vérifier la limite de publication.');
      return;
    }

    if ((todayPostsCount || 0) >= 1) {
      Alert.alert(
        'Limite atteinte',
        'Tu peux publier seulement 1 post par jour dans la communauté.'
      );
      return;
    }

    setLoading(true);
  
    

    const imageUrl = await uploadPostImage();

    if (selectedImage && !imageUrl) {
      setLoading(false);
      return;
    }
    

    const { error } = await supabase.from('community_posts').insert({
      content: content.trim(),
      image_url: imageUrl,
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
    removeSelectedImage();
    setAuthorName('');
    setIsAnonyme(true);
    fetchPosts();
  };

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
          <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
            <ImagePlus color="#023e8a" size={22} />
            <Text style={styles.imagePickerText}>
              {selectedImage ? 'Changer la photo' : 'Ajouter une photo'}
            </Text>
          </TouchableOpacity>

          {selectedImage && (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: selectedImage.uri }} style={styles.imagePreview} />

              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={removeSelectedImage}
              >
                <X color="#ffffff" size={18} />
              </TouchableOpacity>
            </View>
          )}

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
            colors={COMMUNITY_GRADIENT_COLORS}
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
  screenBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  screenBackgroundImage: {
    opacity: 0.5, // Opacité ultra-légère (5%) pour préserver le contraste de tes cartes de discussion blanches
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#e0f2fe',
    borderRadius: 16,
    paddingVertical: 13,
    paddingHorizontal: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#caf0f8',
  },
  imagePickerText: {
    color: '#023e8a',
    fontSize: 15,
    fontWeight: '800',
  },
  imagePreviewContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  imagePreview: {
    width: '100%',
    height: 190,
    borderRadius: 18,
    backgroundColor: '#e2e8f0',
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(15,23,42,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
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