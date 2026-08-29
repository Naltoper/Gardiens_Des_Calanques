# Notifications Push — PWA + Android TWA

Cette page documente la **nouvelle** architecture de notifications (reset
complet du 2026-08-29). Elle remplace intégralement l'ancien système
(`api/push-subscribe.js`, `api/notify-chat.js`, `hooks/useWebPush.tsx`,
`utils/notifyIncomingChat.ts`) qui a été supprimé.

## Vue d'ensemble

```
Navigateur / TWA élève                         Vercel                          Supabase
────────────────────────                       ──────                         ────────
usePushNotifications.ts
  → Notification.requestPermission()
  → registration.pushManager.subscribe(VAPID)
  → supabase.from('push_subscriptions').upsert()  ───────────────────────────►  push_subscriptions (RLS: anon = insert/update only)

public/sw.js (service worker)
  ← push event                                  ◄── api/send-notification.js ◄── Database Webhook sur `messages` (INSERT)
  → self.registration.showNotification()             (web-push + VAPID,           ou appel direct utils/notifyChat.ts
  → notificationclick → focus/ouvre /chat/:id         service role key)
```

Points clés du nouveau design :

- **Un seul chemin d'affichage** : toute notification passe par
  `public/sw.js` → `showNotification()`. On n'appelle plus jamais
  `new Notification()` depuis une page (c'était une source de doublons /
  d'effet "spam").
- **Un seul endpoint d'envoi** : `api/send-notification.js`. Il n'y a plus
  ni `push-subscribe`, ni `notify-chat`.
- **La clé service role Supabase ne sert que côté serveur.** Le client ne
  peut plus lire ni supprimer la table `push_subscriptions` (voir RLS
  ci-dessous) — avant, n'importe qui avec la clé anon pouvait lister tous
  les abonnements Push de tous les élèves.

## Fichiers

| Fichier | Rôle |
|---|---|
| `public/sw.js` | Service worker : reçoit le `push`, affiche la notification (icône/badge/tag app), gère le clic. |
| `hooks/usePushNotifications.ts` | Hook + provider React : permission, souscription VAPID, upsert Supabase. Isolé sous `Platform.OS === 'web'`. |
| `constants/pushNotifications.ts` | Clé VAPID publique, nom de table, clés de storage. |
| `utils/vapidKey.ts` | Décodage base64 → `Uint8Array` de la clé VAPID. |
| `components/banners/PushPermissionBanner.tsx` | Bandeau "Activer les notifications" sur l'accueil. |
| `utils/notifyChat.ts` | Roue de secours : prévient `/api/send-notification` côté client après l'insertion d'un message. |
| `api/send-notification.js` | Fonction Vercel qui envoie le Web Push (VAPID) via `web-push`. |
| `server/pushSubscriptions.js` | Accès Supabase **service role** (lecture/suppression des abonnements). |
| `supabase/migrations/20260829170000_push_subscriptions_reset.sql` | Schéma + RLS de `push_subscriptions`. |

## Variables d'environnement (Vercel)

| Variable | Où | Description |
|---|---|---|
| `EXPO_PUBLIC_VAPID_KEY` | Build (client + serveur) | Clé VAPID **publique**. Doit être définie avant le build web (`expo export`) car elle est inlinée dans le bundle par Expo. |
| `VAPID_PUBLIC_KEY` | Vercel (fonctions) | Même clé publique, utilisée par `api/send-notification.js`. |
| `VAPID_PRIVATE_KEY` | Vercel (fonctions) | Clé VAPID **privée**. Ne jamais l'exposer côté client. |
| `VAPID_SUBJECT` | Vercel (fonctions) | `mailto:` ou URL de contact exigé par la spec Web Push. |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel (fonctions) | **Nouvelle variable requise.** Clé service role du projet Supabase — permet à `api/send-notification.js` de lire/supprimer `push_subscriptions` malgré la RLS restrictive. |
| `PUSH_WEBHOOK_SECRET` | Vercel (fonctions), optionnel | Si défini, `api/send-notification.js` exige l'en-tête `x-webhook-secret` (ou `Authorization: Bearer ...`) avec cette valeur. |

Génère une paire de clés VAPID avec :

```bash
npx web-push generate-vapid-keys
```

## Ce que tu dois faire manuellement

### 1. Supabase — SQL

Le fichier `supabase/migrations/20260829170000_push_subscriptions_reset.sql`
contient tout le SQL nécessaire. Colle-le dans **SQL Editor → New query** du
projet Supabase, puis **Run** :

- Il (re)crée `public.push_subscriptions` si elle n'existe pas encore.
- Il **remplace** les anciennes policies permissives (`for all using(true)`,
  qui autorisaient n'importe qui à lire/supprimer les abonnements de tout
  le monde) par :
  - `anon` / `authenticated` : `INSERT` et `UPDATE` uniquement (upsert par
    élève, nécessaire pour que le hook écrive son propre abonnement).
  - `service_role` uniquement : `SELECT` et `DELETE` (utilisé par
    `api/send-notification.js`).

Vérifie ensuite dans **Table Editor** que la table a les colonnes
`user_token`, `endpoint`, `p256dh`, `auth`.

### 2. Supabase — Database Webhook sur `messages`

C'est ce qui déclenche le push même quand l'app est **complètement fermée**.

1. Dashboard Supabase → **Database** → **Webhooks** → **Create a new webhook**.
2. Renseigne :

   | Champ | Valeur |
   |---|---|
   | Name | `notify-eleve-chat` |
   | Table | `public.messages` |
   | Events | **Insert** uniquement |
   | Type | HTTP Request |
   | Method | `POST` |
   | URL | `https://gdc-eleves.vercel.app/api/send-notification` |
   | HTTP Headers | `Content-Type: application/json` (+ `x-webhook-secret` si `PUSH_WEBHOOK_SECRET` est défini) |

3. Save.

`api/send-notification.js` ignore automatiquement les messages
`sender_role = "user"` (l'élève n'a pas besoin d'être notifié de son propre
message) et notifie pour tout le reste (`admin`, vide, etc.).

### 3. Vercel — variables d'environnement

Ajoute dans **Project Settings → Environment Variables** :

- `SUPABASE_SERVICE_ROLE_KEY` (Settings → API du projet Supabase — **Service
  role secret**, jamais la clé `anon`).
- Vérifie que `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` et
  `EXPO_PUBLIC_VAPID_KEY` sont bien présentes (elles existaient déjà pour
  l'ancien système, elles sont réutilisées telles quelles).

### 4. Bubblewrap / TWA — éviter le badge « via Chrome »

**Il n'y a pas besoin de Firebase / FCM.** La "Notification Delegation" de
Trusted Web Activity ne dépend d'aucun projet Firebase : Chrome relaie
directement les appels `Notification` / `showNotification()` à l'app
Android installée, à condition que le Digital Asset Link soit vérifié.
`twa-manifest.json` a déjà `"enableNotifications": true` (c'est le seul
champ Bubblewrap qui active la délégation) et le projet Android généré
contient déjà `DelegationService` + `NotificationPermissionRequestActivity`
— vérifié dans ce dépôt (`twa/app/src/main/AndroidManifest.xml`).

Si les notifications s'affichent quand même avec le logo/nom **Chrome**
plutôt que celui de l'app, vérifie dans l'ordre :

1. **Tu testes le bon binaire.** La délégation ne fonctionne QUE dans l'app
   Android installée depuis l'APK/AAB signé par Bubblewrap — jamais dans un
   onglet Chrome, ni dans un PWA "Ajouter à l'écran d'accueil" classique.
2. **Le fingerprint SHA-256 dans `public/.well-known/assetlinks.json`
   correspond exactement à la clé qui a signé l'APK réellement installé.**
   - Si tu distribues via un store qui re-signe l'app (Play App Signing),
     c'est le certificat **App signing** (Play Console → Configuration de
     l'app → Intégrité de l'app), pas le certificat **Upload**, qui doit
     apparaître dans `assetlinks.json`.
   - Pour une installation directe de l'APK signé par la clé
     `android-packages/gdc-release.keystore`, le fingerprint doit
     correspondre à celui de `twa-manifest.json → fingerprints[0].value`
     (déjà aligné dans ce repo).
   - Vérifie avec :
     ```bash
     keytool -list -v -keystore android-packages/gdc-release.keystore -alias android
     ```
3. **Rebuild après toute modif de `twa-manifest.json`** :
   ```bash
   npx @bubblewrap/cli update
   npx @bubblewrap/cli build
   ```
4. **Chrome doit être à jour** sur l'appareil de test (délégation dispo
   depuis Chrome ~96+). Un vieux Chrome System WebView tombe en repli sur
   les notifications "web" classiques.
5. **`public/notif-icon.png` doit être une silhouette blanche sur fond
   transparent.** Android ignore la couleur de l'icône de la barre de statut
   (`android.support.customtabs.trusted.SMALL_ICON`) et ne garde que le
   canal alpha — une icône pleine couleur s'affiche comme un carré blanc
   générique, ce qui donne une impression "générique/spam" même quand la
   délégation fonctionne. `public/icons/icon-512.png` (icône couleur, pour
   le grand aperçu) peut lui rester coloré.
6. Après toute modification d'icône, incrémente `appVersionCode` /
   `appVersionName` dans `twa-manifest.json` puis relance `update` + `build`
   (Android met en cache les ressources de notification par version).

### 5. Vérification de bout en bout

```bash
curl -s https://gdc-eleves.vercel.app/api/send-notification
```

Doit renvoyer `"configured": true` et `"store": { "ok": true }`. Si
`store.ok` est `false`, `SUPABASE_SERVICE_ROLE_KEY` est absente ou invalide.

1. Élève : ouvre l'app installée (TWA), connecte-toi, tape **Activer** sur
   le bandeau de notifications.
2. Vérifie dans Supabase **Table Editor → push_subscriptions** qu'une ligne
   est apparue avec le bon `user_token`.
3. Ferme complètement l'app Android (pas juste en arrière-plan).
4. Un intervenant répond sur ce signalement (`sender_role != 'user'`).
5. Le webhook doit apparaître dans **Database → Webhooks → Logs**.
6. La notification doit s'afficher avec l'icône et le nom de l'app (pas
   Chrome). Un tap ouvre `/chat/<id>`.

### Dépannage rapide

| Symptôme | Cause probable |
|---|---|
| `GET /api/send-notification` → `configured: false` | `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` absentes sur Vercel. |
| `store.ok: false` | `SUPABASE_SERVICE_ROLE_KEY` absente/invalide. |
| Réponse `{ skipped: "no_subscriptions" }` | L'élève n'a jamais accepté les notifications sur cet appareil, ou son abonnement a expiré. |
| Réponse `{ sent: 0, failed: 1 }` | Abonnement périmé (410/404) — il est supprimé automatiquement, l'élève doit rouvrir l'app pour se réabonner. |
| Notification affichée mais logo/nom **Chrome** | Voir section Bubblewrap ci-dessus (asset link / bon binaire testé). |
| Rien ne s'affiche du tout | Vérifie que le Database Webhook Supabase est bien actif et pointe vers `/api/send-notification`. |

## Ce que tu n'as pas à faire

- Pas besoin de créer un projet Firebase / FCM : la délégation TWA n'en
  dépend pas.
- Pas besoin de coller la clé VAPID **privée** ni la **service role key**
  dans le code ou dans Supabase — elles ne vivent que dans les variables
  d'environnement Vercel.
- Pas besoin de recréer `eleve_push_subscriptions` (ancien nom, jamais
  utilisé en prod).
