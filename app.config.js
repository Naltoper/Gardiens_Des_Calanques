const appJson = require('./app.json');

/**
 * Expo Router static/SSR web rendering fails to resolve `react` when the project
 * path contains spaces (URL-encoded paths break require-from-string in @expo/cli).
 * @see https://github.com/expo/expo/issues/34468
 */
const projectRoot = __dirname;
const hasSpaceInPath = projectRoot.includes(' ');

const webOutput =
  process.env.EXPO_WEB_OUTPUT ??
  (hasSpaceInPath ? 'single' : appJson.expo.web?.output ?? 'static');

if (hasSpaceInPath && webOutput === 'static') {
  console.warn(
    '[app.config.js] Chemin avec espace détecté — mode web "single" activé pour éviter l\'erreur SSR "Cannot find module react".',
    '\n  Chemin:', projectRoot,
    '\n  Renommez le dossier parent (ex: GDC-projet) pour utiliser "static" en local.',
  );
}

/** @type {import('expo/config').ExpoConfig} */
module.exports = {
  expo: {
    ...appJson.expo,
    web: {
      ...appJson.expo.web,
      bundler: 'metro',
      output: webOutput,
    },
  },
};
