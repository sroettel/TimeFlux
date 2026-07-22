/**
 * useTimer.ts - The core timer logic for the Pomodoro app.
 *
 * HOW A POMODORO TIMER WORKS:
 * 1. You focus for X minutes (a "focus session").
 * 2. Then take a short break.
 * 3. After N cycles of focus + short break, you take a long break.
 * 4. Repeat!
 *
 * This hook manages:
 * - Counting down seconds
 * - Switching between phases (focus → break → focus → ...)
 * - Tracking which cycle you're on
 *
 * WHAT IS useRef vs useState?
 * - useState: When it changes, the screen re-renders (redraws).
 * - useRef: Remembers a value WITHOUT causing re-renders.
 *   We use useRef for the interval ID because we don't want to
 *   redraw the screen just because we stored a timer reference.
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import { TimerPhase } from '../utils/constants';

// What this hook needs to know (from settings)
interface TimerConfig {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  cyclesBeforeLongBreak: number;
}

// What this hook provides to components
export interface TimerState {
  phase: TimerPhase;
  secondsRemaining: number;
  totalSeconds: number;
  isRunning: boolean;
  currentCycle: number;       // Which focus session you're on (1, 2, 3...)
  totalCycles: number;        // How many before a long break
}

export function useTimer(
  config: TimerConfig,
  onPhaseComplete?: (phase: TimerPhase) => void
) {
  // ─── State ─────────────────────────────────────────────────────────────────
  const [phase, setPhase] = useState<TimerPhase>('focus');
  const [isRunning, setIsRunning] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(1);

  // Calculate total seconds for current phase
  const getTotalSeconds = useCallback(
    (p: TimerPhase) => {
      switch (p) {
        case 'focus':
          return config.focusMinutes * 60;
        case 'shortBreak':
          return config.shortBreakMinutes * 60;
        case 'longBreak':
          return config.longBreakMinutes * 60;
      }
    },
    [config.focusMinutes, config.shortBreakMinutes, config.longBreakMinutes]
  );

  const [secondsRemaining, setSecondsRemaining] = useState(
    getTotalSeconds('focus')
  );
  const [totalSeconds, setTotalSeconds] = useState(getTotalSeconds('focus'));

  // useRef to store the interval ID (we don't want re-renders when this changes)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── Core Timer Logic ──────────────────────────────────────────────────────

  // Start or resume the countdown
  const start = useCallback(() => {
    if (isRunning) return; // Already running, do nothing
    setIsRunning(true);
  }, [isRunning]);

  // Pause the countdown
  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  // Stop and reset current phase
  const stop = useCallback(() => {
    setIsRunning(false);
    const total = getTotalSeconds(phase);
    setSecondsRemaining(total);
  }, [phase, getTotalSeconds]);

  // Move to the next phase
  const moveToNextPhase = useCallback(() => {
    let nextPhase: TimerPhase;

    if (phase === 'focus') {
      // After focus: short break or long break?
      if (currentCycle >= config.cyclesBeforeLongBreak) {
        nextPhase = 'longBreak';
      } else {
        nextPhase = 'shortBreak';
      }
    } else {
      // After any break: back to focus
      nextPhase = 'focus';
      if (phase === 'longBreak') {
        // Reset cycle counter after a long break
        setCurrentCycle(1);
      } else {
        // Increment cycle after a short break
        setCurrentCycle((c) => c + 1);
      }
    }

    const total = getTotalSeconds(nextPhase);
    setPhase(nextPhase);
    setSecondsRemaining(total);
    setTotalSeconds(total);
    setIsRunning(false);
  }, [phase, currentCycle, config.cyclesBeforeLongBreak, getTotalSeconds]);

  // Skip to next phase (user-triggered)
  const skip = useCallback(() => {
    moveToNextPhase();
  }, [moveToNextPhase]);

  // ─── The Countdown Effect ──────────────────────────────────────────────────
  // This runs every time `isRunning` changes. It sets up or clears an interval.
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            // Timer finished! Notify and move to next phase.
            onPhaseComplete?.(phase);
            // We'll trigger the phase change after clearing the interval
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Not running — clear the interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Cleanup: clear interval when component unmounts or effect re-runs
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  // When timer hits 0 and stops, automatically advance
  useEffect(() => {
    if (!isRunning && secondsRemaining === 0) {
      moveToNextPhase();
    }
  }, [isRunning, secondsRemaining, moveToNextPhase]);

  // When settings change and timer isn't running, update the display
  useEffect(() => {
    if (!isRunning) {
      const total = getTotalSeconds(phase);
      setTotalSeconds(total);
      setSecondsRemaining(total);
    }
  }, [config.focusMinutes, config.shortBreakMinutes, config.longBreakMinutes]);

  // ─── Return everything components need ─────────────────────────────────────
  return {
    state: {
      phase,
      secondsRemaining,
      totalSeconds,
      isRunning,
      currentCycle,
      totalCycles: config.cyclesBeforeLongBreak,
    } as TimerState,
    actions: { start, pause, stop, skip },
  };
}
