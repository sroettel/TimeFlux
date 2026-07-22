/**
 * app/(tabs)/index.tsx - The TIMER screen (main screen).
 *
 * This is what users see first when they open the app.
 * It shows the countdown timer, progress ring, phase info, and controls.
 *
 * HAPTICS:
 * We use expo-haptics to make the phone vibrate slightly when the user
 * taps buttons. This gives tactile feedback — the phone "responds" to touch.
 * On web, haptics are silently ignored (no vibration motors in laptops!).
 */

import React, { useCallback } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { ProgressRing } from '../../components/ProgressRing';
import { TimerDisplay } from '../../components/TimerDisplay';
import { TimerControls } from '../../components/TimerControls';
import { useTimer } from '../../hooks/useTimer';
import { useSettings } from '../../hooks/useSettings';
import { useStats } from '../../hooks/useStats';
import { useThemeColors } from '../../hooks/useThemeColors';
import { Colors, TimerPhase } from '../../utils/constants';

export default function TimerScreen() {
  // Get settings and stats from our custom hooks
  const { settings } = useSettings();
  const { recordSession } = useStats();
  const colors = useThemeColors();

  // Trigger haptic feedback (vibration) — safe to call on web too
  const triggerHaptic = useCallback(
    (type: 'light' | 'medium' | 'heavy' | 'success') => {
      // Haptics only work on native (iOS/Android), not web
      if (Platform.OS === 'web') return;

      switch (type) {
        case 'light':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case 'success':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
      }
    },
    []
  );

  // Called when a timer phase naturally completes (time runs out)
  const handlePhaseComplete = useCallback(
    (phase: TimerPhase) => {
      triggerHaptic('success');
      // Only record stats when a FOCUS session completes
      if (phase === 'focus') {
        recordSession(settings.focusMinutes);
      }
    },
    [settings.focusMinutes, recordSession, triggerHaptic]
  );

  // Initialize the timer with current settings
  const { state, actions } = useTimer(
    {
      focusMinutes: settings.focusMinutes,
      shortBreakMinutes: settings.shortBreakMinutes,
      longBreakMinutes: settings.longBreakMinutes,
      cyclesBeforeLongBreak: settings.cyclesBeforeLongBreak,
    },
    handlePhaseComplete
  );

  // Calculate progress (1 = full, 0 = empty)
  const progress = state.totalSeconds > 0
    ? state.secondsRemaining / state.totalSeconds
    : 0;

  // Pick the ring color based on the current phase
  const phaseColor =
    state.phase === 'focus'
      ? colors.focus
      : state.phase === 'shortBreak'
      ? colors.shortBreak
      : colors.longBreak;

  // ─── Handlers with haptic feedback ───────────────────────────────────────
  const handleStart = () => {
    triggerHaptic('medium');
    actions.start();
  };

  const handlePause = () => {
    triggerHaptic('light');
    actions.pause();
  };

  const handleStop = () => {
    triggerHaptic('heavy');
    actions.stop();
  };

  const handleSkip = () => {
    triggerHaptic('medium');
    actions.skip();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Progress ring with timer display centered inside */}
        <View style={styles.timerContainer}>
          <ProgressRing
            progress={progress}
            color={phaseColor}
            size={280}
            strokeWidth={12}
            reducedMotion={settings.reducedMotion}
          />
          {/* Position the text in the center of the ring */}
          <View style={styles.timerOverlay}>
            <TimerDisplay
              secondsRemaining={state.secondsRemaining}
              phase={state.phase}
              currentCycle={state.currentCycle}
              totalCycles={state.totalCycles}
            />
          </View>
        </View>

        {/* Control buttons */}
        <TimerControls
          isRunning={state.isRunning}
          onStart={handleStart}
          onPause={handlePause}
          onStop={handleStop}
          onSkip={handleSkip}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 280,
    height: 280,
  },
  timerOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
