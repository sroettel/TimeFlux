/**
 * useStats.ts - Hook for accessing Pomodoro statistics.
 *
 * This hook is a thin wrapper around StatsContext. It lets any component
 * read stats and record completed sessions — and because it uses React
 * Context, updates from the Timer tab are instantly visible on the Stats tab.
 *
 * See contexts/StatsContext.tsx for the actual tracking logic.
 */

import { useStatsContext } from '../contexts/StatsContext';

// Re-export the type so existing imports still work
export type { StatsData } from '../contexts/StatsContext';

export function useStats() {
  return useStatsContext();
}
