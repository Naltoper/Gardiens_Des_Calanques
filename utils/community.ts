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

export const getCommunityAuthorRole = (isAnonyme: boolean) => {
  return isAnonyme ? 'Anonyme' : 'Élève';
};

const TITLE_PREFIX = '[[';
const TITLE_SUFFIX = ']]';

export const encodeForumPost = (title: string, body: string) => {
  const safeTitle = title.replace(/[\[\]]/g, '').trim();
  return `${TITLE_PREFIX}${safeTitle}${TITLE_SUFFIX}\n${body.trim()}`;
};

export const getPostTitleAndBody = (content: string, titleColumn?: string | null) => {
  if (titleColumn?.trim()) {
    return { title: titleColumn.trim(), body: content.trim() };
  }

  const encoded = content.match(/^\[\[([^\]]+)\]\]\n?([\s\S]*)$/);
  if (encoded) {
    return { title: encoded[1].trim(), body: encoded[2].trim() };
  }

  const lines = content.trim().split(/\n/);
  const first = lines[0] || 'Sujet';
  const rest = lines.slice(1).join('\n').trim();
  return { title: first, body: rest };
};

export const getForumTopicTitle = (content: string, maxLength = 72) => {
  const { title } = getPostTitleAndBody(content);
  if (title.length <= maxLength) return title;
  return `${title.slice(0, maxLength).trimEnd()}…`;
};

export const getForumPreview = (content: string, maxLength = 140) => {
  const { body, title } = getPostTitleAndBody(content);
  const text = (body || title).replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
};

export const getStartOfTodayIso = () => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  return startOfToday.toISOString();
};

export const buildVoteScores = (votesData: VoteRow[] | null) => {
  const scores: Record<string, number> = {};

  votesData?.forEach((vote) => {
    if (vote.vote_value !== 1) return;
    scores[vote.post_id] = (scores[vote.post_id] || 0) + 1;
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