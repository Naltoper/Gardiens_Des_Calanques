import { useCallback, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { supabase } from '../../lib/supabase';
import type {
  CommentRow,
  CommunityPost,
  VoteRow,
} from '../../types/community';
import {
  buildCommentCounts,
  buildMyVotes,
  buildVoteScores,
  sortPostsByScoreAndDate,
} from '../../utils/community';


export const useCommunityPosts = (userToken: string | null) => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [myVotes, setMyVotes] = useState<Record<string, number>>({});
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});

  const fetchPosts = useCallback(async () => {
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
      setCommentCounts({});
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

    setVotes(buildVoteScores(votesData as VoteRow[] | null));

    const { data: commentsData, error: commentsError } = await supabase
      .from('community_comments')
      .select('post_id')
      .in('post_id', postIds);

    if (commentsError) {
      console.error('Erreur chargement nombre commentaires:', commentsError.message);
    } else {
      setCommentCounts(buildCommentCounts(commentsData as CommentRow[] | null));
    }

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

      setMyVotes(buildMyVotes(myVotesData as VoteRow[] | null));
    }
  }, [userToken]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

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
        Alert.alert('Erreur', 'Impossible de supprimer ce post.');
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

  const sortedPosts = sortPostsByScoreAndDate(posts, votes);

  return {
    posts,
    sortedPosts,
    votes,
    myVotes,
    commentCounts,
    fetchPosts,
    handleVote,
    confirmDeletePost,
  };
};