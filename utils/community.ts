import type {
    CommentRow,
    CommunityPost,
    VoteRow,
} from '../types/community';

export const COMMUNITY_IMAGE_BUCKET = 'cummunity-images';

export const MAX_COMMUNITY_IMAGE_SIZE = 2 * 1024 * 1024; // 2 Mo

export const COMMUNITY_GRADIENT_COLORS = ['#48a4f4', '#10ac56'] as const;

export const formatCommunityDateTime = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getCommunityDisplayName = (
  isAnonyme: boolean,
  authorName: string | null
) => {
  return isAnonyme ? 'Anonyme' : authorName || 'Utilisateur';
};

export const getStartOfTodayIso = () => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  return startOfToday.toISOString();
};

export const buildVoteScores = (votesData: VoteRow[] | null) => {
  const scores: Record<string, number> = {};

  votesData?.forEach((vote) => {
    scores[vote.post_id] = (scores[vote.post_id] || 0) + vote.vote_value;
  });

  return scores;
};

export const buildCommentCounts = (commentsData: CommentRow[] | null) => {
  const counts: Record<string, number> = {};

  commentsData?.forEach((comment) => {
    counts[comment.post_id] = (counts[comment.post_id] || 0) + 1;
  });

  return counts;
};

export const buildMyVotes = (votesData: VoteRow[] | null) => {
  const userVotes: Record<string, number> = {};

  votesData?.forEach((vote) => {
    userVotes[vote.post_id] = vote.vote_value;
  });

  return userVotes;
};

export const sortPostsByScoreAndDate = (
  posts: CommunityPost[],
  votes: Record<string, number>
) => {
  return [...posts].sort((a, b) => {
    const scoreA = votes[a.id] || 0;
    const scoreB = votes[b.id] || 0;

    if (scoreA !== scoreB) {
      return scoreB - scoreA;
    }

    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
};