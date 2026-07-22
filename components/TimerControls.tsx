/**
 * TimerControls.tsx - Start/Pause, Stop, and Skip buttons.
 *
 * ACCESSIBILITY NOTES:
 * - All buttons have accessibilityLabel for screen readers.
 * - Minimum touch target size is 48x48 (WCAG guideline).
 * - Good color contrast against the dark background.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, MIN_BUTTON_SIZE } from '../utils/constants';
import { useThemeColors } from '../hooks/useThemeColors';

interface TimerControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onSkip: () => void;
}

export function TimerControls({
  isRunning,
  onStart,
  onPause,
  onStop,
  onSkip,
}: TimerControlsProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      {/* Stop button */}
      <Pressable
        onPress={onStop}
        style={({ pressed }) => [
          styles.button,
          styles.secondaryButton,
          { backgroundColor: colors.surface, borderColor: colors.border },
          pressed && styles.pressed,
        ]}
        accessibilityLabel="Stop timer and reset"
        accessibilityRole="button"
      >
        <Ionicons name="stop" size={24} color={colors.textSecondary} />
      </Pressable>

      {/* Start / Pause button (the big center one) */}
      <Pressable
        onPress={isRunning ? onPause : onStart}
        style={({ pressed }) => [
          styles.button,
          styles.primaryButton,
          { backgroundColor: colors.focus },
          pressed && styles.pressed,
        ]}
        accessibilityLabel={isRunning ? 'Pause timer' : 'Start timer'}
        accessibilityRole="button"
      >
        <Ionicons
          name={isRunning ? 'pause' : 'play'}
          size={36}
          color={colors.buttonText}
        />
      </Pressable>

      {/* Skip button */}
      <Pressable
        onPress={onSkip}
        style={({ pressed }) => [
          styles.button,
          styles.secondaryButton,
          { backgroundColor: colors.surface, borderColor: colors.border },
          pressed && styles.pressed,
        ]}
        accessibilityLabel="Skip to next phase"
        accessibilityRole="button"
      >
        <Ionicons name="play-forward" size={24} color={colors.textSecondary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginTop: 40,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999, // Makes it a perfect circle
    minWidth: MIN_BUTTON_SIZE,
    minHeight: MIN_BUTTON_SIZE,
  },
  primaryButton: {
    width: 80,
    height: 80,
    backgroundColor: Colors.focus,
    // Add a subtle shadow for depth
    ...Platform.select({
      ios: {
        shadowColor: Colors.focus,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: `0 4px 16px ${Colors.focus}66`,
      },
    }),
  },
  secondaryButton: {
    width: 56,
    height: 56,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
});
