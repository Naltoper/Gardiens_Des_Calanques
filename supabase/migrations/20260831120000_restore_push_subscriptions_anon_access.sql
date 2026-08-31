-- Restauration des policies permissives pour l'architecture PR #38
-- (api/push-subscribe.js + api/notify-chat.js via clé anon).
--
-- Annule le lockdown `20260830000000` si il a été appliqué : le client et
-- les fonctions Vercel écrivent/lisent `push_subscriptions` avec la clé
-- anon (comme dans le système stable d'origine).

create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_token text not null,
  report_id uuid null,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists push_subscriptions_user_token_idx
  on public.push_subscriptions (user_token);

create index if not exists push_subscriptions_report_id_idx
  on public.push_subscriptions (report_id);

alter table public.push_subscriptions enable row level security;

drop policy if exists "push_subscriptions_anon_all" on public.push_subscriptions;
drop policy if exists "push_subscriptions_client_upsert" on public.push_subscriptions;
drop policy if exists "push_subscriptions_client_update" on public.push_subscriptions;
drop policy if exists "push_subscriptions_client_select" on public.push_subscriptions;
drop policy if exists "push_subscriptions_client_delete" on public.push_subscriptions;

create policy "push_subscriptions_anon_all"
  on public.push_subscriptions
  for all
  to anon, authenticated
  using (true)
  with check (true);

grant select, insert, update, delete on table public.push_subscriptions
  to anon, authenticated, service_role;
