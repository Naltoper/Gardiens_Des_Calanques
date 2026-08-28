import { ScrollViewStyleReset } from 'expo-router/html';

const APP_DESCRIPTION =
  "Application de signalement et d'aide du Lycée des Calanques";
const THEME_COLOR = '#023E8A';

/**
 * Custom root HTML so the web viewport resizes with the on-screen keyboard
 * (`interactive-widget=resizes-content`) instead of panning the page and
 * sliding the header off-screen.
 */
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, interactive-widget=resizes-content"
        />
        <meta name="description" content={APP_DESCRIPTION} />
        <meta name="theme-color" content={THEME_COLOR} />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="GDC" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <ScrollViewStyleReset />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js',{scope:'/'}).catch(function(){});});}",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
