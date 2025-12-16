export const spacing = {
  xs: 6,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl:44
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
export type ThemeVariant = 'light' | 'warm' | 'dark' | 'blue' | 'green' | 'purple' | 'pink' | 'ocean' | 'amber';

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
  backgroundColor: '#0F0F1E',
  colors: {
    ...colors,
    background: '#0F0F1E',
    surface: '#1A1A2A',
    surfaceVariant: '#252538',
    onSurface: '#E8E8F0',
    onSurfaceVariant: '#A0A0B0',
    border: '#2A2A3A',
    outline: '#2A2A3A',
  },
};

export const blueTheme = {
  name: 'blue' as ThemeVariant,
  backgroundColor: '#E8F4FD',
  colors: {
    ...colors,
    primary: '#0066CC',
    background: '#E8F4FD',
    surface: '#F0F8FF',
    surfaceVariant: '#D0E8FF',
    primaryLight: '#E0F0FF',
  },
};

export const greenTheme = {
  name: 'green' as ThemeVariant,
  backgroundColor: '#E8F5E9',
  colors: {
    ...colors,
    primary: '#2E7D32',
    background: '#E8F5E9',
    surface: '#F1F8F4',
    surfaceVariant: '#C8E6C9',
    primaryLight: '#E0F2E1',
  },
};

export const purpleTheme = {
  name: 'purple' as ThemeVariant,
  backgroundColor: '#F3E5F5',
  colors: {
    ...colors,
    primary: '#7B1FA2',
    background: '#F3E5F5',
    surface: '#FAF5FC',
    surfaceVariant: '#E1BEE7',
    primaryLight: '#F0E5F5',
  },
};

export const pinkTheme = {
  name: 'pink' as ThemeVariant,
  backgroundColor: '#FCE4EC',
  colors: {
    ...colors,
    primary: '#C2185B',
    background: '#FCE4EC',
    surface: '#FFF0F5',
    surfaceVariant: '#F8BBD0',
    primaryLight: '#FFE5ED',
  },
};

export const oceanTheme = {
  name: 'ocean' as ThemeVariant,
  backgroundColor: '#E0F2F1',
  colors: {
    ...colors,
    primary: '#00695C',
    background: '#E0F2F1',
    surface: '#F0F9F8',
    surfaceVariant: '#B2DFDB',
    primaryLight: '#E0F0EF',
  },
};

export const amberTheme = {
  name: 'amber' as ThemeVariant,
  backgroundColor: '#FFF8E1',
  colors: {
    ...colors,
    primary: '#FF6F00',
    background: '#FFF8E1',
    surface: '#FFFEF5',
    surfaceVariant: '#FFE082',
    primaryLight: '#FFF3E0',
  },
};

export const themes = {
  light: lightTheme,
  warm: warmTheme,
  dark: darkTheme,
  blue: blueTheme,
  green: greenTheme,
  purple: purpleTheme,
  pink: pinkTheme,
  ocean: oceanTheme,
  amber: amberTheme,
};

// export default {
//   spacing,
//   radii,
//   type,
//   colors,
//   radius,
//   typography
// };
