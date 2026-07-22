/**
 * constants.ts - Default values and theme colors for the app.
 *
 * WHY THIS FILE EXISTS:
 * Instead of scattering magic numbers and color codes throughout the app,
 * we keep them in one place. This makes it easy to tweak the look and
 * behavior without hunting through many files.
 */

// ─── Default Timer Durations (in minutes) ─────────────────────────────────────
export const DEFAULT_FOCUS_MINUTES = 25;
export const DEFAULT_SHORT_BREAK_MINUTES = 5;
export const DEFAULT_LONG_BREAK_MINUTES = 15;
export const DEFAULT_CYCLES_BEFORE_LONG_BREAK = 4;

// ─── Timer Phases ──────────────────────────────────────────────────────────────
// These are the possible states the timer can be in.
export type TimerPhase = 'focus' | 'shortBreak' | 'longBreak';

// Human-readable labels for each phase
export const PHASE_LABELS: Record<TimerPhase, string> = {
  focus: '🎯 Focus',
  shortBreak: '☕ Short Break',
  longBreak: '🌴 Long Break',
};

// ─── Color Theme ───────────────────────────────────────────────────────────────
// A vibrant, accessible color palette with good contrast ratios.
export const Colors = {
  // Background colors
  background: '#1a1a2e',
  surface: '#16213e',
  surfaceLight: '#0f3460',

  // Primary accent colors for each phase
  focus: '#e94560',       // Warm red for focus — energizing!
  shortBreak: '#00b4d8',  // Cool blue for short breaks — refreshing
  longBreak: '#06d6a0',   // Green for long breaks — relaxing

  // Text colors
  textPrimary: '#ffffff',
  textSecondary: '#a0a0b0',
  textMuted: '#6c6c80',

  // UI elements
  cardBackground: '#1e2a4a',
  border: '#2a3a5a',
  buttonText: '#ffffff',
  danger: '#ff6b6b',
  success: '#51cf66',

  // High contrast alternatives (for accessibility setting)
  highContrast: {
    background: '#000000',
    surface: '#1a1a1a',
    textPrimary: '#ffffff',
    textSecondary: '#e0e0e0',
    focus: '#ff4444',
    shortBreak: '#44aaff',
    longBreak: '#44ff88',
  },
};

// ─── Storage Keys ──────────────────────────────────────────────────────────────
// Keys used to save/load data from AsyncStorage (the phone's local storage).
export const STORAGE_KEYS = {
  SETTINGS: '@timeflux/settings',
  STATS: '@timeflux/stats',
};

// ─── Accessibility ─────────────────────────────────────────────────────────────
export const MIN_BUTTON_SIZE = 48; // Minimum touch target (WCAG guideline)
