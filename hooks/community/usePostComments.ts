import { useCallback, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';

import { supabase } from '../../lib/supabase';
import type { CommunityComment } from '../../types/community';
import { getStartOfTodayIso } from '../../utils/community';
import { notify } from '../../utils/notify';

export function usePostComments(postId: string | null, userToken: string | null) {
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [content, setContent] = useState('');
  const [isAnonyme, setIsAnonyme] = useState(true);
  const [authorName, setAuthorName] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchComments = useCallback(async () => {
    if (!postId) {
      setComments([]);
      return;
    }

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
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleCreateComment = async () => {
    if (!postId) return false;

    if (!userToken) {
      notify('Erreur', 'Token utilisateur introuvable. Réessayez dans quelques secondes.');
      return false;
    }

    if (!content.trim()) {
      notify('Champ obligatoire', 'Écris un commentaire avant de publier.');
      return false;
    }

    if (!isAnonyme && !authorName.trim()) {
      notify('Nom obligatoire', 'Entre un nom public ou active le mode anonyme.');
      return false;
    }

    const { count: todayCommentsCount, error: countError } = await supabase
      .from('community_comments')
      .select('*', { count: 'exact', head: true })
      .eq('user_token', userToken)
      .gte('created_at', getStartOfTodayIso());

    if (countError) {
      console.error('Erreur vérification limite commentaires:', countError.message);
      notify('Erreur', 'Impossible de vérifier la limite de commentaires.');
      return false;
    }

    if ((todayCommentsCount || 0) >= 4) {
      notify(
        'Limite atteinte',
        'Tu peux publier seulement 4 commentaires par jour dans la communauté.',
      );
      return false;
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
      notify('Erreur', 'Impossible de publier le commentaire.');
      return false;
    }

    setContent('');
    setAuthorName('');
    setIsAnonyme(true);
    await fetchComments();
    return true;
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
        ],
      );
    }
  };

  return {
    comments,
    content,
    setContent,
    isAnonyme,
    setIsAnonyme,
    authorName,
    setAuthorName,
    loading,
    fetchComments,
    handleCreateComment,
    confirmDeleteComment,
  };
}
