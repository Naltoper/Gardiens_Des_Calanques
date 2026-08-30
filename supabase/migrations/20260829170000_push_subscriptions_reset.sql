-- Reset complet des notifications Push (PWA + Android TWA).
--
-- IMPORTANT — les policies `push_subscriptions_client_upsert` /
-- `push_subscriptions_client_update` créées plus bas dans ce fichier sont
-- SUPERSEDÉES par la migration suivante
-- (`20260830000000_push_subscriptions_lockdown.sql`), qui retire tous les
-- droits `anon`/`authenticated` sur la table. Le client ne fait plus jamais
-- d'upsert Supabase direct (voir `hooks/usePushNotifications.ts` +
-- `api/register-push-subscription.js`) : il n'y a donc plus besoin de
-- maintenir de policy RLS ni de GRANT `insert`/`update` pour `anon`. Ce
-- fichier reste utile pour la CRÉATION de la table (`create table if not
-- exists`) sur une base qui ne l'aurait pas encore.
--
-- Sûr à rejouer plusieurs fois (idempotent).

create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_token text not null,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists push_subscriptions_user_token_idx
  on public.push_subscriptions (user_token);

alter table public.push_subscriptions enable row level security;

-- On repart de zéro sur les policies : on retire tout ce qui existait avant.
drop policy if exists "push_subscriptions_anon_all" on public.push_subscriptions;
drop policy if exists "push_subscriptions_client_upsert" on public.push_subscriptions;
drop policy if exists "push_subscriptions_client_update" on public.push_subscriptions;
drop policy if exists "push_subscriptions_client_select" on public.push_subscriptions;
drop policy if exists "push_subscriptions_client_delete" on public.push_subscriptions;

create policy "push_subscriptions_client_upsert"
  on public.push_subscriptions
  for insert
  to anon, authenticated
  with check (true);

create policy "push_subscriptions_client_update"
  on public.push_subscriptions
  for update
  to anon, authenticated
  using (true)
  with check (true);

-- Pas de policy SELECT / DELETE pour anon/authenticated : par défaut, RLS
-- refuse tout ce qui n'a pas de policy. Seule la service role key (utilisée
-- côté serveur, jamais côté client) peut lire ou supprimer des lignes.

revoke all on table public.push_subscriptions from anon, authenticated;
grant insert, update on table public.push_subscriptions to anon, authenticated;
grant select, insert, update, delete on table public.push_subscriptions to service_role;
