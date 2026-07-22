/**
 * TimerDisplay.tsx - Shows the countdown time in MM:SS format.
 *
 * This component takes the remaining seconds and formats them into
 * a human-readable time. It's placed inside the progress ring.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, PHASE_LABELS, TimerPhase } from '../utils/constants';
import { useThemeColors } from '../hooks/useThemeColors';

interface TimerDisplayProps {
  secondsRemaining: number;
  phase: TimerPhase;
  currentCycle: number;
  totalCycles: number;
}

export function TimerDisplay({
  secondsRemaining,
  phase,
  currentCycle,
  totalCycles,
}: TimerDisplayProps) {
  const colors = useThemeColors();

  // Convert total seconds into minutes and seconds
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  // Pad with leading zeros: 5 → "05"
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;

  return (
    <View style={styles.container} accessibilityRole="timer">
      <Text
        style={[styles.time, { color: colors.textPrimary }]}
        accessibilityLabel={`${minutes} minutes and ${seconds} seconds remaining`}
      >
        {timeString}
      </Text>
      <Text style={[styles.phase, { color: colors.textSecondary }]}>{PHASE_LABELS[phase]}</Text>
      <Text style={[styles.cycle, { color: colors.textMuted }]}>
        Cycle {currentCycle} of {totalCycles}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: {
    fontSize: 64,
    fontWeight: '200',
    color: Colors.textPrimary,
    fontVariant: ['tabular-nums'], // Keeps digits from jumping around
    letterSpacing: 2,
  },
  phase: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginTop: 8,
    fontWeight: '600',
  },
  cycle: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 4,
  },
});
