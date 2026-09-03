# Notifications push — configuration manuelle Supabase

Cette page décrit **uniquement** ce que tu dois faire dans le dashboard Supabase.
Le code (`/api/push-subscribe`, `/api/notify-chat`, `public/sw.js`) est déjà déployé
sur `https://gdc-eleves.vercel.app`.

Sans les deux étapes ci-dessous, une notification **ne part pas** quand l’app
Android est fermée : personne n’appelle l’API (l’app intervenants n’envoie pas
le push, et le Realtime élève est mort si l’app est tuée).

## Pourquoi ces deux étapes

| Élément | Rôle |
|---|---|
| Table `push_subscriptions` | Stocke l’abonnement Web Push de chaque élève, lié à son `user_token` (le même que sur `reports`). |
| Webhook `messages` INSERT | Dès qu’un intervenant insère une ligne dans `messages`, Supabase POST vers `/api/notify-chat`, qui retrouve le `user_token` du signalement et envoie la notification FCM. |

Vérification rapide après coup :

```bash
curl -s https://gdc-eleves.vercel.app/api/notify-chat
```

Tu dois voir `"configured": true`. Après création de la table, `"store": { "mode": "table", "table": "push_subscriptions" }`.
Tant que la table n’existe pas, le mode reste `"storage"` (filet de secours, plus fragile).

---

## Étape 1 — Créer la table `push_subscriptions`

1. Ouvre le projet Supabase **Gardiens des Calanques**  
   (`https://lgsspvcxayanodmvgkzb.supabase.co` → dashboard).
2. Menu gauche **SQL Editor** → **New query**.
3. Colle **tout** le SQL ci-dessous, puis **Run**.

```sql
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
create policy "push_subscriptions_anon_all"
  on public.push_subscriptions
  for all
  to anon, authenticated
  using (true)
  with check (true);

grant select, insert, update, delete on table public.push_subscriptions
  to anon, authenticated, service_role;
```

4. Contrôle : menu **Table Editor** → tu dois voir `push_subscriptions`
   avec les colonnes `user_token`, `endpoint`, `p256dh`, `auth`.
5. Recharge `https://gdc-eleves.vercel.app/api/notify-chat` : `store.mode` doit passer à `"table"`.

Tu n’as **pas** besoin de créer `eleve_push_subscriptions` (ancien nom).

---

## Étape 2 — Webhook Database sur `messages`

C’est l’étape qui déclenche le push **même si l’APK est fermée**.

1. Dashboard Supabase → **Database** → **Webhooks**  
   (parfois sous **Integrations** → **Database Webhooks**).
2. **Create a new webhook** (ou **Enable Webhooks** si c’est la première fois).
3. Remplis **exactement** :

| Champ | Valeur |
|---|---|
| Name | `notify-eleve-chat` |
| Table | `public` / `messages` |
| Events | **Insert** uniquement (décoche Update et Delete) |
| Type | HTTP Request |
| Method | `POST` |
| URL | `https://gdc-eleves.vercel.app/api/notify-chat` |
| HTTP Headers | `Content-Type` = `application/json` |
| Timeout | `5000` (défaut) |
| HTTP Params / Body | laisser le payload par défaut (Supabase envoie `{ type, table, schema, record, old_record }`) |

4. **Ne pas** ajouter de header `Authorization` ni `x-webhook-secret`
   tant que la variable Vercel `PUSH_WEBHOOK_SECRET` n’est **pas** définie
   (elle ne l’est pas aujourd’hui). Si tu ajoutes un secret côté webhook
   sans le mettre aussi sur Vercel, tous les appels seront rejetés en 401.
5. Save / Confirm.

Le `record` envoyé doit contenir au minimum :

- `report_id` (uuid du signalement)
- `sender_role` (`admin` pour un intervenant, `user` pour un élève)

`/api/notify-chat` ignore les messages `sender_role = user` et notifie pour tout le reste (`admin`, vide, etc.).

### Si tu ne vois pas le menu Webhooks

Tu peux coller ceci dans le SQL Editor (extension `pg_net` déjà active sur les projets hébergés) :

```sql
create or replace function public.notify_eleve_chat_push()
returns trigger
language plpgsql
security definer
as $$
begin
  if new.sender_role is distinct from 'user' then
    perform net.http_post(
      url := 'https://gdc-eleves.vercel.app/api/notify-chat',
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body := jsonb_build_object(
        'type', TG_OP,
        'table', TG_TABLE_NAME,
        'schema', TG_TABLE_SCHEMA,
        'record', to_jsonb(new),
        'old_record', null
      )
    );
  end if;
  return new;
end;
$$;

drop trigger if exists on_messages_notify_eleve_chat on public.messages;
create trigger on_messages_notify_eleve_chat
  after insert on public.messages
  for each row
  execute function public.notify_eleve_chat_push();
```

Si `net.http_post` est refusé, active l’extension : **Database** → **Extensions** → `pg_net`.

---

## Étape 3 — Côté téléphone (une fois par appareil)

1. Ouvre l’app élève (PWA ou APK) **connectée** (QR / identifiant).
2. Accorde la permission **Notifications** Android (Android 13+ : Paramètres → Apps → GDC).
3. Sur l’accueil, tape **Activer** sur le bandeau bleu « Notifications de chat ».
4. Table Editor → `push_subscriptions` : une ligne doit apparaître avec le `user_token` de l’élève.

Sans cette ligne, `/api/notify-chat` répond `{ skipped: "no_subscriptions" }`.

---

## Test de bout en bout

1. L’élève a une ligne dans `push_subscriptions`.
2. Ferme complètement l’app Android (pas seulement mise en arrière-plan).
3. Un intervenant envoie un message sur ce signalement.
4. Le webhook doit créer une requête visible dans **Database → Webhooks → Logs**
   (ou **Logs → Database** / **pg_net**).
5. Le téléphone affiche « Nouveau message ». Un tap ouvre `/chat/{id}`.

Si rien ne s’affiche :

- `GET /api/notify-chat` → `configured: false` : la clé Vercel `VAPID_PRIVATE_KEY` a disparu.
- Webhook log 400 `missing_report_id` : le payload n’envoie pas `record.report_id`.
- Réponse `{ skipped: "user_message" }` : le message a été inséré en `sender_role = user`.
- Réponse `{ skipped: "no_user_token" }` : le `reports.id` du message n’a pas de `user_token`.
- Réponse `{ skipped: "no_subscriptions" }` : l’élève n’a pas ré-activé les notifs après création de la table (ou token différent).
- Réponse `{ sent: 0, failed: 1 }` : abonnement FCM périmé → l’élève doit rouvrir l’app (resync auto si la permission est déjà accordée).

---

## Filet de sécurité (app intervenants)

Le webhook ci-dessus suffit. En complément, l’app **GDC-intervenants** peut
appeler la même API après un insert réussi (même si `.select()` ne renvoie
aucune ligne) :

```ts
void fetch('https://gdc-eleves.vercel.app/api/notify-chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    record: { report_id: reportId, sender_role: 'admin' },
  }),
});
```

Aujourd’hui `hooks/useChatMessages.ts` côté intervenants n’envoie **pas** cet
appel : d’où l’obligation du webhook pour les notifications app fermée.

---

## Ce que tu n’as pas à faire

- Ne pas coller de clé VAPID privée dans Supabase.
- Ne pas créer de secret webhook tant que Vercel n’a pas `PUSH_WEBHOOK_SECRET`.
- Ne pas recréer `eleve_push_subscriptions`.
- Le service worker `https://gdc-eleves.vercel.app/sw.js` écoute déjà `push` et appelle `showNotification`.
