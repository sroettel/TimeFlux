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
import { Colors } from '../utils/constants';

export type ThemeColors = typeof Colors;

export function useThemeColors(): ThemeColors {
  const { settings } = useSettings();

  return useMemo(() => {
    if (!settings.highContrast) return Colors;

    // Override key colors for better contrast.
    // We spread the default Colors first so we keep any properties
    // not explicitly overridden (like highContrast sub-object).
    return {
      ...Colors,
      background: '#000000',
      surface: '#1a1a1a',
      surfaceLight: '#333333',
      focus: '#ff4444',
      shortBreak: '#44aaff',
      longBreak: '#44ff88',
      textPrimary: '#ffffff',
      textSecondary: '#e0e0e0',
      textMuted: '#b0b0b0',
      cardBackground: '#1a1a1a',
      border: '#555555',
      danger: '#ff6b6b',
      success: '#55ff77',
    };
  }, [settings.highContrast]);
}
