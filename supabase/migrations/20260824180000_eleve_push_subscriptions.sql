-- Push subscriptions for GDC élèves (Web / PWA).
-- Apply in the Supabase SQL editor if the table is not already present.
-- Also configure a Database Webhook on public.messages INSERT →
-- POST https://gdc-eleves.vercel.app/api/notify-chat
-- Header: x-webhook-secret = PUSH_WEBHOOK_SECRET

create table if not exists public.eleve_push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_token text not null,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists eleve_push_subscriptions_user_token_idx
  on public.eleve_push_subscriptions (user_token);

alter table public.eleve_push_subscriptions enable row level security;

drop policy if exists "eleve_push_subscriptions_anon_all" on public.eleve_push_subscriptions;
create policy "eleve_push_subscriptions_anon_all"
  on public.eleve_push_subscriptions
  for all
  to anon, authenticated
  using (true)
  with check (true);

-- Optional Database Webhook (run in the SQL editor after deploy):
-- create trigger on_eleve_chat_push
-- after insert on public.messages
-- for each row
-- execute function supabase_functions.http_request(
--   'https://gdc-eleves.vercel.app/api/notify-chat',
--   'POST',
--   '{"Content-Type":"application/json"}',
--   '{}',
--   '5000'
-- );

