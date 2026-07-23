/**
 * SettingsContext.tsx - Shared settings state for the entire app.
 *
 * WHY A CONTEXT?
 * In React, a "context" lets you share data between components without
 * passing it through every level of props. Since our app has multiple
 * tabs that all need the same settings, a context ensures that when
 * you change a setting on the Settings tab, the Timer and Stats tabs
 * see the change immediately — no app restart needed!
 */

import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { saveData, loadData } from '../utils/storage';
import {
  STORAGE_KEYS,
  DEFAULT_FOCUS_MINUTES,
  DEFAULT_SHORT_BREAK_MINUTES,
  DEFAULT_LONG_BREAK_MINUTES,
  DEFAULT_CYCLES_BEFORE_LONG_BREAK,
  ColorScheme,
} from '../utils/constants';

// The shape of our settings object
export interface AppSettings {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  cyclesBeforeLongBreak: number;
  colorScheme: ColorScheme;
  highContrast: boolean;
  reducedMotion: boolean;
}

// What the app starts with if no settings are saved
const DEFAULT_SETTINGS: AppSettings = {
  focusMinutes: DEFAULT_FOCUS_MINUTES,
  shortBreakMinutes: DEFAULT_SHORT_BREAK_MINUTES,
  longBreakMinutes: DEFAULT_LONG_BREAK_MINUTES,
  cyclesBeforeLongBreak: DEFAULT_CYCLES_BEFORE_LONG_BREAK,
  colorScheme: 'dark',
  highContrast: false,
  reducedMotion: false,
};

// The shape of data the context provides to consumers
interface SettingsContextValue {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  resetSettings: () => void;
  isLoaded: boolean;
}

// Create the context with sensible defaults
const SettingsContext = createContext<SettingsContextValue>({
  settings: DEFAULT_SETTINGS,
  updateSettings: () => {},
  resetSettings: () => {},
  isLoaded: false,
});

/**
 * SettingsProvider wraps the app and provides settings to all children.
 * Place this near the top of your component tree (in _layout.tsx).
 */
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved settings from device storage on first render
  useEffect(() => {
    async function load() {
      const saved = await loadData<AppSettings>(STORAGE_KEYS.SETTINGS);
      if (saved) {
        // Merge with defaults so any new settings added in updates have values
        setSettings({ ...DEFAULT_SETTINGS, ...saved });
      }
      setIsLoaded(true);
    }
    load();
  }, []);

  // Auto-save whenever settings change (but not before initial load)
  useEffect(() => {
    if (isLoaded) {
      saveData(STORAGE_KEYS.SETTINGS, settings);
    }
  }, [settings, isLoaded]);

  // Update one or more settings at a time
  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  // Reset everything back to defaults
  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings, isLoaded }}>
      {children}
    </SettingsContext.Provider>
  );
}

/**
 * Hook to access settings from any component inside SettingsProvider.
 */
export function useSettingsContext() {
  return useContext(SettingsContext);
}
