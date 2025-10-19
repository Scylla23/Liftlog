import { Platform } from 'react-native';

export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const lineHeight = {
  tight: 1.2, // For headings
  normal: 1.4, // For body text
  relaxed: 1.6, // For long-form content
};

export const fontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const fontFamily = {
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
    web: 'system-ui',
  }),
  medium: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
    web: 'system-ui',
  }),
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto-Bold',
    web: 'system-ui',
  }),
};
