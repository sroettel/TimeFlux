/**
 * StatsContext.tsx - Shared statistics state for the entire app.
 *
 * Just like SettingsContext, this ensures all tabs share the same
 * stats data. When a focus session completes on the Timer tab,
 * the Stats tab sees the updated counts immediately.
 */

import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { saveData, loadData } from '../utils/storage';
import { STORAGE_KEYS } from '../utils/constants';

// The shape of our statistics data
export interface StatsData {
  totalSessions: number;
  totalMinutes: number;
  todaySessions: number;
  streak: number;
  lastSessionDate: string; // ISO date string like "2024-01-15"
}

const DEFAULT_STATS: StatsData = {
  totalSessions: 0,
  totalMinutes: 0,
  todaySessions: 0,
  streak: 0,
  lastSessionDate: '',
};

// Helper: Get today's date as a string like "2024-01-15"
function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

// Helper: Get yesterday's date string
function getYesterdayString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

interface StatsContextValue {
  stats: StatsData;
  recordSession: (minutes: number) => void;
  resetStats: () => void;
  isLoaded: boolean;
}

const StatsContext = createContext<StatsContextValue>({
  stats: DEFAULT_STATS,
  recordSession: () => {},
  resetStats: () => {},
  isLoaded: false,
});

/**
 * StatsProvider wraps the app and provides stats tracking to all children.
 */
export function StatsProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<StatsData>(DEFAULT_STATS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load stats from storage on first render
  useEffect(() => {
    async function load() {
      const saved = await loadData<StatsData>(STORAGE_KEYS.STATS);
      if (saved) {
        const today = getTodayString();
        if (saved.lastSessionDate !== today) {
          saved.todaySessions = 0;
        }
        setStats({ ...DEFAULT_STATS, ...saved });
      }
      setIsLoaded(true);
    }
    load();
  }, []);

  // Auto-save whenever stats change
  useEffect(() => {
    if (isLoaded) {
      saveData(STORAGE_KEYS.STATS, stats);
    }
  }, [stats, isLoaded]);

  /**
   * Record a completed focus session.
   * @param minutes - How many minutes the session lasted
   */
  const recordSession = useCallback((minutes: number) => {
    setStats((prev) => {
      const today = getTodayString();
      const yesterday = getYesterdayString();

      let newStreak = prev.streak;
      if (prev.lastSessionDate === today) {
        newStreak = prev.streak;
      } else if (prev.lastSessionDate === yesterday) {
        newStreak = prev.streak + 1;
      } else {
        newStreak = 1;
      }

      return {
        totalSessions: prev.totalSessions + 1,
        totalMinutes: prev.totalMinutes + minutes,
        todaySessions: (prev.lastSessionDate === today ? prev.todaySessions : 0) + 1,
        streak: newStreak,
        lastSessionDate: today,
      };
    });
  }, []);

  const resetStats = useCallback(() => {
    setStats(DEFAULT_STATS);
  }, []);

  return (
    <StatsContext.Provider value={{ stats, recordSession, resetStats, isLoaded }}>
      {children}
    </StatsContext.Provider>
  );
}

/**
 * Hook to access stats from any component inside StatsProvider.
 */
export function useStatsContext() {
  return useContext(StatsContext);
}
