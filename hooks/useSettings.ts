/**
 * useSettings.ts - Hook for accessing app settings.
 *
 * WHAT IS A HOOK?
 * In React, a "hook" is a function that lets components use features like
 * state (remembering values) and effects (doing things when values change).
 *
 * This hook is a thin wrapper around SettingsContext. It lets any component
 * read and update settings — and because it uses React Context, changes
 * made on the Settings tab are instantly visible on the Timer and Stats tabs.
 *
 * See contexts/SettingsContext.tsx for the actual state management logic.
 */

import { useSettingsContext } from '../contexts/SettingsContext';

// Re-export the type so existing imports still work
export type { AppSettings } from '../contexts/SettingsContext';

export function useSettings() {
  return useSettingsContext();
}
