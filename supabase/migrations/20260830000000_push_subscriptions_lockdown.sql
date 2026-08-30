-- Verrouillage complet de `push_subscriptions` côté client.
--
-- Contexte : l'upsert direct depuis le client (clé `anon`) reposait sur une
-- policy RLS `INSERT`/`UPDATE` + un GRANT `insert, update` (voir la
-- migration `20260829170000_push_subscriptions_reset.sql`). En pratique,
-- cette combinaison est fragile : si la table est recréée manuellement
-- (Table Editor, restauration, etc.) sans rejouer le GRANT, le client reçoit
-- `42501 permission denied for table push_subscriptions` (erreur au niveau
-- des privilèges GRANT, avant même l'évaluation de la policy RLS).
--
-- Le nouveau code (`hooks/usePushNotifications.ts`) n'écrit plus JAMAIS
-- directement dans cette table : il passe par
-- `api/register-push-subscription.js`, qui utilise la **service role key**
-- (qui contourne RLS et n'a pas besoin de GRANT explicite). Cette migration
-- retire donc tous les droits `anon` / `authenticated` sur la table : plus
-- aucune policy à maintenir côté client, plus aucun risque de régression
-- 42501.
--
-- Sûr à rejouer plusieurs fois (idempotent).

drop policy if exists "push_subscriptions_anon_all" on public.push_subscriptions;
drop policy if exists "push_subscriptions_client_upsert" on public.push_subscriptions;
drop policy if exists "push_subscriptions_client_update" on public.push_subscriptions;
drop policy if exists "push_subscriptions_client_select" on public.push_subscriptions;
drop policy if exists "push_subscriptions_client_delete" on public.push_subscriptions;

alter table public.push_subscriptions enable row level security;

-- Plus aucune policy pour anon / authenticated : RLS refuse tout par défaut.
revoke all on table public.push_subscriptions from anon, authenticated;

-- La service role key contourne RLS (rôle Postgres avec `bypassrls`), mais
-- on garde les GRANT explicites pour que ce soit lisible sans ambiguïté.
grant select, insert, update, delete on table public.push_subscriptions to service_role;
