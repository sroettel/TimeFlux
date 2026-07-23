/**
 * useThemeColors.ts - Returns the right colors based on the high-contrast setting.
 *
 * WHY THIS HOOK?
 * The app has two color modes: the default vibrant dark theme and a
 * high-contrast mode for accessibility. This hook reads the current
 * setting and returns the appropriate color palette. Components use
 * these colors instead of importing Colors directly from constants.
 */

import { useMemo } from 'react';
import { useSettings } from './useSettings';
import { Colors, LightColors } from '../utils/constants';

export type ThemeColors = typeof Colors;

export function useThemeColors(): ThemeColors {
  const { settings } = useSettings();

  return useMemo(() => {
    const baseColors = settings.colorScheme === 'light' ? LightColors : Colors;

    if (!settings.highContrast) return baseColors;

    // Override key colors for better contrast.
    const hc = baseColors.highContrast;
    return {
      ...baseColors,
      background: hc.background,
      surface: hc.surface,
      surfaceLight: settings.colorScheme === 'light' ? '#d0d0d0' : '#333333',
      focus: hc.focus,
      shortBreak: hc.shortBreak,
      longBreak: hc.longBreak,
      textPrimary: hc.textPrimary,
      textSecondary: hc.textSecondary,
      textMuted: settings.colorScheme === 'light' ? '#555555' : '#b0b0b0',
      cardBackground: hc.surface,
      border: settings.colorScheme === 'light' ? '#aaaaaa' : '#555555',
      danger: settings.colorScheme === 'light' ? '#b71c1c' : '#ff6b6b',
      success: settings.colorScheme === 'light' ? '#1b5e20' : '#55ff77',
    };
  }, [settings.highContrast, settings.colorScheme]);
}
