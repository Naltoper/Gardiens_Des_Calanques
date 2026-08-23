import { useState } from 'react';

import { supabase } from '../../lib/supabase';
import { encodeForumPost, getStartOfTodayIso } from '../../utils/community';
import { notify } from '../../utils/notify';
import { useCommunityImage } from './useCommunityImage';

export const useCreatePost = (userToken: string | null, onPostCreated: () => void) => {
  const {
    selectedImage,
    pickImage,
    removeSelectedImage,
    uploadPostImage,
  } = useCommunityImage();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAnonyme, setIsAnonyme] = useState(true);
  const [authorName, setAuthorName] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const resetForm = () => {
    setTitle('');
    setContent('');
    removeSelectedImage();
    setAuthorName('');
    setIsAnonyme(true);
    setFormError(null);
  };

  const handleCreatePost = async () => {
    setFormError(null);

    if (!userToken) {
      const message = 'Token utilisateur introuvable. Réessaie dans quelques secondes.';
      setFormError(message);
      notify('Erreur', message);
      return false;
    }

    if (!title.trim()) {
      const message = 'Ajoute un titre à ton sujet.';
      setFormError(message);
      notify('Titre obligatoire', message);
      return false;
    }

    if (!content.trim()) {
      const message = 'Écris le contenu du sujet avant de publier.';
      setFormError(message);
      notify('Champ obligatoire', message);
      return false;
    }

    if (!isAnonyme && !authorName.trim()) {
      const message = 'Entre un nom public ou active le mode anonyme.';
      setFormError(message);
      notify('Nom obligatoire', message);
      return false;
    }

    const { count: todayPostsCount, error: countError } = await supabase
      .from('community_posts')
      .select('*', { count: 'exact', head: true })
      .eq('user_token', userToken)
      .gte('created_at', getStartOfTodayIso());

    if (countError) {
      console.error('Erreur vérification limite posts:', countError.message);
      const message = 'Impossible de vérifier la limite de publication.';
      setFormError(message);
      notify('Erreur', message);
      return false;
    }

    if ((todayPostsCount || 0) >= 1) {
      const message = 'Tu peux publier seulement 1 post par jour dans la communauté.';
      setFormError(message);
      notify('Limite atteinte', message);
      return false;
    }

    setLoading(true);

    const imageUrl = await uploadPostImage();
    if (selectedImage && !imageUrl) {
      setLoading(false);
      const message = "L'image n'a pas pu être envoyée. Réessaie sans photo ou plus tard.";
      setFormError(message);
      notify('Erreur', message);
      return false;
    }

    const { error } = await supabase.from('community_posts').insert({
      content: encodeForumPost(title, content),
      image_url: imageUrl,
      is_anonyme: isAnonyme,
      author_name: isAnonyme ? null : authorName.trim(),
      user_token: userToken,
    });

    setLoading(false);

    if (error) {
      console.error('Erreur création post:', error.message);
      const message = "Impossible de publier le post.";
      setFormError(message);
      notify('Erreur', message);
      return false;
    }

    resetForm();
    onPostCreated();
    return true;
  };

  return {
    title,
    setTitle,
    content,
    setContent,
    isAnonyme,
    setIsAnonyme,
    authorName,
    setAuthorName,
    loading,
    formError,
    selectedImage,
    pickImage,
    removeSelectedImage,
    handleCreatePost,
    resetForm,
  };
};
