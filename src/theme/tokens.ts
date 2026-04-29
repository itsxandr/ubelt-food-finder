export const accent = {
  50: "#FFFAEC",
  100: "#FFF4D3",
  200: "#FFE5A5",
  300: "#FFD16D",
  400: "#FFB232",
  500: "#FF990A",
  600: "#FF8400", // main
  700: "#CC6002",
  800: "#A14B0B",
  900: "#823F0C",
  950: "#461E04",
} as const;

export const colors = {
  // Layer 1 neutrals
  bg: "#F7F7F7",
  surface: "#FFFFFF",
  soft: "#FAFAFA",
  mutedBtn: "#EFEFEF",

  text: "#111111",
  subtext: "#555555",
  mutedText: "#666666",

  border: "#EAEAEA",
  borderStrong: "#D9D9D9",

  // Layer 2 functional accent (orange)
  primary: accent[600],
  primaryHover: accent[700],
  primarySoft: accent[50], // selected bg
  primarySoft2: accent[100], // optional alt selected bg
  primaryBorder: accent[600],
  primaryText: "#FFFFFF", // text on primary button

  mutedBtnText: "#111111",

  // status
  successSoft: "#EAF8EE",
  successText: "#157347",
} as const;

export const radius = {
  sm: 10,
  md: 12,
  lg: 14,
  xl: 18,
  pill: 999,
};

export const space = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const type = {
  hero: 40,
  h1: 24,
  h2: 18,
  body: 14,
  small: 12,
};
