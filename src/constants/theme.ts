/**
 * App.js Conference 2026 theme colors
 * Based on https://appjs.co/ design
 * Light lavender-blue backgrounds with dark purple-brown accents
 */

// App.js Conference brand colors
const primaryDark = "#271c2d"; // Main accent - dark purple-brown (from website)
const accentPurple = "#3d2847"; // Secondary accent - medium purple
const accentLight = "#4a3654"; // Tertiary accent
const accentCoral = "#FF6B6B"; // Danger/like color

// Brand background colors
const bgLightBlue = "#dfe7ff"; // Light blue-lavender (main website bg)
const bgOffWhite = "#fdfcfc"; // Off-white (card backgrounds)
const bgDark = "#271c2d"; // Dark purple-brown
const bgLightPurple = "#efecf3"; // Light purple-gray

export const Colors = {
  light: {
    text: "#271c2d",
    background: bgLightBlue, // Lavender-blue like the website
    tint: primaryDark,
    icon: "#5a4d63",
    tabIconDefault: "#7a6d83",
    tabIconSelected: primaryDark,
    accent: accentPurple,
    secondary: accentLight,
    danger: accentCoral,
    cardBackground: bgOffWhite,
    cardBackgroundAlt: bgLightPurple,
    border: "#c5c0cc",
    gradientStart: bgLightBlue,
    gradientEnd: bgLightPurple
  },
  dark: {
    text: "#ffffff",
    background: bgDark,
    tint: "#dfe7ff", // Light lavender as accent in dark mode
    icon: "#b8afc2",
    tabIconDefault: "#8a7d94",
    tabIconSelected: "#dfe7ff",
    accent: "#9d8faa",
    secondary: "#7a6d83",
    danger: accentCoral,
    cardBackground: "#362a3d",
    cardBackgroundAlt: "#3d3147",
    border: "#4a3d54",
    gradientStart: "#362a3d",
    gradientEnd: "#271c2d"
  }
};

