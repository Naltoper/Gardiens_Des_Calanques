import { ScrollViewStyleReset } from 'expo-router/html';

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
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
