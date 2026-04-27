export interface Report {
  id: string; // uuid
  created_at: string; // timestamp with time zone
  content: string | null;
  is_anonyme: boolean | null;
  author_name: string | null;
  status: string; // default 'Non traité'
  user_token: string | null;
  type_harcelement: string | null;
  urgence: string | null;
  date_faits: string | null;
  lieu: string | null;
  frequence: string | null;
  nb_victimes: string | null;
}