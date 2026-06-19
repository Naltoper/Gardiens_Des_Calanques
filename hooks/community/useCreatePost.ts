import { useState } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../../lib/supabase';
import { getStartOfTodayIso } from '../../utils/community';
import { useCommunityImage } from './useCommunityImage';

export const useCreatePost = (userToken: string | null, onPostCreated: () => void) => {
  const {
    selectedImage,
    pickImage,
    removeSelectedImage,
    uploadPostImage,
  } = useCommunityImage();

  // États locaux du formulaire
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

    // Règle métier : Vérification de la limite journalière (1 post max)
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

    // Upload de l'image si présente
    const imageUrl = await uploadPostImage();
    if (selectedImage && !imageUrl) {
      setLoading(false);
      return;
    }

    // Insertion du post dans la table Supabase
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

    // Réinitialisation complète après succès
    setContent('');
    removeSelectedImage();
    setAuthorName('');
    setIsAnonyme(true);
    
    // Callback pour rafraîchir la liste principale
    onPostCreated();
  };

  return {
    content,
    setContent,
    isAnonyme,
    setIsAnonyme,
    authorName,
    setAuthorName,
    loading,
    selectedImage,
    pickImage,
    removeSelectedImage,
    handleCreatePost,
  };
};