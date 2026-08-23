import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { notify } from '../../utils/notify';

type FetchPostsOptions = {
  /** Recalcule le tri par likes. False = met à jour les données sans bouger les cartes. */
  resort?: boolean;
};

export const useCommunityPosts = (userToken: string | null) => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [myVotes, setMyVotes] = useState<Record<string, number>>({});
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [orderedIds, setOrderedIds] = useState<string[]>([]);

  const fetchPosts = useCallback(async (options?: FetchPostsOptions) => {
    const resort = options?.resort !== false;

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
      setOrderedIds([]);
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

    const nextVotes = buildVoteScores(votesData as VoteRow[] | null);
    setVotes(nextVotes);

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

    if (resort) {
      setOrderedIds(sortPostsByScoreAndDate(safePosts, nextVotes).map((post) => post.id));
    } else {
      setOrderedIds((current) => {
        if (current.length === 0) {
          return sortPostsByScoreAndDate(safePosts, nextVotes).map((post) => post.id);
        }
        const known = new Set(current);
        const newcomers = safePosts
          .filter((post) => !known.has(post.id))
          .map((post) => post.id);
        const stillThere = current.filter((id) => postIds.includes(id));
        return [...newcomers, ...stillThere];
      });
    }
  }, [userToken]);

  useEffect(() => {
    fetchPosts({ resort: true });
  }, [fetchPosts]);

  const handleLike = async (postId: string) => {
    if (!userToken) {
      notify('Erreur', 'Token utilisateur introuvable.');
      return;
    }

    const liked = myVotes[postId] === 1;
    const previousMine = myVotes[postId];
    const previousScore = votes[postId] || 0;

    setMyVotes((current) => {
      const next = { ...current };
      if (liked) {
        delete next[postId];
      } else {
        next[postId] = 1;
      }
      return next;
    });
    setVotes((current) => ({
      ...current,
      [postId]: Math.max(0, (current[postId] || 0) + (liked ? -1 : 1)),
    }));

    const rollback = () => {
      setMyVotes((current) => {
        const next = { ...current };
        if (previousMine === 1) {
          next[postId] = 1;
        } else {
          delete next[postId];
        }
        return next;
      });
      setVotes((current) => ({
        ...current,
        [postId]: previousScore,
      }));
    };

    if (liked) {
      const { error } = await supabase
        .from('community_votes')
        .delete()
        .eq('post_id', postId)
        .eq('user_token', userToken);

      if (error) {
        console.error('Erreur suppression like:', error.message);
        rollback();
      }
      return;
    }

    const { error } = await supabase
      .from('community_votes')
      .upsert(
        {
          post_id: postId,
          user_token: userToken,
          vote_value: 1,
        },
        { onConflict: 'post_id,user_token' }
      );

    if (error) {
      console.error('Erreur like:', error.message);
      rollback();
    }
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

      fetchPosts({ resort: true });
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

  const sortedPosts = useMemo(() => {
    const byId = new Map(posts.map((post) => [post.id, post]));
    if (orderedIds.length === 0) {
      return sortPostsByScoreAndDate(posts, votes);
    }

    const known = new Set(orderedIds);
    const newcomers = posts.filter((post) => !known.has(post.id));
    const ordered = orderedIds
      .map((id) => byId.get(id))
      .filter((post): post is CommunityPost => Boolean(post));
    return [...newcomers, ...ordered];
  }, [posts, votes, orderedIds]);

  return {
    posts,
    sortedPosts,
    votes,
    myVotes,
    commentCounts,
    fetchPosts,
    handleLike,
    confirmDeletePost,
  };
};
