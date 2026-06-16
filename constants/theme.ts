/**
 * Below are the colors that are used in the app.
 * The colors are defined in the light and dark mode.
 */

import { Platform } from "react-native";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

/**
 * Couleurs utilisées par le thème Expo par défaut
 * Exemple : tabs, icônes, texte système, etc.
 */
export const Colors = {
  light: {
    text: "#11181C",
    background: "#f8FAFC",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    primaryLight: "#48A4F4",
    //palette "calanques"
    primary: "#023E8A",
    secondary: "#00B4D8",
    surface: "#fff",
    border: "#E2E8F0",
    borderSubtle: "#F1F5F9",
    textMuted: "#64748B",
    status: {
      error: "#EF4444",
      errorBg: "#FEE2E2",
      errorText: "#EB2525",
      warning: "#F97316",
      warningBg: "#FFF7ED",
      warningText: "#EA7F0C",
      success: "#22C55E",
      successBg: "#F0FDF4",
      successText: "#16A34A",
    },
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    //palette "calanque" mode sombre
    primary: "#48A4F4",
    secondary: "#00B4D8",
    surface: "#151718",
    border: "#334155",
    textMuted: "#94A3B8",
    status: {
      error: "#F87171",
      errorBg: "#7F1D1D",
      warning: "#FB923C",
      warningBg: "#7C2D12",
      success: "#4ADE80",
      successBg: "#14532D",
    },
  },
};

export const APP_COLORS = {
  primary: "#48a4f4",
  secondary: "#10ac56",
  blueDark: "#023e8a",
  blue: "#0077b6",

  background: "#f8fafc",
  surface: "#ffffff",
  border: "#e2e8f0",

  text: "#0f172a",
  textMuted: "#64748b",

  white: "#ffffff",

  status: {
    pending: "#eb2525",
    inProgress: "#f97316",
    resolved: "#10ac56",
    danger: "#dc2626",
  },

  gradient: {
    start: "#48a4f4",
    end: "#10ac56",
  },
};
export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
