export const spacing = {
  xs: 6,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radii = {
  sm: 6,
  md: 10,
  lg: 14,
};

export const type = {
  header: 20,
  title: 16,
  body: 14,
  small: 12,
};

export const colors = {
  primary: "#0B84FF",
  onPrimary: "#FFFFFF",
  background: "#F7F9FC",
  surface: "#FFFFFF",
  surfaceVariant: "#F0F3F7",
  onSurface: "#1F2937",
  onSurfaceVariant: "#6B7280",
  text: "#0F1720",
  muted: "#64748B",
  outline: "#E6EEF8",
  error: "#FF4D4F",
  border: "#E5E7EB",
  divider: "#F0F0F0",
  primaryLight: "#EEF2FF",
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',
};


export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
};

export const typography = {
  heading1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
  },
  heading2: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
  heading3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
};


// Theme variants with different background colors
export type ThemeVariant = 'light' | 'warm' | 'dark';

export const lightTheme = {
  name: 'light' as ThemeVariant,
  backgroundColor: '#FFFFFF',
  colors: {
    ...colors,
    background: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceVariant: '#F3F4F6',
  },
};

export const warmTheme = {
  name: 'warm' as ThemeVariant,
  backgroundColor: '#FFF8F0',
  colors: {
    ...colors,
    background: '#FFF8F0',
    surface: '#FFFBF7',
    surfaceVariant: '#FFE8D6',
  },
};

export const darkTheme = {
  name: 'dark' as ThemeVariant,
  backgroundColor: '#1A1A2E',
  colors: {
    ...colors,
    background: '#1A1A2E',
    surface: '#16213E',
    surfaceVariant: '#0F3460',
    onSurface: '#FFFFFF',
    onSurfaceVariant: '#B0B0B0',
  },
};

export const themes = {
  light: lightTheme,
  warm: warmTheme,
  dark: darkTheme,
};

// export default {
//   spacing,
//   radii,
//   type,
//   colors,
//   radius,
//   typography
// };
